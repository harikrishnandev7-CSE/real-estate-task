import mongoose from 'mongoose';

const broadcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, default: 'All Users' },
    channels: { type: [String], default: ['email', 'whatsapp'] },
    sentDate: { type: Date, default: Date.now },
    openRate: { type: String, default: '0%' },
    status: { type: String, default: 'Sent' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Broadcast = mongoose.models.Broadcast || mongoose.model('Broadcast', broadcastSchema);
export default Broadcast;
