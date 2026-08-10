import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    _id: { type: String }, // Custom string slug id like 'imperia-ritz'
    title: { type: String, required: true },
    tag: { type: String, default: null },
    priceDisplay: { type: String, default: null },
    numericPrice: { type: Number, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, required: true },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    areaDisplay: { type: String, default: null },
    numericArea: { type: Number, required: true },
    pricePerSqft: { type: String, default: null },
    imageUrl: { type: String, default: null },
    galleryUrls: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    reraApproved: { type: Boolean, default: false },
    reraNumber: { type: String, default: null },
    status: { type: String, default: 'Published' },
    purpose: { type: String, default: 'Buy' },
    builder: { type: String, default: null },
    rating: { type: Number, default: 4.8 },
    growthRate: { type: String, default: null },
    furnishing: { type: String, enum: ['full', 'semi', 'none'], default: 'full' },
    images: {
      entrance: { type: String, default: null },
      hall: { type: [String], default: [] },
      kitchen: { type: [String], default: [] },
      bedrooms: { type: [String], default: [] },
      bathrooms: { type: [String], default: [] },
      terrace: { type: [String], default: [] },
    },
    roomImages: [
      {
        url: { type: String, required: true },
        type: { type: String, required: true }, // 'bedroom', 'hall', 'kitchen', 'bathroom', 'exterior'
        furnished: { type: Boolean, required: true }
      }
    ],
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Plot specific fields
    roadWidth: { type: String, default: null },
    facing: { type: String, default: null },
    approval: { type: String, default: null },
    frontage: { type: String, default: null },
    dimensions: { type: String, default: null },
    registrationStatus: { type: String, default: null },

    views: { type: Number, default: 0 },
    enquiries: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },

    // ─── New developer, project & media fields ─────────────────────────
    developer: { type: String, default: null },
    projectId: { type: mongoose.Schema.Types.Mixed, ref: 'Project', default: null },
    videoUrl: { type: String, default: null },
    legal: {
      ecStatus: { type: String, default: null },
      dtcpCmdaApproval: { type: String, default: null },
      reraStatus: { type: String, default: null },
      propertyTaxStatus: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;
