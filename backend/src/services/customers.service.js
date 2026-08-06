import Customer from '../models/Customer.js';

export const getCustomersAdmin = async (query = {}) => {
  const { city, purpose, search, leadStatus } = query;
  const where = {};

  if (city) where.city = { $regex: new RegExp(`^${city}$`, 'i') };
  if (purpose) where.purpose = { $regex: new RegExp(`^${purpose}$`, 'i') };
  if (leadStatus) where.leadStatus = { $regex: new RegExp(`^${leadStatus}$`, 'i') };

  if (search) {
    const regex = new RegExp(search, 'i');
    where.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  const customers = await Customer.find(where)
    .sort({ createdAt: -1 })
    .lean();

  return customers;
};

export const createCustomerAdmin = async (data) => {
  const {
    name,
    email,
    phone,
    city,
    purpose,
    budget,
    propertyTypes,
    locations,
    consultantName,
    leadStatus,
    notes,
  } = data;

  return Customer.create({
    name,
    email: email.toLowerCase().trim(),
    phone,
    city: city || null,
    purpose: purpose || 'Buy',
    budget: budget || null,
    propertyTypes: propertyTypes || [],
    locations: locations || [],
    consultantName: consultantName || null,
    leadStatus: leadStatus || 'New',
    notes: notes || null,
  });
};

export const updateCustomerAdmin = async (id, data) => {
  const existing = await Customer.findById(id);
  if (!existing) {
    const error = new Error('Customer CRM record not found.');
    error.statusCode = 404;
    error.code = 'CUSTOMER_NOT_FOUND';
    throw error;
  }

  return Customer.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteCustomerAdmin = async (id) => {
  const existing = await Customer.findById(id);
  if (!existing) {
    const error = new Error('Customer CRM record not found.');
    error.statusCode = 404;
    error.code = 'CUSTOMER_NOT_FOUND';
    throw error;
  }

  await Customer.findByIdAndDelete(id);
  return { id, message: 'Customer record deleted successfully.' };
};

const customersService = {
  getCustomersAdmin,
  createCustomerAdmin,
  updateCustomerAdmin,
  deleteCustomerAdmin,
};

export default customersService;
