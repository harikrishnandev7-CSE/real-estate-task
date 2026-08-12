import Wishlist from '../models/Wishlist.js';
import CompareList from '../models/CompareList.js';
import RecentlyViewed from '../models/RecentlyViewed.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Property from '../models/Property.js';
import { formatProperty, sanitizeUser } from '../utils/transform.js';

// --- Wishlist ---
export const getUserWishlist = async (userId) => {
  const items = await Wishlist.find({ user: userId })
    .populate('property')
    .sort({ createdAt: -1 })
    .lean();
  return items.map(item => formatProperty(item.property));
};

export const toggleWishlist = async (userId, propertyId) => {
  const existing = await Wishlist.findOne({ user: userId, property: propertyId });

  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    // Decrement saves count
    Property.findByIdAndUpdate(propertyId, { $inc: { saves: -1 } }).exec().catch(() => {});

    return { inWishlist: false, propertyId, message: 'Removed from wishlist.' };
  } else {
    await Wishlist.create({ user: userId, property: propertyId });
    // Increment saves count
    Property.findByIdAndUpdate(propertyId, { $inc: { saves: 1 } }).exec().catch(() => {});

    return { inWishlist: true, propertyId, message: 'Added to wishlist.' };
  }
};

// --- Compare List ---
export const getUserCompareList = async (userId) => {
  const items = await CompareList.find({ user: userId })
    .populate('property')
    .sort({ createdAt: -1 })
    .lean();
  return items.map(item => formatProperty(item.property));
};

export const toggleCompareList = async (userId, propertyId) => {
  const existing = await CompareList.findOne({ user: userId, property: propertyId });

  if (existing) {
    await CompareList.findByIdAndDelete(existing._id);
    return { inCompare: false, propertyId, message: 'Removed from compare list.' };
  } else {
    await CompareList.create({ user: userId, property: propertyId });
    return { inCompare: true, propertyId, message: 'Added to compare list.' };
  }
};

// --- Recently Viewed ---
export const getRecentlyViewed = async (userId) => {
  const items = await RecentlyViewed.find({ user: userId })
    .populate('property')
    .sort({ viewedAt: -1 })
    .limit(8)
    .lean();
  return items.map(item => formatProperty(item.property));
};

export const addRecentlyViewed = async (userId, propertyId) => {
  // Upsert or update viewedAt
  await RecentlyViewed.findOneAndUpdate(
    { user: userId, property: propertyId },
    { viewedAt: new Date() },
    { upsert: true, new: true }
  );

  // Trim to keep only the latest 8 entries
  const allViews = await RecentlyViewed.find({ user: userId })
    .sort({ viewedAt: -1 })
    .lean();

  if (allViews.length > 8) {
    const excess = allViews.slice(8);
    const excessIds = excess.map(e => e._id);
    await RecentlyViewed.deleteMany({ _id: { $in: excessIds } });
  }

  return { propertyId, message: 'Added to recently viewed.' };
};

// --- Profile ---
export const updateUserProfile = async (userId, data) => {
  const { name, fullName, phone, city, state, purpose, propertyTypes, budget, budgetRange, locations, targetLocations } = data;

  const updateData = {};
  if (name || fullName) updateData.fullName = name || fullName;
  if (phone !== undefined) updateData.phone = phone;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (purpose !== undefined) updateData.purpose = purpose;
  if (propertyTypes !== undefined) updateData.propertyTypes = propertyTypes;
  if (budget !== undefined || budgetRange !== undefined) updateData.budgetRange = budget || budgetRange;
  if (locations !== undefined || targetLocations !== undefined) updateData.targetLocations = locations || targetLocations;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();

  return sanitizeUser(updatedUser);
};

// --- Notifications ---
export const getUserNotifications = async (userId) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
};

export const markNotificationRead = async (userId, notificationId) => {
  const result = await Notification.updateMany(
    { _id: notificationId, user: userId },
    { read: true }
  );
  return { updatedCount: result.modifiedCount };
};

export const markAllNotificationsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, read: false },
    { read: true }
  );
  return { updatedCount: result.modifiedCount };
};

export const deleteNotification = async (userId, notificationId) => {
  const result = await Notification.deleteMany({ _id: notificationId, user: userId });
  return { deletedCount: result.deletedCount };
};
