import { Router } from 'express';
import { z } from 'zod';
import * as inquiriesController from '../controllers/inquiries.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const inquirySchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone is required'),
  serviceRequested: z.string().optional(),
  message: z.string().min(2, 'Message is required'),
}).passthrough();

// Public submission
router.post('/', validate(inquirySchema), asyncHandler(inquiriesController.createInquiry));

// Admin retrieve
router.get('/admin/inquiries', verifyToken, requireRole('admin'), asyncHandler(inquiriesController.getInquiries));
router.get('/', verifyToken, requireRole('admin'), asyncHandler(inquiriesController.getInquiries));

export default router;
