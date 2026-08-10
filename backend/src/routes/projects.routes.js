import { Router } from 'express';
import * as projectsController from '../controllers/projects.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(projectsController.getProjects));
router.get('/:id', asyncHandler(projectsController.getProjectById));

export default router;
