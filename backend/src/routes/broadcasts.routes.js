import { Router } from 'express';
import { z } from 'zod';
import * as broadcastsController from '../controllers/broadcasts.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const broadcastSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().optional(),
  content: z.string().optional(),
}).passthrough();

router.use(verifyToken, requireRole('admin'));

router.get('/', asyncHandler(broadcastsController.getBroadcasts));
router.post('/', validate(broadcastSchema), asyncHandler(broadcastsController.createBroadcast));

export default router;
