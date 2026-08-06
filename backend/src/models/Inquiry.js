import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceRequested: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, default: 'New' }, // New / Contacted / Resolved
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
