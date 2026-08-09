import propertiesService from '../services/properties.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getProperties = async (req, res) => {
  const result = await propertiesService.getProperties(req.query);
  return successResponse(res, result);
};

export const getPropertyById = async (req, res) => {
  const property = await propertiesService.getPropertyById(req.params.id);
  return successResponse(res, { property });
};

const extractStructuredImages = (req) => {
  let images = {
    entrance: null,
    hall: [],
    kitchen: [],
    bedrooms: [],
    bathrooms: [],
    terrace: []
  };

  if (req.body.images) {
    try {
      const parsed = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
      if (parsed && typeof parsed === 'object') {
        images.entrance = parsed.entrance || null;
        images.hall = Array.isArray(parsed.hall) ? parsed.hall.filter(Boolean) : [];
        images.kitchen = Array.isArray(parsed.kitchen) ? parsed.kitchen.filter(Boolean) : [];
        images.bedrooms = Array.isArray(parsed.bedrooms) ? parsed.bedrooms.filter(Boolean) : [];
        images.bathrooms = Array.isArray(parsed.bathrooms) ? parsed.bathrooms.filter(Boolean) : [];
        images.terrace = Array.isArray(parsed.terrace) ? parsed.terrace.filter(Boolean) : [];
      }
    } catch (e) {}
  }

  const getUrl = (f) => f.path || f.secure_url;

  if (req.files) {
    console.log('Uploading to Cloudinary...');
    if (req.files.entrance?.[0]) {
      const url = getUrl(req.files.entrance[0]);
      console.log('Cloudinary Upload Response (Entrance):', url);
      images.entrance = url;
    }
    if (req.files.hall?.length > 0) {
      const urls = req.files.hall.map(f => {
        const url = getUrl(f);
        console.log('Cloudinary Upload Response (Hall):', url);
        return url;
      });
      images.hall = [...images.hall, ...urls];
    }
    if (req.files.kitchen?.length > 0) {
      const urls = req.files.kitchen.map(f => {
        const url = getUrl(f);
        console.log('Cloudinary Upload Response (Kitchen):', url);
        return url;
      });
      images.kitchen = [...images.kitchen, ...urls];
    }
    if (req.files.bedrooms?.length > 0) {
      const urls = req.files.bedrooms.map(f => {
        const url = getUrl(f);
        console.log('Cloudinary Upload Response (Bedrooms):', url);
        return url;
      });
      images.bedrooms = [...images.bedrooms, ...urls];
    }
    if (req.files.bathrooms?.length > 0) {
      const urls = req.files.bathrooms.map(f => {
        const url = getUrl(f);
        console.log('Cloudinary Upload Response (Bathrooms):', url);
        return url;
      });
      images.bathrooms = [...images.bathrooms, ...urls];
    }
    if (req.files.terrace?.length > 0) {
      const urls = req.files.terrace.map(f => {
        const url = getUrl(f);
        console.log('Cloudinary Upload Response (Terrace):', url);
        return url;
      });
      images.terrace = [...images.terrace, ...urls];
    }
  }

  return images;
};

const parseJsonArrayField = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    if (val.length === 1 && typeof val[0] === 'string' && (val[0].startsWith('[') || val[0].startsWith('{'))) {
      try {
        const parsed = JSON.parse(val[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return val;
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [val];
  }
  return [];
};

export const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };
    const structuredImages = extractStructuredImages(req);
    propertyData.images = structuredImages;

    if (req.body.amenities) propertyData.amenities = parseJsonArrayField(req.body.amenities);
    if (req.body.pros) propertyData.pros = parseJsonArrayField(req.body.pros);
    if (req.body.cons) propertyData.cons = parseJsonArrayField(req.body.cons);

    // Pick cover photo: entrance image first, else first available room image
    const primaryCover = structuredImages.entrance 
      || structuredImages.hall[0] 
      || structuredImages.kitchen[0] 
      || structuredImages.bedrooms[0] 
      || structuredImages.bathrooms[0] 
      || structuredImages.terrace[0] 
      || propertyData.imageUrl 
      || propertyData.image;

    if (primaryCover) {
      propertyData.imageUrl = primaryCover;
      propertyData.image = primaryCover;
    }

    const property = await propertiesService.createProperty(propertyData);
    return successResponse(res, { property }, 201);
  } catch (err) {
    console.error('Error creating property:', err.message);
    return errorResponse(res, err.message || 'Failed to create property', 'CREATE_PROPERTY_FAILED', 500);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };
    const structuredImages = extractStructuredImages(req);
    propertyData.images = structuredImages;

    if (req.body.amenities) propertyData.amenities = parseJsonArrayField(req.body.amenities);
    if (req.body.pros) propertyData.pros = parseJsonArrayField(req.body.pros);
    if (req.body.cons) propertyData.cons = parseJsonArrayField(req.body.cons);

    const primaryCover = structuredImages.entrance 
      || structuredImages.hall[0] 
      || structuredImages.kitchen[0] 
      || structuredImages.bedrooms[0] 
      || structuredImages.bathrooms[0] 
      || structuredImages.terrace[0] 
      || propertyData.imageUrl 
      || propertyData.image;

    if (primaryCover) {
      propertyData.imageUrl = primaryCover;
      propertyData.image = primaryCover;
    }

    const property = await propertiesService.updateProperty(req.params.id, propertyData);
    return successResponse(res, { property });
  } catch (err) {
    console.error('Error updating property:', err.message);
    return errorResponse(res, err.message || 'Failed to update property', 'UPDATE_PROPERTY_FAILED', 500);
  }
};

export const deleteProperty = async (req, res) => {
  const result = await propertiesService.deleteProperty(req.params.id);
  return successResponse(res, result);
};

export const bulkPropertiesAction = async (req, res) => {
  const result = await propertiesService.bulkPropertiesAction(req.body);
  return successResponse(res, result);
};

export const uploadMedia = async (req, res) => {
  if (!req.files && !req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'No media file uploaded.', code: 'NO_FILE' },
    });
  }

  console.log('Uploading to Cloudinary...');
  const files = req.files || [req.file];

  // multer-storage-cloudinary sets file.path = Cloudinary secure_url
  const urls = files.map(file => {
    const secureUrl = file.path || file.secure_url;
    console.log('Cloudinary Upload Response:', secureUrl);
    return {
      url:       secureUrl,       // Cloudinary secure https URL
      publicId:  file.filename || file.public_id,   // Cloudinary public_id
      roomType:  req.body.roomType  || 'general',
      variant:   req.body.variant   || 'furnished',
      furnished: req.body.furnished === 'true' || req.body.furnished === true,
      type:      req.body.roomType  || 'exterior',
    };
  });

  return successResponse(res, {
    urls,
    url: urls[0]?.url,
  }, 201);
};
