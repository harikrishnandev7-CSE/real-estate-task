import { Router } from 'express';
import * as consultantsController from '../controllers/consultants.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Public route: GET /api/v1/consultants
router.get('/', asyncHandler(consultantsController.getPublicConsultants));

export default router;
