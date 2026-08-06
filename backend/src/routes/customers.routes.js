import { Router } from 'express';
import { z } from 'zod';
import * as customersController from '../controllers/customers.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone is required'),
}).passthrough();

router.use(verifyToken, requireRole('admin'));

router.get('/', asyncHandler(customersController.getCustomers));
router.post('/', validate(customerSchema), asyncHandler(customersController.createCustomer));
router.patch('/:id', asyncHandler(customersController.updateCustomer));
router.delete('/:id', asyncHandler(customersController.deleteCustomer));

export default router;
