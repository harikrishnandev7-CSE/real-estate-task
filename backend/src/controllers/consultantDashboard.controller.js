import * as consultantDashboardService from '../services/consultantDashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * All controllers resolve the consultant's profile first using req.user.id.
 * This ensures data is always scoped to the logged-in consultant only.
 */

export const getTodayVisits = async (req, res) => {
  const consultant = await consultantDashboardService.getConsultantProfile(req.user.id);
  const visits = await consultantDashboardService.getTodayVisits(consultant._id);
  return successResponse(res, { visits, total: visits.length });
};

export const getUpcomingVisits = async (req, res) => {
  const consultant = await consultantDashboardService.getConsultantProfile(req.user.id);
  const visits = await consultantDashboardService.getUpcomingVisits(consultant._id);
  return successResponse(res, { visits, total: visits.length });
};

export const getCompletedVisits = async (req, res) => {
  const consultant = await consultantDashboardService.getConsultantProfile(req.user.id);
  const visits = await consultantDashboardService.getCompletedVisits(consultant._id);
  return successResponse(res, { visits, total: visits.length });
};

export const updateVisitStatus = async (req, res) => {
  const consultant = await consultantDashboardService.getConsultantProfile(req.user.id);
  const { status } = req.body;
  const result = await consultantDashboardService.updateVisitStatus(
    req.params.id,
    consultant._id,
    status
  );
  return successResponse(res, result);
};

export const getMyProfile = async (req, res) => {
  const consultant = await consultantDashboardService.getConsultantProfile(req.user.id);
  return successResponse(res, { consultant });
};
