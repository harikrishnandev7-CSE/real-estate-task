import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    data: null,
    error: { message: 'Too many login attempts. Please try again after 15 minutes.', code: 'RATE_LIMIT_EXCEEDED' },
  },
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(authController.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', verifyToken, asyncHandler(authController.me));

export default router;
