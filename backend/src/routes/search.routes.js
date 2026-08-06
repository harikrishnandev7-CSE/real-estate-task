import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(searchController.searchProperties));

export default router;
