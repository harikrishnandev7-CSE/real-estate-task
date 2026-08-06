import * as inquiriesService from '../services/inquiries.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const createInquiry = async (req, res) => {
  const inquiry = await inquiriesService.createInquiry(req.body);
  return successResponse(res, { inquiry }, 201);
};

export const getInquiries = async (req, res) => {
  const inquiries = await inquiriesService.getInquiriesAdmin();
  return successResponse(res, { inquiries });
};
