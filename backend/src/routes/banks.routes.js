import { Router } from 'express';
import banksService from '../services/banks.service.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Public endpoint — no auth required
router.get('/', asyncHandler(async (req, res) => {
  const banks = await banksService.getBanks();
  return successResponse(res, { banks });
}));

export default router;
