import { Router } from 'express';
import * as adminCalendarController from '../controllers/adminCalendar.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// All routes: admin only
router.use(verifyToken, requireRole('admin'));

// GET /api/v1/admin/visit-calendar?date=&dateFrom=&dateTo=&consultantId=&status=
router.get('/visit-calendar', asyncHandler(adminCalendarController.getVisitCalendar));

// PATCH /api/v1/admin/site-visits/:id/reassign
router.patch('/site-visits/:id/reassign', asyncHandler(adminCalendarController.reassignVisit));

export default router;
