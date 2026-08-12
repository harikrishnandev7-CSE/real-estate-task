import mongoose from 'mongoose';

const compareListSchema = new mongoose.Schema(
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

compareListSchema.index({ user: 1, property: 1 }, { unique: true });

export const CompareList = mongoose.models.CompareList || mongoose.model('CompareList', compareListSchema);
export default CompareList;
