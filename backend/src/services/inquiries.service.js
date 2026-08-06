import Inquiry from '../models/Inquiry.js';

export const createInquiry = async (data) => {
  const { fullName, name, email, phone, serviceRequested, service, message } = data;

  const created = await Inquiry.create({
    fullName: fullName || name || 'Anonymous Guest',
    email,
    phone,
    serviceRequested: serviceRequested || service || 'General Inquiry',
    message: message || '',
    status: 'New',
  });

  return created.toObject();
};

export const getInquiriesAdmin = async () => {
  return Inquiry.find()
    .sort({ createdAt: -1 })
    .lean();
};

const inquiriesService = {
  createInquiry,
  getInquiriesAdmin,
};

export default inquiriesService;
