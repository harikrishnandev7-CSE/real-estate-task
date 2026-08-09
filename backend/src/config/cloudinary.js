/**
 * config/cloudinary.js — Re-exports Cloudinary service instance
 * Preserves backward compatibility while delegating configuration and methods to cloudinary.service.js.
 */
import { cloudinary, uploadToCloudinary } from '../services/cloudinary.service.js';

export { cloudinary as default, uploadToCloudinary };
