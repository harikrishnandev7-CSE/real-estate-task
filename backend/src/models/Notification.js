import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: null },
    category: { type: String, default: null },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String, default: null },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
