import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    property: { type: String, ref: 'Property', default: null },
    propertyName: { type: String, default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    scheduledDate: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    consultantName: { type: String, default: 'Unassigned' },
    status: { type: String, default: 'Scheduled' }, // Confirmed / Scheduled / Completed / Cancelled / No-show
    cancelReason: { type: String, default: null },
    completionNote: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const SiteVisit = Booking;
export default Booking;
