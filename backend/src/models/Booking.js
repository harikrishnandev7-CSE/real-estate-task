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

    // ─── New fields added for auto-assignment (additive, backward-compatible) ─────
    // cityName: plain string city for assignment engine — keeps Property.city convention
    cityName: { type: String, default: null },
    // consultant: ref to Consultant profile (null = unassigned)
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultant',
      default: null,
    },
    // assignmentStatus tracks auto-assignment workflow
    assignmentStatus: {
      type: String,
      enum: ['PendingAssignment', 'Assigned', 'PendingAdminReview', 'Reassigned'],
      default: 'PendingAssignment',
    },
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
