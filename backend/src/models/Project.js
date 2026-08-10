import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    developer: { type: String, required: true, index: true }, // Normalized developer name (lowercase, trimmed)
    city: { type: String, default: null },
    properties: [{ type: mongoose.Schema.Types.Mixed, ref: 'Property' }],
    totalProperties: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
