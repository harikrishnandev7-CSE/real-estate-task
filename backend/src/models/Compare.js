import mongoose from 'mongoose';

const compareSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: String, ref: 'Property', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

compareSchema.index({ user: 1, property: 1 }, { unique: true });

export const Compare = mongoose.models.Compare || mongoose.model('Compare', compareSchema);
export default Compare;
