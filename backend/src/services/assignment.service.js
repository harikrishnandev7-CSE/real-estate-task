import Consultant from '../models/Consultant.js';
import VisitAssignment from '../models/VisitAssignment.js';

/**
 * Assignment Engine — isolated service, no direct coupling to HTTP layer.
 *
 * Core rules:
 * 1. Match active consultants in the given city (string match, not ObjectId)
 * 2. Filter to those whose workingDays includes the booking date's weekday
 * 3. Filter to those whose non-cancelled assignment count for that date < maxDailyVisits
 * 4. Pick one at random from the eligible set
 * 5. If no eligible consultant → return null (booking set to PendingAdminReview)
 */

/**
 * Compute ISO weekday number (0=Sunday … 6=Saturday) from a date string.
 * Accepts "YYYY-MM-DD", "DD/MM/YYYY", or any format parseable by new Date().
 *
 * @param {string} dateStr
 * @returns {number} 0-6
 */
export const getWeekdayFromDateString = (dateStr) => {
  if (!dateStr) return -1;

  // Handle DD/MM/YYYY format (common in Indian locale input)
  let parseable = dateStr;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    parseable = `${year}-${month}-${day}`;
  }

  const d = new Date(parseable);
  if (isNaN(d.getTime())) return -1;
  return d.getDay(); // 0=Sunday, 1=Monday, …, 6=Saturday
};

/**
 * Normalise a date string to "YYYY-MM-DD" for consistent DB storage & comparison.
 * Handles "YYYY-MM-DD" and "DD/MM/YYYY".
 *
 * @param {string} dateStr
 * @returns {string}
 */
export const normaliseDateString = (dateStr) => {
  if (!dateStr) return dateStr;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

/**
 * Find an available consultant for a given city (string) and date string.
 *
 * @param {string} city  — plain string (e.g. "Chennai"), NOT an ObjectId
 * @param {string} date  — "YYYY-MM-DD" or "DD/MM/YYYY"
 * @returns {Promise<Consultant|null>}
 */
export const findAvailableConsultant = async (city, date) => {
  if (!city || !date) return null;

  const weekday = getWeekdayFromDateString(date);
  if (weekday === -1) return null;

  const normalisedDate = normaliseDateString(date);

  // Step 1: Find all active consultants in the city who work on this weekday
  const candidateConsultants = await Consultant.find({
    city: { $regex: new RegExp(`^${city}$`, 'i') },
    isActive: true,
    workingDays: weekday,
  }).lean();

  if (candidateConsultants.length === 0) return null;

  // Step 2: For each candidate, count their non-cancelled assignments on this date
  const consultantIds = candidateConsultants.map((c) => c._id);

  const assignmentCounts = await VisitAssignment.aggregate([
    {
      $match: {
        consultant: { $in: consultantIds },
        date: normalisedDate,
        status: { $ne: 'Cancelled' },
      },
    },
    {
      $group: {
        _id: '$consultant',
        count: { $sum: 1 },
      },
    },
  ]);

  // Build a map: consultantId (string) → assignmentCount
  const countMap = {};
  for (const row of assignmentCounts) {
    countMap[row._id.toString()] = row.count;
  }

  // Step 3: Filter consultants who are below their daily cap (dailyVisitCap / maxDailyVisits, default 5)
  const eligible = candidateConsultants.filter((c) => {
    const booked = countMap[c._id.toString()] || 0;
    const cap = c.dailyVisitCap || c.maxDailyVisits || 5;
    return booked < cap;
  });

  if (eligible.length === 0) return null;

  // Step 4: Find the minimum visit count among eligible consultants (least loaded)
  let minCount = Infinity;
  eligible.forEach((c) => {
    const booked = countMap[c._id.toString()] || 0;
    if (booked < minCount) {
      minCount = booked;
    }
  });

  // Step 5: Filter consultants tied for the minimum count
  const leastLoaded = eligible.filter((c) => {
    const booked = countMap[c._id.toString()] || 0;
    return booked === minCount;
  });

  // Step 6: Pick one randomly among the tied least loaded consultants
  const chosen = leastLoaded[Math.floor(Math.random() * leastLoaded.length)];
  return chosen;
};

/**
 * Auto-assign a consultant to a visit request.
 *
 * @param {string} visitRequestId  — Booking._id (ObjectId string)
 * @param {string} city            — plain city string (e.g. "Chennai")
 * @param {string} date            — date string ("YYYY-MM-DD" or "DD/MM/YYYY")
 * @returns {Promise<{ assignment: VisitAssignment|null, consultant: Consultant|null }>}
 */
export const assignVisit = async (visitRequestId, city, date) => {
  const consultant = await findAvailableConsultant(city, date);

  if (!consultant) {
    return { assignment: null, consultant: null };
  }

  const normalisedDate = normaliseDateString(date);

  const assignment = await VisitAssignment.create({
    visitRequest: visitRequestId,
    consultant: consultant._id,
    date: normalisedDate,
    status: 'Assigned',
    assignedBy: 'system',
  });

  return { assignment, consultant };
};

/**
 * Reassign a visit to a different consultant (admin action).
 * Marks the old assignment as 'Cancelled' and creates a new 'Reassigned' record.
 *
 * @param {string} assignmentId      — VisitAssignment._id
 * @param {string} newConsultantId   — Consultant._id
 * @returns {Promise<{ newAssignment: VisitAssignment, newConsultant: Consultant }>}
 */
export const reassignVisit = async (assignmentId, newConsultantId) => {
  const oldAssignment = await VisitAssignment.findById(assignmentId);
  if (!oldAssignment) {
    const error = new Error('Visit assignment not found.');
    error.statusCode = 404;
    error.code = 'ASSIGNMENT_NOT_FOUND';
    throw error;
  }

  const newConsultant = await Consultant.findById(newConsultantId).lean();
  if (!newConsultant) {
    const error = new Error('Target consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  // Cancel the old assignment
  await VisitAssignment.findByIdAndUpdate(assignmentId, { status: 'Cancelled' });

  // Create a new assignment with status 'Reassigned' (for audit trail)
  const newAssignment = await VisitAssignment.create({
    visitRequest: oldAssignment.visitRequest,
    consultant: newConsultantId,
    date: oldAssignment.date,
    status: 'Reassigned',
    assignedBy: 'admin',
  });

  return { newAssignment, newConsultant };
};

const assignmentService = {
  getWeekdayFromDateString,
  normaliseDateString,
  findAvailableConsultant,
  assignVisit,
  reassignVisit,
};

export default assignmentService;
