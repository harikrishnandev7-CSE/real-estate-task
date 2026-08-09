import VisitAssignment from '../models/VisitAssignment.js';
import { reassignVisit } from './assignment.service.js';

/**
 * Admin Visit Calendar Service
 *
 * getVisitCalendar — single aggregation pipeline, no N+1.
 * Supports: ?date=YYYY-MM-DD (single day) or ?dateFrom=&dateTo= (range)
 *           ?consultantId= ?status=
 *
 * Returns assignments grouped by date:
 * { "2026-08-07": [ { assignment, consultant, booking, property } ] }
 */
export const getVisitCalendar = async (query = {}) => {
  const { date, dateFrom, dateTo, consultantId, status } = query;

  // Build date match
  const dateMatch = {};
  if (date) {
    dateMatch.date = date;
  } else {
    if (dateFrom) dateMatch.date = { ...dateMatch.date, $gte: dateFrom };
    if (dateTo) dateMatch.date = { ...dateMatch.date, $lte: dateTo };
  }

  const matchStage = { ...dateMatch };
  if (consultantId) matchStage.consultant = new (await import('mongoose')).default.Types.ObjectId(consultantId);
  if (status) matchStage.status = status;

  const pipeline = [
    { $match: matchStage },

    // Join Consultant
    {
      $lookup: {
        from: 'consultants',
        localField: 'consultant',
        foreignField: '_id',
        as: 'consultantData',
      },
    },
    { $unwind: { path: '$consultantData', preserveNullAndEmpty: true } },

    // Join Booking (visitRequest)
    {
      $lookup: {
        from: 'bookings',
        localField: 'visitRequest',
        foreignField: '_id',
        as: 'bookingData',
      },
    },
    { $unwind: { path: '$bookingData', preserveNullAndEmpty: true } },

    // Join Property via booking.property (string _id)
    {
      $lookup: {
        from: 'properties',
        localField: 'bookingData.property',
        foreignField: '_id',
        as: 'propertyData',
      },
    },
    { $unwind: { path: '$propertyData', preserveNullAndEmpty: true } },

    // Shape the output
    {
      $project: {
        _id: 1,
        date: 1,
        status: 1,
        assignedAt: 1,
        assignedBy: 1,
        consultant: {
          id: '$consultantData._id',
          name: '$consultantData.name',
          phone: '$consultantData.phone',
          email: '$consultantData.email',
          city: '$consultantData.city',
        },
        booking: {
          id: '$bookingData._id',
          customerName: '$bookingData.customerName',
          customerPhone: '$bookingData.customerPhone',
          customerEmail: '$bookingData.customerEmail',
          scheduledDate: '$bookingData.scheduledDate',
          scheduledTime: '$bookingData.scheduledTime',
          status: '$bookingData.status',
          propertyName: '$bookingData.propertyName',
          assignmentStatus: '$bookingData.assignmentStatus',
        },
        property: {
          id: '$propertyData._id',
          title: '$propertyData.title',
          location: '$propertyData.location',
          city: '$propertyData.city',
          imageUrl: '$propertyData.imageUrl',
        },
      },
    },

    // Sort by date then time
    { $sort: { date: 1, 'booking.scheduledTime': 1 } },

    // Group by date
    {
      $group: {
        _id: '$date',
        assignments: { $push: '$$ROOT' },
      },
    },

    { $sort: { _id: 1 } },
  ];

  const rawGroups = await VisitAssignment.aggregate(pipeline);

  // Convert to { "YYYY-MM-DD": [...assignments] } map
  const grouped = {};
  for (const group of rawGroups) {
    grouped[group._id] = group.assignments;
  }

  return grouped;
};

/**
 * Reassign a visit to a different consultant — delegates to assignment.service.
 */
export { reassignVisit };

const adminCalendarService = {
  getVisitCalendar,
  reassignVisit,
};

export default adminCalendarService;
