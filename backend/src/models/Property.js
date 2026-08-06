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
    investmentRating: { type: String, default: null },
    description: { type: String, default: null },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;
