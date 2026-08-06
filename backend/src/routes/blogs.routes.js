import { Router } from 'express';
import { z } from 'zod';
import * as blogsController from '../controllers/blogs.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().optional(),
  author: z.string().optional(),
}).passthrough();

// Public routes
router.get('/', asyncHandler(blogsController.getBlogs));
router.get('/:slug', asyncHandler(blogsController.getBlogBySlug));

// Admin routes
router.post('/admin/blogs', verifyToken, requireRole('admin'), validate(blogSchema), asyncHandler(blogsController.createBlog));
router.put('/admin/blogs/:id', verifyToken, requireRole('admin'), asyncHandler(blogsController.updateBlog));
router.delete('/admin/blogs/:id', verifyToken, requireRole('admin'), asyncHandler(blogsController.deleteBlog));

export default router;
