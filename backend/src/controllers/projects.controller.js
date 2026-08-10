import projectsService from '../services/projects.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getProjects = async (req, res) => {
  const projects = await projectsService.getProjects(req.query);
  return successResponse(res, { projects });
};

export const getProjectById = async (req, res) => {
  const project = await projectsService.getProjectById(req.params.id);
  return successResponse(res, { project });
};

export default {
  getProjects,
  getProjectById
};
