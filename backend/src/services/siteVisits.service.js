import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Consultant from '../models/Consultant.js';
import * as assignmentService from './assignment.service.js';

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
    city,       // new optional field from booking form or property
    cityName,   // alternative field name for city
  } = data;

  const finalName = customerName || name;
  const finalEmail = customerEmail || email;
  const finalPhone = customerPhone || phone;
  const finalDate = scheduledDate || date;
  const finalTime = scheduledTime || time;

  // Resolve city: use city/cityName from request, or fall back to property's city string
  let resolvedCity = city || cityName || null;
  if (!resolvedCity && propertyId) {
    const prop = await Property.findById(propertyId).select('city').lean();
    if (prop && prop.city) resolvedCity = prop.city;
  }

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
    // New fields (additive)
    cityName: resolvedCity || null,
    assignmentStatus: 'PendingAssignment',
  });

  // ─── Auto-assignment ────────────────────────────────────────────────────────
  let assignedConsultant = null;

  if (resolvedCity && finalDate) {
    try {
      const { assignment, consultant } = await assignmentService.assignVisit(
        siteVisit._id,
        resolvedCity,
        finalDate
      );

      if (assignment && consultant) {
        // Booking assigned — update booking with consultant ref + status
        await Booking.findByIdAndUpdate(siteVisit._id, {
          consultant: consultant._id,
          consultantName: consultant.name, // Keep existing consultantName string in sync
          assignmentStatus: 'Assigned',
        });

        assignedConsultant = {
          name: consultant.name,
          phone: consultant.phone,
          email: consultant.email,
          languages: consultant.languages || [],
        };

        // Notify the assigned consultant (via their linked User account)
        if (consultant.user) {
          Notification.create({
            user: consultant.user,
            type: 'visit',
            category: 'Assignment',
            title: 'New Site Visit Assigned 📋',
            desc: `You have been assigned a site visit for "${propertyName || 'a property'}" on ${finalDate} at ${finalTime}. Customer: ${finalName || 'N/A'}.`,
          }).catch(() => {});
        }

        // Notify the customer if logged in
        if (userId) {
          Notification.create({
            user: userId,
            type: 'visit',
            category: 'Site Visit',
            title: 'Site Visit Request Submitted 📅',
            desc: `Your visit for ${propertyName || 'property'} on ${finalDate} at ${finalTime} has been submitted. Your consultant is ${consultant.name} (${consultant.phone}).`,
          }).catch(() => {});
        }
      } else {
        // No consultant available — flag for admin review
        await Booking.findByIdAndUpdate(siteVisit._id, {
          assignmentStatus: 'PendingAdminReview',
        });

        // Notify user if logged in
        if (userId) {
          Notification.create({
            user: userId,
            type: 'visit',
            category: 'Site Visit',
            title: 'Site Visit Request Submitted 📅',
            desc: `Your visit for ${propertyName || 'property'} on ${finalDate} at ${finalTime} has been submitted and is awaiting Admin confirmation.`,
          }).catch(() => {});
        }

        // Notify all admins that assignment is pending
        User.find({ role: 'admin' }).select('_id').lean().then(admins => {
          if (admins && admins.length > 0) {
            const adminNotifs = admins.map(admin => ({
              user: admin._id,
              type: 'visit',
              category: 'Admin Alert',
              title: 'Site Visit Needs Manual Assignment 🔔',
              desc: `${finalName || 'A customer'} booked a site visit for "${propertyName || 'Property'}" on ${finalDate} at ${finalTime}. No consultant was available in ${resolvedCity} — please assign manually.`,
            }));
            Notification.insertMany(adminNotifs).catch(() => {});
          }
        }).catch(() => {});
      }
    } catch (assignErr) {
      // Assignment failure must never block the booking — log and continue
      console.error('Assignment engine error (non-blocking):', assignErr.message);
      await Booking.findByIdAndUpdate(siteVisit._id, {
        assignmentStatus: 'PendingAdminReview',
      }).catch(() => {});
    }
  } else {
    // No city info — cannot auto-assign; send original notifications
    if (userId) {
      Notification.create({
        user: userId,
        type: 'visit',
        category: 'Site Visit',
        title: 'Site Visit Request Submitted 📅',
        desc: `Your visit for ${propertyName || 'property'} on ${finalDate} at ${finalTime} has been submitted and is awaiting Admin confirmation.`,
      }).catch(() => {});
    }

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
  }

  // ─── Create or update Customer CRM lead record ──────────────────────────────
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
          city: resolvedCity || 'Chennai',
          purpose: 'Buy',
          budget: '₹2Cr–₹5Cr',
          consultantName: assignedConsultant ? assignedConsultant.name : (consultantName || 'Unassigned'),
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

  // ─── Increment property enquiries ───────────────────────────────────────────
  if (propertyId) {
    Property.findByIdAndUpdate(propertyId, { $inc: { enquiries: 1 } }).exec().catch(() => {});
  }

  // Return enriched response (assignedConsultant is null if not assigned)
  return { siteVisit, assignedConsultant };
};

export const getMySiteVisits = async (userId) => {
  console.log(`Fetching site visits for user: ${userId}`);
  const userObj = await User.findById(userId).select('email phone').lean();
  const userEmail = userObj?.email ? userObj.email.toLowerCase().trim() : null;
  const userPhone = userObj?.phone ? userObj.phone.trim() : null;

  const queryConditions = [{ user: userId }];
  if (userEmail) queryConditions.push({ customerEmail: { $regex: new RegExp(`^${userEmail}$`, 'i') } });
  if (userPhone) queryConditions.push({ customerPhone: userPhone });

  const siteVisits = await Booking.find({ $or: queryConditions })
    .populate('property')
    .populate('consultant', 'name phone email languages city rating experience')
    .sort({ createdAt: -1 })
    .lean();

  console.log(`Fetched ${siteVisits.length} site visits for user ${userId}`);

  // Link missing user field for unlinked matching bookings asynchronously
  siteVisits.forEach(b => {
    if (!b.user && userId) {
      Booking.findByIdAndUpdate(b._id, { user: userId }).exec().catch(() => {});
    }
  });

  const bookings = siteVisits.map(b => {
    const propObj = (b.property && typeof b.property === 'object') ? b.property : null;
    return {
      id: b._id,
      _id: b._id,
      propertyName: b.propertyName || (propObj ? propObj.title : 'Architectural Estate'),
      property: propObj ? {
        id: propObj._id,
        _id: propObj._id,
        title: propObj.title,
        city: propObj.city,
        price: propObj.priceDisplay || propObj.price || 'Price on Request',
        image: propObj.imageUrl || propObj.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        location: propObj.location,
        type: propObj.type,
      } : {
        title: b.propertyName || 'Architectural Estate',
        city: b.cityName || 'Chennai',
        price: 'Price on Request',
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        location: b.cityName || 'Chennai',
        type: 'Residence',
      },
      consultant: b.consultant ? {
        id: b.consultant._id,
        _id: b.consultant._id,
        name: b.consultant.name,
        phone: b.consultant.phone,
        email: b.consultant.email,
        languages: b.consultant.languages || [],
        city: b.consultant.city,
        rating: b.consultant.rating || 4.9,
        experience: b.consultant.experience || 8,
      } : null,
      consultantName: b.consultant ? b.consultant.name : (b.consultantName || 'Pending Assignment'),
      scheduledDate: b.scheduledDate || b.date,
      scheduledTime: b.scheduledTime || b.time,
      visitDate: b.scheduledDate || b.date,
      visitTime: b.scheduledTime || b.time,
      status: b.status || 'Scheduled',
      createdAt: b.createdAt,
    };
  });

  return { bookings, siteVisits: bookings };
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

  console.log('Admin fetching all site visits...');
  const siteVisits = await Booking.find(where)
    .populate('property')
    .populate('consultant', 'name phone email languages city rating experience')
    .sort({ createdAt: -1 })
    .lean();

  console.log(`Admin fetched ${siteVisits.length} site visits`);
  return siteVisits;
};

export const confirmSiteVisit = async (id) => {
  console.log(`Admin confirming site visit: ${id}`);
  const visit = await Booking.findById(id);
  if (!visit) {
    const error = new Error('Site visit not found.');
    error.statusCode = 404;
    error.code = 'SITE_VISIT_NOT_FOUND';
    throw error;
  }

  visit.status = 'Confirmed';

  // ── Auto-assign Consultant if not already assigned ─────────────────────────
  let assignedConsultant = null;
  if (!visit.consultant) {
    const targetCity = visit.cityName || 'Chennai';
    const targetDate = visit.scheduledDate || new Date().toISOString().split('T')[0];

    try {
      const { consultant } = await assignmentService.assignVisit(
        visit._id,
        targetCity,
        targetDate
      );

      if (consultant) {
        visit.consultant = consultant._id;
        visit.consultantName = consultant.name;
        visit.assignmentStatus = 'Assigned';
        assignedConsultant = consultant;
        console.log(`Assigned consultant ${consultant.name} (${consultant.phone}) to visit ${id}`);
      } else {
        const fallbackConsultant = await Consultant.findOne({
          city: { $regex: new RegExp(`^${targetCity}$`, 'i') },
          isActive: true
        }) || await Consultant.findOne({ isActive: true });

        if (fallbackConsultant) {
          visit.consultant = fallbackConsultant._id;
          visit.consultantName = fallbackConsultant.name;
          visit.assignmentStatus = 'Assigned';
          assignedConsultant = fallbackConsultant;
          console.log(`Assigned fallback consultant ${fallbackConsultant.name} to visit ${id}`);
        }
      }
    } catch (assignErr) {
      console.error('Error during consultant assignment on confirm:', assignErr.message);
    }
  } else {
    assignedConsultant = await Consultant.findById(visit.consultant).lean();
  }

  await visit.save();

  // ── Create Notification for Customer ─────────────────────────────────────
  if (visit.user) {
    const consultantInfo = assignedConsultant 
      ? ` Advisor assigned: ${assignedConsultant.name} (${assignedConsultant.phone}).`
      : '';

    await Notification.create({
      user: visit.user,
      type: 'visit',
      category: 'Site Visit',
      title: 'Site Visit Confirmed! ✅',
      desc: `Your property visit for "${visit.propertyName || 'the property'}" on ${visit.scheduledDate} at ${visit.scheduledTime} has been confirmed.${consultantInfo}`,
      link: '/my-bookings',
      read: false,
    }).catch((err) => console.error('Error creating user notification:', err.message));
  }

  // Return populated visit record
  const populatedVisit = await Booking.findById(id)
    .populate('property')
    .populate('consultant', 'name phone email languages city rating experience')
    .lean();

  return populatedVisit || visit;
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

export const getCalendarMonthData = async (query = {}) => {
  const { month, year, consultantId, status } = query;
  
  const where = {};
  if (consultantId && consultantId !== 'All') {
    where.consultant = consultantId;
  }
  if (status && status !== 'All') {
    where.status = { $regex: new RegExp(`^${status}$`, 'i') };
  }

  const allBookings = await Booking.find(where).lean();

  const countMap = {};
  const currentMonthNum = month ? parseInt(month, 10) : null;
  const currentYearNum = year ? parseInt(year, 10) : null;

  allBookings.forEach(b => {
    const rawDate = b.scheduledDate || b.date;
    if (!rawDate) return;

    let dObj = null;
    if (typeof rawDate === 'string' && rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts[0].length === 4) {
        dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    } else if (typeof rawDate === 'string' && rawDate.includes('/')) {
      const parts = rawDate.split('/');
      dObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      dObj = new Date(rawDate);
    }

    if (dObj && !isNaN(dObj.getTime())) {
      const bMonth = dObj.getMonth() + 1;
      const bYear = dObj.getFullYear();

      if ((!currentMonthNum || bMonth === currentMonthNum) && (!currentYearNum || bYear === currentYearNum)) {
        const y = dObj.getFullYear();
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const d = String(dObj.getDate()).padStart(2, '0');
        const formattedDate = `${y}-${m}-${d}`;
        countMap[formattedDate] = (countMap[formattedDate] || 0) + 1;
      }
    }
  });

  const calendar = Object.keys(countMap).map(dateStr => ({
    date: dateStr,
    count: countMap[dateStr]
  }));

  return { calendar, countMap };
};

export const getSiteVisitsByDate = async (query = {}) => {
  const { date, consultantId, status } = query;

  const where = {};
  if (consultantId && consultantId !== 'All') {
    where.consultant = consultantId;
  }
  if (status && status !== 'All') {
    where.status = { $regex: new RegExp(`^${status}$`, 'i') };
  }

  const allBookings = await Booking.find(where)
    .populate('property')
    .populate('user', 'name email phone')
    .populate('consultant', 'name phone email languages city')
    .sort({ createdAt: -1 })
    .lean();

  const targetDateStr = date;

  const filtered = allBookings.filter(b => {
    const rawDate = b.scheduledDate || b.date;
    if (!rawDate) return false;

    if (targetDateStr && rawDate === targetDateStr) return true;

    let dObj = null;
    if (typeof rawDate === 'string' && rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts[0].length === 4) {
        dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    } else if (typeof rawDate === 'string' && rawDate.includes('/')) {
      const parts = rawDate.split('/');
      dObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      dObj = new Date(rawDate);
    }

    if (dObj && !isNaN(dObj.getTime())) {
      const y = dObj.getFullYear();
      const m = String(dObj.getMonth() + 1).padStart(2, '0');
      const d = String(dObj.getDate()).padStart(2, '0');
      const formatted = `${y}-${m}-${d}`;
      return formatted === targetDateStr;
    }

    return false;
  });

  const bookings = filtered.map(b => {
    const propObj = (b.property && typeof b.property === 'object') ? b.property : null;
    const userObj = (b.user && typeof b.user === 'object') ? b.user : null;
    const consObj = (b.consultant && typeof b.consultant === 'object') ? b.consultant : null;

    return {
      id: b._id,
      _id: b._id,
      propertyName: b.propertyName || (propObj ? propObj.title : 'Architectural Estate'),
      property: propObj ? {
        id: propObj._id,
        _id: propObj._id,
        title: propObj.title,
        city: propObj.city,
        price: propObj.priceDisplay || propObj.price || 'Price on Request',
        image: propObj.imageUrl || propObj.image,
        location: propObj.location,
        type: propObj.type,
      } : {
        title: b.propertyName || 'Architectural Estate',
        city: b.cityName || 'Chennai',
        price: 'Price on Request',
        image: null
      },
      user: userObj ? {
        id: userObj._id,
        _id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        phone: userObj.phone
      } : null,
      customerName: b.customerName || userObj?.name || 'Customer',
      customerEmail: b.customerEmail || userObj?.email || '',
      customerPhone: b.customerPhone || userObj?.phone || '',
      consultant: consObj ? {
        id: consObj._id,
        _id: consObj._id,
        name: consObj.name,
        phone: consObj.phone,
        email: consObj.email,
        languages: consObj.languages || [],
        city: consObj.city
      } : null,
      consultantName: consObj?.name || b.consultantName || 'Pending Assignment',
      scheduledDate: b.scheduledDate || b.date,
      scheduledTime: b.scheduledTime || b.time || '10:00 AM',
      visitDate: b.scheduledDate || b.date,
      visitTime: b.scheduledTime || b.time || '10:00 AM',
      status: b.status || 'Scheduled',
      createdAt: b.createdAt
    };
  });

  return { bookings, siteVisits: bookings };
};

const siteVisitsService = {
  createSiteVisit,
  getMySiteVisits,
  getAllSiteVisitsAdmin,
  confirmSiteVisit,
  rescheduleSiteVisit,
  cancelSiteVisit,
  completeSiteVisit,
  getCalendarMonthData,
  getSiteVisitsByDate,
};

export default siteVisitsService;
