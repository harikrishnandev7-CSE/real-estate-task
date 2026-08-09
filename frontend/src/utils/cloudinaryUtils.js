/**
 * cloudinaryUtils.js
 * Utility helpers for building optimised Cloudinary image URLs.
 * Keys NEVER exposed here — just URL transformation helpers.
 */

const CLOUD_NAME = 'hkrsplqg'; // public cloud name is safe on the frontend

/**
 * Returns an optimised Cloudinary URL for property cards.
 * - w_800, h_550, crop fill, auto quality, auto format (WebP where supported)
 */
export const cardImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_800,h_550,c_fill,f_auto,q_auto/');
};

/**
 * Returns a high-quality URL for the property hero/gallery.
 * - w_1400, h_900, crop fill, auto quality, auto format
 */
export const heroImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_1400,h_900,c_fill,f_auto,q_auto/');
};

/**
 * Returns a thumbnail URL for gallery strips / lightbox thumbnails.
 * - w_200, h_140, crop fill, auto quality
 */
export const thumbImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_200,h_140,c_fill,f_auto,q_auto/');
};

/**
 * Returns a room-optimised URL.
 * - w_1200, h_800, crop fill, auto quality
 */
export const roomImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_1200,h_800,c_fill,f_auto,q_auto/');
};

/**
 * Generic transform — pass a Cloudinary transformation string.
 * e.g. transformUrl(url, 'w_400,h_300,c_thumb,g_face')
 */
export const transformUrl = (url, transforms) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/${transforms}/`);
};
