import { Router } from 'express';
import { z } from 'zod';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const propertyIdSchema = z.object({
  propertyId: z.string().min(1, 'propertyId is required'),
});

router.use(verifyToken);

// Wishlist
router.get('/wishlist', asyncHandler(userController.getWishlist));
router.post('/wishlist/toggle', validate(propertyIdSchema), asyncHandler(userController.toggleWishlist));
router.post('/wishlist', validate(propertyIdSchema), asyncHandler(userController.toggleWishlist));
router.delete('/wishlist/:propertyId', asyncHandler(userController.toggleWishlist));

// Compare List
router.get('/compare', asyncHandler(userController.getCompareList));
router.post('/compare', validate(propertyIdSchema), asyncHandler(userController.toggleCompare));
router.delete('/compare/:propertyId', asyncHandler(userController.toggleCompare));


// Recently Viewed
router.get('/recently-viewed', asyncHandler(userController.getRecentlyViewed));
router.post('/recently-viewed', validate(propertyIdSchema), asyncHandler(userController.addRecentlyViewed));

// Profile
router.put('/profile', asyncHandler(userController.updateProfile));

// Notifications
router.get('/notifications', asyncHandler(userController.getNotifications));
router.patch('/notifications/read-all', asyncHandler(userController.markAllNotificationsRead));
router.patch('/notifications/:id/read', asyncHandler(userController.markNotificationRead));
router.delete('/notifications/:id', asyncHandler(userController.deleteNotification));

export default router;
