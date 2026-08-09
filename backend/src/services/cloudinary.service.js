/**
 * cloudinary.service.js — Centralized Cloudinary Service
 * Handles Cloudinary configuration, SDK instance, direct file uploads,
 * and Multer storage integration for the MERN backend.
 */
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from '../config/env.js';

// ─── Cloudinary SDK Configuration ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: env.CLOUD_NAME || process.env.CLOUD_NAME,
  api_key:    env.CLOUD_API_KEY || process.env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET || process.env.CLOUD_API_SECRET,
});

/**
 * Upload a local file path or buffer directly to Cloudinary CDN.
 * @param {string} filePath - Path to file or remote URL
 * @param {string} folder - Target Cloudinary folder (default: 'realestate')
 * @returns {Promise<object>} Cloudinary upload response object containing secure_url
 */
export const uploadToCloudinary = async (filePath, folder = 'realestate') => {
  console.log('Uploading to Cloudinary...', filePath);
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    console.log('Cloudinary Upload Response:', response.secure_url);
    return response;
  } catch (err) {
    console.error('Cloudinary Upload Failed:', err.message || err);
    throw err;
  }
};

// ─── Cloudinary Multer Storage Instance ────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          'realestate',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation:  [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    public_id:       `property-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
  }),
});

// ─── MIME type guard ──────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF images are allowed.'));
  }
};

/**
 * Unified Multer Upload Middleware backed by Cloudinary storage.
 */
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});

export { cloudinary };

export default {
  cloudinary,
  uploadToCloudinary,
  upload,
};
