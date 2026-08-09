import * as consultantsService from '../services/consultants.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getConsultants = async (req, res) => {
  const consultants = await consultantsService.getConsultants(req.query);
  return successResponse(res, { consultants, total: consultants.length });
};

export const getPublicConsultants = async (req, res) => {
  const consultants = await consultantsService.getConsultants({ ...req.query, status: 'active' });
  const sanitized = consultants.map(c => ({
    id: c._id,
    _id: c._id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    city: c.city,
    languages: c.languages || [],
    createdAt: c.createdAt,
  }));
  return successResponse(res, { consultants: sanitized, total: sanitized.length });
};

export const createConsultant = async (req, res) => {
  const consultant = await consultantsService.createConsultant(req.body);
  return successResponse(res, { consultant }, 201);
};

export const updateConsultant = async (req, res) => {
  const consultant = await consultantsService.updateConsultant(req.params.id, req.body);
  return successResponse(res, { consultant });
};

export const activateConsultant = async (req, res) => {
  const consultant = await consultantsService.activateConsultant(req.params.id);
  return successResponse(res, { consultant });
};

export const deactivateConsultant = async (req, res) => {
  const consultant = await consultantsService.deactivateConsultant(req.params.id);
  return successResponse(res, { consultant });
};

export const deleteConsultant = async (req, res) => {
  const result = await consultantsService.deleteConsultant(req.params.id);
  return successResponse(res, result);
};

export const getConsultantAllocations = async (req, res) => {
  const result = await consultantsService.getConsultantAllocations(req.params.id);
  return successResponse(res, result);
};
