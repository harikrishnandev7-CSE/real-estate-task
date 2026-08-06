import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    passwordHash: { type: String, required: true },
    city: { type: String, default: null },
    state: { type: String, default: null },
    role: { type: String, enum: ['customer', 'consultant', 'admin'], default: 'customer' },
    purpose: { type: String, default: null },
    propertyTypes: { type: [String], default: [] },
    budgetRange: { type: String, default: null },
    targetLocations: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
