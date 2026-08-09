import mongoose from 'mongoose';

/**
 * Consultant Model
 * - Links to an existing User document (role: 'consultant')
 * - city is stored as a plain string (matching existing Property.city convention)
 * - workingDays: array of weekday numbers, 0=Sunday ... 6=Saturday
 * - maxDailyVisits: per-consultant daily cap for auto-assignment
 */
const consultantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    city: {
      type: String,
      required: true,
      trim: true,
      // Plain string — matches existing Property.city and Customer.city convention.
      // DO NOT change to ObjectId; existing string-based city filtering is preserved.
    },
    maxDailyVisits: { type: Number, default: 5, min: 1, max: 50 },
    dailyVisitCap: { type: Number, default: 5, min: 1, max: 50 },
    // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    workingDays: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6], // All 7 days by default
    },
    languages: {
      type: [String],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for fast city-based lookups (core of assignment engine)
consultantSchema.index({ city: 1, isActive: 1 });

export const Consultant = mongoose.models.Consultant || mongoose.model('Consultant', consultantSchema);
export default Consultant;
