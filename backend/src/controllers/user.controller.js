import * as userService from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

// Wishlist
export const getWishlist = async (req, res) => {
  const wishlist = await userService.getUserWishlist(req.user.id);
  return successResponse(res, { wishlist, properties: wishlist });
};

export const toggleWishlist = async (req, res) => {
  const propertyId = req.body.propertyId || req.params.propertyId;
  const result = await userService.toggleWishlist(req.user.id, propertyId);
  return successResponse(res, result);
};


// Recently Viewed
export const getRecentlyViewed = async (req, res) => {
  const recentlyViewed = await userService.getRecentlyViewed(req.user.id);
  return successResponse(res, { recentlyViewed, properties: recentlyViewed });
};

export const addRecentlyViewed = async (req, res) => {
  const result = await userService.addRecentlyViewed(req.user.id, req.body.propertyId);
  return successResponse(res, result);
};

// Profile
export const updateProfile = async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
  return successResponse(res, { user });
};

// Notifications
export const getNotifications = async (req, res) => {
  const notifications = await userService.getUserNotifications(req.user.id);
  return successResponse(res, { notifications });
};

export const markNotificationRead = async (req, res) => {
  const result = await userService.markNotificationRead(req.user.id, req.params.id);
  return successResponse(res, result);
};

export const markAllNotificationsRead = async (req, res) => {
  const result = await userService.markAllNotificationsRead(req.user.id);
  return successResponse(res, result);
};

export const deleteNotification = async (req, res) => {
  const result = await userService.deleteNotification(req.user.id, req.params.id);
  return successResponse(res, result);
};
