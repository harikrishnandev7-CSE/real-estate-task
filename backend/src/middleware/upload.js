/**
 * middleware/upload.js — Re-exports unified Cloudinary Multer upload middleware.
 * Preserves backward compatibility while delegating storage logic to cloudinary.service.js.
 */
import { upload } from '../services/cloudinary.service.js';

export { upload, upload as default };
