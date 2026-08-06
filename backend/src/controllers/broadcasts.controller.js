import * as broadcastsService from '../services/broadcasts.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getBroadcasts = async (req, res) => {
  const broadcasts = await broadcastsService.getBroadcastsAdmin();
  return successResponse(res, { broadcasts });
};

export const createBroadcast = async (req, res) => {
  const broadcast = await broadcastsService.createBroadcastAdmin(req.body);
  return successResponse(res, { broadcast }, 201);
};
