import { Router } from 'express';
import { z } from 'zod';
import * as propertiesController from '../controllers/properties.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const propertySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  location: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  type: z.string().optional().or(z.literal('')),
  numericPrice: z.number().or(z.string()).optional().default(0),
  numericArea: z.number().or(z.string()).optional().default(0),
}).passthrough();

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1, 'IDs array cannot be empty'),
  action: z.enum(['Publish', 'Archive', 'Delete']),
});

// Public endpoints
router.get('/', asyncHandler(propertiesController.getProperties));
router.get('/:id', asyncHandler(propertiesController.getPropertyById));

// Admin-only write endpoints
router.post('/', verifyToken, requireRole('admin'), validate(propertySchema), asyncHandler(propertiesController.createProperty));
router.put('/:id', verifyToken, requireRole('admin'), asyncHandler(propertiesController.updateProperty));
router.delete('/:id', verifyToken, requireRole('admin'), asyncHandler(propertiesController.deleteProperty));
router.post('/bulk', verifyToken, requireRole('admin'), validate(bulkSchema), asyncHandler(propertiesController.bulkPropertiesAction));
router.post('/media', verifyToken, requireRole('admin'), upload.array('media', 5), asyncHandler(propertiesController.uploadMedia));

export default router;
