import Consultant from '../models/Consultant.js';
import VisitAssignment from '../models/VisitAssignment.js';
import Booking from '../models/Booking.js';
import { normaliseDateString } from './assignment.service.js';

/**
 * Resolve the Consultant profile for the logged-in user.
 * Throws 404 if no Consultant profile is linked to this userId.
 */
export const getConsultantProfile = async (userId) => {
  const consultant = await Consultant.findOne({ user: userId }).lean();
  if (!consultant) {
    const error = new Error('No consultant profile linked to this user account.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_PROFILE_NOT_FOUND';
    throw error;
  }
  return consultant;
};

/**
 * Get today's assigned visits for the consultant.
 * Scoped strictly to this consultant — never exposes another consultant's data.
 */
export const getTodayVisits = async (consultantId) => {
  const today = normaliseDateString(new Date().toISOString().split('T')[0]);

  const assignments = await VisitAssignment.find({
    consultant: consultantId,
    date: today,
    status: { $ne: 'Cancelled' },
  })
    .populate({
      path: 'visitRequest',
      populate: { path: 'property', select: 'title location city imageUrl' },
    })
    .sort({ assignedAt: 1 })
    .lean();

  return assignments;
};

/**
 * Get upcoming visits (future dates, non-cancelled).
 */
export const getUpcomingVisits = async (consultantId) => {
  const today = normaliseDateString(new Date().toISOString().split('T')[0]);

  const assignments = await VisitAssignment.find({
    consultant: consultantId,
    date: { $gt: today },
    status: { $ne: 'Cancelled' },
  })
    .populate({
      path: 'visitRequest',
      populate: { path: 'property', select: 'title location city imageUrl' },
    })
    .sort({ date: 1 })
    .lean();

  return assignments;
};

/**
 * Get completed visits (Booking.status === 'Completed', scoped to this consultant).
 */
export const getCompletedVisits = async (consultantId) => {
  // Find all assignment ids for this consultant
  const assignments = await VisitAssignment.find({
    consultant: consultantId,
  })
    .populate({
      path: 'visitRequest',
      match: { status: 'Completed' },
      populate: { path: 'property', select: 'title location city imageUrl' },
    })
    .sort({ date: -1 })
    .lean();

  // Filter out those where visitRequest didn't match (status !== Completed)
  return assignments.filter((a) => a.visitRequest !== null);
};

/**
 * Update visit status — consultant can only mark visits they're assigned to.
 * Allowed transitions: Confirmed → Completed | No-show
 */
export const updateVisitStatus = async (assignmentId, consultantId, status) => {
  const ALLOWED_STATUSES = ['Confirmed', 'Completed', 'No-show', 'Cancelled'];
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    error.statusCode = 400;
    error.code = 'INVALID_STATUS';
    throw error;
  }

  // Verify ownership — consultant can only update their own visits
  const assignment = await VisitAssignment.findOne({
    _id: assignmentId,
    consultant: consultantId,
  });

  if (!assignment) {
    const error = new Error('Assignment not found or not assigned to you.');
    error.statusCode = 404;
    error.code = 'ASSIGNMENT_NOT_FOUND';
    throw error;
  }

  // Update the linked Booking status
  const updatedBooking = await Booking.findByIdAndUpdate(
    assignment.visitRequest,
    { status },
    { new: true }
  ).lean();

  return { assignment, booking: updatedBooking };
};

const consultantDashboardService = {
  getConsultantProfile,
  getTodayVisits,
  getUpcomingVisits,
  getCompletedVisits,
  updateVisitStatus,
};

export default consultantDashboardService;
