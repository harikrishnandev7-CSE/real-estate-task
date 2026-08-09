import { Router } from 'express';
import { z } from 'zod';
import * as consultantsController from '../controllers/consultants.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Zod validation schema for creating a consultant
const createConsultantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  maxDailyVisits: z.number().int().min(1).max(50).optional(),
  dailyVisitCap: z.number().int().min(1).max(50).optional(),
  workingDays: z.array(z.number().int().min(0).max(6)).optional(),
  languages: z.array(z.string()).optional(),
}).passthrough();

// All consultant management routes are admin-only
router.use(verifyToken, requireRole('admin'));

router.get('/', asyncHandler(consultantsController.getConsultants));
router.get('/:id/allocations', asyncHandler(consultantsController.getConsultantAllocations));
router.post('/', validate(createConsultantSchema), asyncHandler(consultantsController.createConsultant));
router.patch('/:id', asyncHandler(consultantsController.updateConsultant));
router.patch('/:id/activate', asyncHandler(consultantsController.activateConsultant));
router.patch('/:id/deactivate', asyncHandler(consultantsController.deactivateConsultant));
router.delete('/:id', asyncHandler(consultantsController.deleteConsultant));

export default router;
