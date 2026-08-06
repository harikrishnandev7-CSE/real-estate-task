import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: null },
    purpose: { type: String, default: 'Buy' },
    budget: { type: String, default: null },
    propertyTypes: { type: [String], default: [] },
    locations: { type: [String], default: [] },
    wishlistCount: { type: Number, default: 0 },
    hasUpcomingVisit: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    consultantName: { type: String, default: null },
    leadStatus: { type: String, default: 'New' }, // New / Contacted / Touring / Negotiating / Closed / Lost
    notes: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
