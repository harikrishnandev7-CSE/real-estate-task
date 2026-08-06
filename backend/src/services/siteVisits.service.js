import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createSiteVisit = async (data, userId = null) => {
  const {
    propertyId,
    propertyName,
    name,
    customerName,
    email,
    customerEmail,
    phone,
    customerPhone,
    date,
    scheduledDate,
    time,
    scheduledTime,
    consultantName,
  } = data;

  const finalName = customerName || name;
  const finalEmail = customerEmail || email;
  const finalPhone = customerPhone || phone;
  const finalDate = scheduledDate || date;
  const finalTime = scheduledTime || time;

  const siteVisit = await Booking.create({
    user: userId || null,
    property: propertyId || null,
    propertyName: propertyName || null,
    customerName: finalName,
    customerEmail: finalEmail,
    customerPhone: finalPhone,
    scheduledDate: finalDate,
    scheduledTime: finalTime,
    consultantName: consultantName || 'Unassigned',
    status: 'Scheduled',
  });

  // Create or update Customer CRM lead record if email or phone is provided
  const primaryEmail = finalEmail ? finalEmail.toLowerCase().trim() : (finalPhone ? `${finalPhone.replace(/\D/g,'')}@client.com` : null);
  
  if (primaryEmail || finalPhone) {
    const visitNote = propertyName 
      ? `Booked site visit for ${propertyName} on ${finalDate} at ${finalTime}` 
      : `Booked site visit on ${finalDate} at ${finalTime}`;

    const queryFilter = primaryEmail ? { email: primaryEmail } : { phone: finalPhone };

    await Customer.findOneAndUpdate(
      queryFilter,
      {
        $setOnInsert: {
          email: primaryEmail || `${Date.now()}@client.com`,
          city: 'Chennai',
          purpose: 'Buy',
          budget: '₹2Cr–₹5Cr',
          consultantName: consultantName || 'Vikram Malhotra',
          leadStatus: 'Touring',
        },
        $set: {
          name: finalName || 'Valued Client',
          phone: finalPhone || 'Unprovided',
          hasUpcomingVisit: true,
          lastActive: new Date(),
          notes: visitNote,
        },
      },
      { upsert: true, new: true }
    );
  }

  // Increment property enquiries
  if (propertyId) {
    Property.findByIdAndUpdate(propertyId, { $inc: { enquiries: 1 } }).exec().catch(() => {});
  }

  // 1. Send notification to user if logged in
  if (userId) {
    Notification.create({
      user: userId,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Request Submitted 📅',
      desc: `Your visit for ${propertyName || 'property'} on ${finalDate} at ${finalTime} has been submitted and is awaiting Admin confirmation.`,
    }).catch(() => {});
  }

  // 2. Send notification to all Admin users
  User.find({ role: 'admin' }).select('_id').lean().then(admins => {
    if (admins && admins.length > 0) {
      const adminNotifs = admins.map(admin => ({
        user: admin._id,
        type: 'visit',
        category: 'Admin Alert',
        title: 'New Site Visit Booking 🔔',
        desc: `${finalName || 'A customer'} booked a site visit for "${propertyName || 'Property'}" on ${finalDate} at ${finalTime}.`,
      }));
      Notification.insertMany(adminNotifs).catch(() => {});
    }
  }).catch(() => {});

  return siteVisit;
};

export const getMySiteVisits = async (userId) => {
  return Booking.find({ user: userId })
    .populate('property')
    .sort({ createdAt: -1 })
    .lean();
};

export const getAllSiteVisitsAdmin = async (query = {}) => {
  const { status, search } = query;
  const where = {};

  if (status) where.status = { $regex: new RegExp(`^${status}$`, 'i') };
  if (search) {
    const regex = new RegExp(search, 'i');
    where.$or = [
      { customerName: regex },
      { customerEmail: regex },
      { propertyName: regex },
    ];
  }

  return Booking.find(where)
    .populate('property')
    .sort({ createdAt: -1 })
    .lean();
};

export const confirmSiteVisit = async (id) => {
  const visit = await Booking.findById(id);
  if (!visit) {
    const error = new Error('Site visit not found.');
    error.statusCode = 404;
    error.code = 'SITE_VISIT_NOT_FOUND';
    throw error;
  }

  visit.status = 'Confirmed';
  await visit.save();

  // Notify user that Admin confirmed their visit!
  if (visit.user) {
    await Notification.create({
      user: visit.user,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Confirmed! ✅',
      desc: `Your site visit for "${visit.propertyName || 'the property'}" on ${visit.scheduledDate} at ${visit.scheduledTime} has been confirmed by Admin!`,
    }).catch(() => {});
  }

  return visit;
};

export const rescheduleSiteVisit = async (id, { scheduledDate, date, scheduledTime, time }) => {
  const visit = await Booking.findById(id);
  if (!visit) {
    const error = new Error('Site visit not found.');
    error.statusCode = 404;
    error.code = 'SITE_VISIT_NOT_FOUND';
    throw error;
  }

  visit.scheduledDate = scheduledDate || date || visit.scheduledDate;
  visit.scheduledTime = scheduledTime || time || visit.scheduledTime;
  visit.status = 'Scheduled';
  await visit.save();

  if (visit.user) {
    await Notification.create({
      user: visit.user,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Rescheduled 🕒',
      desc: `Your site visit for "${visit.propertyName || 'the property'}" has been rescheduled to ${visit.scheduledDate} at ${visit.scheduledTime}.`,
    }).catch(() => {});
  }

  return visit;
};

export const cancelSiteVisit = async (id, { cancelReason }) => {
  const visit = await Booking.findById(id);
  if (!visit) {
    const error = new Error('Site visit not found.');
    error.statusCode = 404;
    error.code = 'SITE_VISIT_NOT_FOUND';
    throw error;
  }

  visit.status = 'Cancelled';
  visit.cancelReason = cancelReason || 'Cancelled by admin';
  await visit.save();

  if (visit.user) {
    await Notification.create({
      user: visit.user,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Cancelled ❌',
      desc: `Your site visit for "${visit.propertyName || 'the property'}" was cancelled (${visit.cancelReason}).`,
    }).catch(() => {});
  }

  return visit;
};

export const completeSiteVisit = async (id, { completionNote }) => {
  const visit = await Booking.findById(id);
  if (!visit) {
    const error = new Error('Site visit not found.');
    error.statusCode = 404;
    error.code = 'SITE_VISIT_NOT_FOUND';
    throw error;
  }

  visit.status = 'Completed';
  visit.completionNote = completionNote || 'Visit successfully completed';
  await visit.save();

  if (visit.user) {
    await Notification.create({
      user: visit.user,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Completed 🎉',
      desc: `Thank you for touring "${visit.propertyName || 'the property'}". Your visit has been marked completed.`,
    }).catch(() => {});
  }

  return visit;
};

const siteVisitsService = {
  createSiteVisit,
  getMySiteVisits,
  getAllSiteVisitsAdmin,
  confirmSiteVisit,
  rescheduleSiteVisit,
  cancelSiteVisit,
  completeSiteVisit,
};

export default siteVisitsService;
