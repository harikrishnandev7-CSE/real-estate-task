import { Router } from 'express';
import { z } from 'zod';
import * as propertiesController from '../controllers/properties.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1, 'IDs array cannot be empty'),
  action: z.enum(['Publish', 'Archive', 'Delete']),
});

// ── Public endpoints ──────────────────────────────────────────────────────────
router.get('/', asyncHandler(propertiesController.getProperties));
router.get('/:id', asyncHandler(propertiesController.getPropertyById));

// ── Admin-only write endpoints ────────────────────────────────────────────────
// Middleware handles optional multipart file uploads (image, gallery, media) directly to Cloudinary
const propertyUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'media', maxCount: 20 },
  { name: 'gallery', maxCount: 20 },
  { name: 'entrance', maxCount: 1 },
  { name: 'hall', maxCount: 20 },
  { name: 'kitchen', maxCount: 20 },
  { name: 'bedrooms', maxCount: 20 },
  { name: 'bathrooms', maxCount: 20 },
  { name: 'terrace', maxCount: 20 },
]);

router.post('/',       verifyToken, requireRole('admin'), propertyUpload, asyncHandler(propertiesController.createProperty));
router.put('/:id',    verifyToken, requireRole('admin'), propertyUpload, asyncHandler(propertiesController.updateProperty));
router.delete('/:id', verifyToken, requireRole('admin'), asyncHandler(propertiesController.deleteProperty));
router.post('/bulk',  verifyToken, requireRole('admin'), validate(bulkSchema), asyncHandler(propertiesController.bulkPropertiesAction));

/**
 * POST /media & POST /upload
 * Direct media upload endpoint — files stream directly to Cloudinary CDN
 */
router.post(
  '/media',
  verifyToken,
  requireRole('admin'),
  upload.array('media', 20),
  asyncHandler(propertiesController.uploadMedia)
);

router.post(
  '/upload',
  verifyToken,
  requireRole('admin'),
  upload.array('media', 20),
  asyncHandler(propertiesController.uploadMedia)
);

export default router;
