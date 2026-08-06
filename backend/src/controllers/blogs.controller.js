import * as blogsService from '../services/blogs.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getBlogs = async (req, res) => {
  const blogs = await blogsService.getBlogs(req.query);
  return successResponse(res, { blogs, total: blogs.length });
};

export const getBlogBySlug = async (req, res) => {
  const blog = await blogsService.getBlogBySlug(req.params.slug);
  return successResponse(res, { blog });
};

export const createBlog = async (req, res) => {
  const blog = await blogsService.createBlog(req.body);
  return successResponse(res, { blog }, 201);
};

export const updateBlog = async (req, res) => {
  const blog = await blogsService.updateBlog(req.params.id, req.body);
  return successResponse(res, { blog });
};

export const deleteBlog = async (req, res) => {
  const result = await blogsService.deleteBlog(req.params.id);
  return successResponse(res, result);
};
