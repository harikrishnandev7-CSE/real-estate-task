import * as customersService from '../services/customers.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getCustomers = async (req, res) => {
  const customers = await customersService.getCustomersAdmin(req.query);
  return successResponse(res, { customers, total: customers.length });
};

export const createCustomer = async (req, res) => {
  const customer = await customersService.createCustomerAdmin(req.body);
  return successResponse(res, { customer }, 201);
};

export const updateCustomer = async (req, res) => {
  const customer = await customersService.updateCustomerAdmin(req.params.id, req.body);
  return successResponse(res, { customer });
};

export const deleteCustomer = async (req, res) => {
  const result = await customersService.deleteCustomerAdmin(req.params.id);
  return successResponse(res, result);
};
