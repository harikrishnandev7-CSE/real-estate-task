import { Router } from 'express';
import { z } from 'zod';
import * as siteVisitsController from '../controllers/siteVisits.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, next);
  }
  next();
};

const createVisitSchema = z.object({
  // Accept either name or customerName, email or customerEmail, phone or customerPhone
  name: z.string().optional(),
  customerName: z.string().optional(),
  email: z.string().optional(),
  customerEmail: z.string().optional(),
  phone: z.string().optional(),
  customerPhone: z.string().optional(),
  date: z.string().optional(),
  scheduledDate: z.string().optional(),
  time: z.string().optional(),
  scheduledTime: z.string().optional(),
  propertyName: z.string().optional(),
  consultantName: z.string().optional(),
  propertyId: z.string().optional(),
  // New optional fields for assignment engine (backward compatible)
  city: z.string().optional(),
  cityName: z.string().optional(),
}).passthrough();

// Public booking with optional auth context
router.post('/', optionalAuth, validate(createVisitSchema), asyncHandler(siteVisitsController.createSiteVisit));

// Protected user route
router.get('/my', verifyToken, asyncHandler(siteVisitsController.getMySiteVisits));
router.get('/my-visits', verifyToken, asyncHandler(siteVisitsController.getMySiteVisits));

// Admin calendar routes
router.get('/calendar', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getCalendarMonthData));
router.get('/admin/site-visits/calendar', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getCalendarMonthData));

router.get('/by-date', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getSiteVisitsByDate));
router.get('/admin/site-visits/by-date', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getSiteVisitsByDate));

// Admin routes (supports both /api/v1/admin/site-visits and /api/v1/site-visits/admin/site-visits)
router.get('/admin/site-visits', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getAllSiteVisitsAdmin));
router.get('/', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.getAllSiteVisitsAdmin));

router.put('/:id', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.rescheduleSiteVisit));
router.patch('/admin/site-visits/:id/confirm', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.confirmSiteVisit));
router.patch('/:id/confirm', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.confirmSiteVisit));
router.post('/:id/confirm', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.confirmSiteVisit));

router.patch('/admin/site-visits/:id/reschedule', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.rescheduleSiteVisit));
router.patch('/admin/site-visits/:id/cancel', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.cancelSiteVisit));
router.patch('/admin/site-visits/:id/complete', verifyToken, requireRole('admin'), asyncHandler(siteVisitsController.completeSiteVisit));

export default router;
