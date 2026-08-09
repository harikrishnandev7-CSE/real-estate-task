import * as adminCalendarService from '../services/adminCalendar.service.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { successResponse } from '../utils/apiResponse.js';

export const getVisitCalendar = async (req, res) => {
  const calendar = await adminCalendarService.getVisitCalendar(req.query);
  const totalAssignments = Object.values(calendar).reduce((sum, arr) => sum + arr.length, 0);
  return successResponse(res, { calendar, totalAssignments });
};

export const reassignVisit = async (req, res) => {
  const { newConsultantId } = req.body;

  if (!newConsultantId) {
    const error = new Error('newConsultantId is required.');
    error.statusCode = 400;
    error.code = 'MISSING_CONSULTANT';
    throw error;
  }

  const { newAssignment, newConsultant } = await adminCalendarService.reassignVisit(
    req.params.id,
    newConsultantId
  );

  // Update booking's consultant ref and assignmentStatus
  await Booking.findByIdAndUpdate(newAssignment.visitRequest, {
    consultant: newConsultant._id,
    consultantName: newConsultant.name,
    assignmentStatus: 'Reassigned',
  });

  // Notify new consultant
  if (newConsultant.user) {
    Notification.create({
      user: newConsultant.user,
      type: 'visit',
      category: 'Assignment',
      title: 'Visit Reassigned to You 📋',
      desc: `A site visit on ${newAssignment.date} has been reassigned to you by Admin.`,
    }).catch(() => {});
  }

  return successResponse(res, { assignment: newAssignment, consultant: newConsultant });
};
