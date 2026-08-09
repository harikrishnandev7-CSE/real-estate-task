import mongoose from 'mongoose';

/**
 * VisitAssignment Model
 *
 * Tracks which consultant is assigned to which site-visit booking.
 * - visitRequest: refs Booking._id (ObjectId)
 * - consultant: refs Consultant._id (ObjectId)
 * - date: stored as "YYYY-MM-DD" string — matches Booking.scheduledDate convention
 * - status: Assigned → Reassigned (when admin reassigns) or Cancelled
 * - assignedBy: 'system' (auto-engine) or 'admin' (manual override)
 */
const visitAssignmentSchema = new mongoose.Schema(
  {
    visitRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultant',
      required: true,
    },
    date: {
      type: String,
      required: true,
      // Stored as string (e.g., "2026-08-07") to match Booking.scheduledDate convention
    },
    status: {
      type: String,
      enum: ['Assigned', 'Reassigned', 'Cancelled'],
      default: 'Assigned',
    },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: {
      type: String,
      enum: ['system', 'admin'],
      default: 'system',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for fast daily-cap counting:
// "How many non-cancelled assignments does consultant X have on date Y?"
visitAssignmentSchema.index({ consultant: 1, date: 1, status: 1 });

// Index for looking up all assignments for a given booking
visitAssignmentSchema.index({ visitRequest: 1 });

export const VisitAssignment =
  mongoose.models.VisitAssignment ||
  mongoose.model('VisitAssignment', visitAssignmentSchema);

export default VisitAssignment;
