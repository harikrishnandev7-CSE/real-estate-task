import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: String, ref: 'Property', required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recentlyViewedSchema.index({ user: 1, property: 1 }, { unique: true });

export const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model('RecentlyViewed', recentlyViewedSchema);
export default RecentlyViewed;
