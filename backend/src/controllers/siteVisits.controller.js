import * as siteVisitsService from '../services/siteVisits.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const createSiteVisit = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const result = await siteVisitsService.createSiteVisit(req.body, userId);

  // result is { siteVisit, assignedConsultant }
  // assignedConsultant is { name, phone, email } when assigned, null otherwise
  const { siteVisit, assignedConsultant } = result;

  return successResponse(res, { siteVisit, assignedConsultant }, 201);
};

export const getMySiteVisits = async (req, res) => {
  const result = await siteVisitsService.getMySiteVisits(req.user.id);
  const bookingsList = Array.isArray(result) ? result : (result?.bookings || result?.siteVisits || []);
  return successResponse(res, {
    bookings: bookingsList,
    siteVisits: bookingsList,
  });
};

export const getAllSiteVisitsAdmin = async (req, res) => {
  const siteVisits = await siteVisitsService.getAllSiteVisitsAdmin(req.query);
  return successResponse(res, { siteVisits });
};

export const confirmSiteVisit = async (req, res) => {
  const siteVisit = await siteVisitsService.confirmSiteVisit(req.params.id);
  return successResponse(res, { siteVisit });
};

export const rescheduleSiteVisit = async (req, res) => {
  const siteVisit = await siteVisitsService.rescheduleSiteVisit(req.params.id, req.body);
  return successResponse(res, { siteVisit });
};

export const cancelSiteVisit = async (req, res) => {
  const siteVisit = await siteVisitsService.cancelSiteVisit(req.params.id, req.body);
  return successResponse(res, { siteVisit });
};

export const completeSiteVisit = async (req, res) => {
  const siteVisit = await siteVisitsService.completeSiteVisit(req.params.id, req.body);
  return successResponse(res, { siteVisit });
};

export const getCalendarMonthData = async (req, res) => {
  const result = await siteVisitsService.getCalendarMonthData(req.query);
  return successResponse(res, result);
};

export const getSiteVisitsByDate = async (req, res) => {
  const result = await siteVisitsService.getSiteVisitsByDate(req.query);
  return successResponse(res, result);
};
