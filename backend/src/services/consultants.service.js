import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Consultant from '../models/Consultant.js';

/**
 * List consultants with optional filters.
 * ?city=Chennai  →  exact case-insensitive city match (string, not ObjectId)
 * ?status=active | inactive
 */
export const getConsultants = async (query = {}) => {
  const { city, status, search } = query;
  const where = {};

  if (city) where.city = { $regex: new RegExp(`^${city}$`, 'i') };

  if (status === 'active') where.isActive = true;
  else if (status === 'inactive') where.isActive = false;

  if (search) {
    const regex = new RegExp(search, 'i');
    where.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  const consultants = await Consultant.find(where)
    .populate('user', 'email role createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return consultants;
};

/**
 * Create a Consultant.
 * Also creates (or links) a User document with role: 'consultant'
 * so the consultant can log in via the existing /auth/login endpoint.
 *
 * If a User with that email already exists and has role 'consultant',
 * we link to the existing User. Otherwise we create a fresh User.
 */
export const createConsultant = async (data) => {
  const {
    name,
    phone,
    email,
    city,
    password,
    maxDailyVisits,
    dailyVisitCap,
    workingDays,
    languages,
  } = data;

  const cap = dailyVisitCap !== undefined ? Number(dailyVisitCap) : (maxDailyVisits !== undefined ? Number(maxDailyVisits) : 5);

  const normalizedEmail = email.toLowerCase().trim();

  // Check if a Consultant with this email already exists
  const existingConsultant = await Consultant.findOne({ email: normalizedEmail });
  if (existingConsultant) {
    const error = new Error('A consultant with this email already exists.');
    error.statusCode = 409;
    error.code = 'CONSULTANT_EMAIL_CONFLICT';
    throw error;
  }

  // Find or create the linked User account
  let userDoc = await User.findOne({ email: normalizedEmail });

  if (userDoc) {
    // If a user exists with another role, block creation
    if (userDoc.role !== 'consultant') {
      const error = new Error(
        `A user with this email already exists with role '${userDoc.role}'. Cannot create consultant.`
      );
      error.statusCode = 409;
      error.code = 'USER_ROLE_CONFLICT';
      throw error;
    }
  } else {
    // Create a new User with role: 'consultant'
    const rawPassword = password || `Consultant@${Date.now()}`;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    userDoc = await User.create({
      fullName: name,
      email: normalizedEmail,
      phone: phone || null,
      passwordHash,
      role: 'consultant',
      city: city || null,
    });
  }

  // Create the Consultant profile document
  const consultant = await Consultant.create({
    user: userDoc._id,
    name,
    phone,
    email: normalizedEmail,
    city,
    maxDailyVisits: cap,
    dailyVisitCap: cap,
    workingDays: Array.isArray(workingDays) ? workingDays.map(Number) : [0, 1, 2, 3, 4, 5, 6],
    languages: Array.isArray(languages) ? languages : [],
    isActive: true,
  });

  return consultant.toObject();
};

/**
 * Update consultant profile fields.
 * Does NOT change the linked User's password here — keep auth separate.
 */
export const updateConsultant = async (id, data) => {
  const existing = await Consultant.findById(id);
  if (!existing) {
    const error = new Error('Consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  const allowedUpdates = {};
  if (data.name !== undefined) allowedUpdates.name = data.name;
  if (data.phone !== undefined) allowedUpdates.phone = data.phone;
  if (data.city !== undefined) allowedUpdates.city = data.city;
  if (data.dailyVisitCap !== undefined) {
    allowedUpdates.dailyVisitCap = Number(data.dailyVisitCap);
    allowedUpdates.maxDailyVisits = Number(data.dailyVisitCap);
  } else if (data.maxDailyVisits !== undefined) {
    allowedUpdates.maxDailyVisits = Number(data.maxDailyVisits);
    allowedUpdates.dailyVisitCap = Number(data.maxDailyVisits);
  }
  if (data.workingDays !== undefined) allowedUpdates.workingDays = data.workingDays.map(Number);
  if (data.languages !== undefined) allowedUpdates.languages = Array.isArray(data.languages) ? data.languages : [];

  const updated = await Consultant.findByIdAndUpdate(id, allowedUpdates, { new: true })
    .populate('user', 'email role')
    .lean();

  // Sync name/phone/city to linked User for display purposes
  const userUpdates = {};
  if (data.name !== undefined) userUpdates.fullName = data.name;
  if (data.phone !== undefined) userUpdates.phone = data.phone;
  if (data.city !== undefined) userUpdates.city = data.city;
  if (Object.keys(userUpdates).length > 0) {
    User.findByIdAndUpdate(existing.user, userUpdates).exec().catch(() => {});
  }

  return updated;
};

/**
 * Activate a consultant (set isActive: true)
 */
export const activateConsultant = async (id) => {
  const existing = await Consultant.findById(id);
  if (!existing) {
    const error = new Error('Consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  const updated = await Consultant.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  ).lean();

  return updated;
};

/**
 * Deactivate a consultant (set isActive: false)
 * Does NOT cancel existing future assignments — admin can reassign manually.
 */
export const deactivateConsultant = async (id) => {
  const existing = await Consultant.findById(id);
  if (!existing) {
    const error = new Error('Consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  const updated = await Consultant.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean();

  return updated;
};

/**
 * Delete a consultant record.
 * The linked User account is deactivated (not deleted) so audit trail is preserved.
 */
export const deleteConsultant = async (id) => {
  const existing = await Consultant.findById(id);
  if (!existing) {
    const error = new Error('Consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  // Deactivate the linked User (don't hard-delete — preserve audit trail)
  User.findByIdAndUpdate(existing.user, { role: 'customer' }).exec().catch(() => {});

  await Consultant.findByIdAndDelete(id);
  return { id, message: 'Consultant deleted successfully.' };
};

/**
 * Get allocated site visits / customer bookings for a consultant
 */
export const getConsultantAllocations = async (id) => {
  const Booking = (await import('../models/Booking.js')).default;
  const consultant = await Consultant.findById(id).lean();

  if (!consultant) {
    const error = new Error('Consultant not found.');
    error.statusCode = 404;
    error.code = 'CONSULTANT_NOT_FOUND';
    throw error;
  }

  const bookings = await Booking.find({
    $or: [
      { consultant: consultant._id },
      { consultantName: consultant.name },
    ],
  })
    .populate('property')
    .sort({ createdAt: -1 })
    .lean();

  const allocations = bookings.map(b => ({
    id: b._id,
    _id: b._id,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    customerPhone: b.customerPhone,
    propertyName: b.propertyName || (b.property ? b.property.title : 'Architectural Residence'),
    scheduledDate: b.scheduledDate || b.date || 'N/A',
    scheduledTime: b.scheduledTime || b.time || 'N/A',
    status: b.status || 'Scheduled',
    cityName: b.cityName || (b.property ? b.property.city : consultant.city),
    createdAt: b.createdAt,
  }));

  return {
    consultant: {
      id: consultant._id,
      _id: consultant._id,
      name: consultant.name,
      email: consultant.email,
      phone: consultant.phone,
      city: consultant.city,
    },
    allocations,
    totalAllocated: allocations.length,
  };
};

const consultantsService = {
  getConsultants,
  createConsultant,
  updateConsultant,
  activateConsultant,
  deactivateConsultant,
  deleteConsultant,
  getConsultantAllocations,
};

export default consultantsService;
