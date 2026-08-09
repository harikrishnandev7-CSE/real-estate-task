import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Consultant from '../models/Consultant.js';
import { formatProperty } from '../utils/transform.js';

export const getProperties = async (query = {}) => {
  const {
    purpose,
    city,
    type,
    minPrice,
    maxPrice,
    beds,
    baths,
    status,
    amenities,
    sort,
    page = 1,
    limit = 12,
  } = query;

  const where = {};

  if (purpose) where.purpose = { $regex: new RegExp(`^${purpose}$`, 'i') };
  if (city) where.city = { $regex: new RegExp(`^${city}$`, 'i') };
  if (type) where.type = { $regex: new RegExp(`^${type}$`, 'i') };
  if (status) where.status = { $regex: new RegExp(`^${status}$`, 'i') };

  if (minPrice || maxPrice) {
    where.numericPrice = {};
    if (minPrice) where.numericPrice.$gte = Number(minPrice);
    if (maxPrice) where.numericPrice.$lte = Number(maxPrice);
  }

  if (beds) where.beds = { $gte: parseInt(beds, 10) };
  if (baths) where.baths = { $gte: parseInt(baths, 10) };

  if (amenities) {
    const amenitiesList = Array.isArray(amenities) 
      ? amenities 
      : String(amenities).split(',').map(a => a.trim());
    where.amenities = { $all: amenitiesList.map(a => new RegExp(a, 'i')) };
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc' || sort === 'price-asc') sortObj = { numericPrice: 1 };
  if (sort === 'price_desc' || sort === 'price-desc') sortObj = { numericPrice: -1 };
  if (sort === 'rating') sortObj = { rating: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 12);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [total, rawProperties] = await Promise.all([
      Property.countDocuments(where),
      Property.find(where)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const properties = rawProperties.map(formatProperty);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      properties,
    };
  } catch (err) {
    console.warn(`Properties DB query warning: ${err.message}`);
    return {
      total: 0,
      page: pageNum,
      limit: limitNum,
      totalPages: 0,
      properties: [],
    };
  }
};

export const getPropertyById = async (id) => {
  const rawProperty = await Property.findById(id).lean();

  if (!rawProperty) {
    const error = new Error(`Property with id '${id}' not found.`);
    error.statusCode = 404;
    error.code = 'PROPERTY_NOT_FOUND';
    throw error;
  }

  // Increment views count asynchronously
  Property.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec().catch(() => {});

  return formatProperty(rawProperty);
};

export const createProperty = async (data) => {
  const {
    id,
    title,
    tag,
    priceDisplay,
    price,
    numericPrice,
    location,
    city,
    type,
    beds = 0,
    baths = 0,
    areaDisplay,
    area,
    numericArea,
    pricePerSqft,
    imageUrl,
    image,
    galleryUrls,
    gallery,
    amenities = [],
    pros = [],
    cons = [],
    reraApproved = false,
    rera = false,
    reraNumber,
    status = 'Published',
    purpose = 'Buy',
    builder,
    rating,
    growthRate,
    growth,
    investmentRating,
    description,
    desc,
    specs = {},
    roadWidth,
    facing,
    approval,
    frontage,
    dimensions,
    registrationStatus,
    // New media & legal fields
    videoUrl,
    tourUrl360,
    legal,
  } = data;

  const generatedId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const created = await Property.create({
    _id: generatedId,
    title,
    tag: tag || null,
    priceDisplay: priceDisplay || price || null,
    numericPrice: Number(numericPrice || 0),
    location,
    city,
    type,
    beds: parseInt(beds, 10) || 0,
    baths: parseInt(baths, 10) || 0,
    areaDisplay: areaDisplay || area || null,
    numericArea: parseInt(numericArea, 10) || 0,
    pricePerSqft: pricePerSqft || null,
    images: data.images || {},
    imageUrl: imageUrl || image || null,
    galleryUrls: galleryUrls || gallery || [],
    amenities: amenities || [],
    pros: pros || [],
    cons: cons || [],
    reraApproved: Boolean(reraApproved || rera),
    reraNumber: reraNumber || null,
    status,
    purpose,
    builder: builder || null,
    rating: rating ? parseFloat(rating) : 4.8,
    growthRate: growthRate || growth || null,
    investmentRating: investmentRating || null,
    description: description || desc || null,
    specs: specs || {},
    roadWidth: roadWidth || null,
    facing: facing || null,
    approval: approval || null,
    frontage: frontage || null,
    dimensions: dimensions || null,
    registrationStatus: registrationStatus || null,
    videoUrl: videoUrl || null,
    tourUrl360: tourUrl360 || null,
    legal: legal || {},
  });

  return formatProperty(created.toObject());
};

export const updateProperty = async (id, data) => {
  const existing = await Property.findById(id);
  if (!existing) {
    const error = new Error(`Property with id '${id}' not found.`);
    error.statusCode = 404;
    error.code = 'PROPERTY_NOT_FOUND';
    throw error;
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.tag !== undefined) updateData.tag = data.tag;
  if (data.priceDisplay !== undefined || data.price !== undefined) {
    updateData.priceDisplay = data.priceDisplay || data.price;
  }
  if (data.numericPrice !== undefined) updateData.numericPrice = Number(data.numericPrice);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.beds !== undefined) updateData.beds = parseInt(data.beds, 10);
  if (data.baths !== undefined) updateData.baths = parseInt(data.baths, 10);
  if (data.areaDisplay !== undefined || data.area !== undefined) {
    updateData.areaDisplay = data.areaDisplay || data.area;
  }
  if (data.numericArea !== undefined) updateData.numericArea = parseInt(data.numericArea, 10);
  if (data.pricePerSqft !== undefined) updateData.pricePerSqft = data.pricePerSqft;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.imageUrl !== undefined || data.image !== undefined) {
    updateData.imageUrl = data.imageUrl || data.image;
  }
  if (data.galleryUrls !== undefined || data.gallery !== undefined) {
    updateData.galleryUrls = data.galleryUrls || data.gallery;
  }
  if (data.amenities !== undefined) updateData.amenities = data.amenities;
  if (data.pros !== undefined) updateData.pros = data.pros;
  if (data.cons !== undefined) updateData.cons = data.cons;
  if (data.reraApproved !== undefined || data.rera !== undefined) {
    updateData.reraApproved = Boolean(data.reraApproved ?? data.rera);
  }
  if (data.reraNumber !== undefined) updateData.reraNumber = data.reraNumber;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.purpose !== undefined) updateData.purpose = data.purpose;
  if (data.builder !== undefined) updateData.builder = data.builder;
  if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
  if (data.growthRate !== undefined || data.growth !== undefined) {
    updateData.growthRate = data.growthRate || data.growth;
  }
  if (data.investmentRating !== undefined) updateData.investmentRating = data.investmentRating;
  if (data.description !== undefined || data.desc !== undefined) {
    updateData.description = data.description || data.desc;
  }
  if (data.specs !== undefined) updateData.specs = data.specs;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.tourUrl360 !== undefined) updateData.tourUrl360 = data.tourUrl360;
  if (data.legal !== undefined) updateData.legal = { ...(data.legal) };

  const updated = await Property.findByIdAndUpdate(id, updateData, { new: true }).lean();

  return formatProperty(updated);
};

export const deleteProperty = async (id) => {
  const existing = await Property.findById(id);
  if (!existing) {
    const error = new Error(`Property with id '${id}' not found.`);
    error.statusCode = 404;
    error.code = 'PROPERTY_NOT_FOUND';
    throw error;
  }

  await Property.findByIdAndDelete(id);
  return { id, message: 'Property deleted successfully.' };
};

export const bulkPropertiesAction = async ({ ids = [], action }) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    const error = new Error('No property IDs provided for bulk action.');
    error.statusCode = 400;
    error.code = 'INVALID_BULK_IDS';
    throw error;
  }

  if (action === 'Delete') {
    const result = await Property.deleteMany({ _id: { $in: ids } });
    return { count: result.deletedCount, action: 'Delete' };
  } else if (action === 'Publish' || action === 'Archive') {
    const result = await Property.updateMany(
      { _id: { $in: ids } },
      { status: action === 'Publish' ? 'Published' : 'Archived' }
    );
    return { count: result.modifiedCount, action };
  } else {
    const error = new Error('Invalid bulk action. Allowed actions: Publish, Archive, Delete.');
    error.statusCode = 400;
    error.code = 'INVALID_BULK_ACTION';
    throw error;
  }
};

const propertiesService = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  bulkPropertiesAction,
};

export default propertiesService;
