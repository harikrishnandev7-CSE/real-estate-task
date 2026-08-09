import { Router } from 'express';
import { z } from 'zod';
import * as consultantDashboardController from '../controllers/consultantDashboard.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const updateStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

// All routes: must be authenticated + role must be 'consultant'
router.use(verifyToken, requireRole('consultant'));

router.get('/profile', asyncHandler(consultantDashboardController.getMyProfile));
router.get('/visits/today', asyncHandler(consultantDashboardController.getTodayVisits));
router.get('/visits/upcoming', asyncHandler(consultantDashboardController.getUpcomingVisits));
router.get('/visits/completed', asyncHandler(consultantDashboardController.getCompletedVisits));
router.patch('/visits/:id/status', validate(updateStatusSchema), asyncHandler(consultantDashboardController.updateVisitStatus));

export default router;
