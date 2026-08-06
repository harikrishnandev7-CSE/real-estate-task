import propertiesService from '../services/properties.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getProperties = async (req, res) => {
  const result = await propertiesService.getProperties(req.query);
  return successResponse(res, result);
};

export const getPropertyById = async (req, res) => {
  const property = await propertiesService.getPropertyById(req.params.id);
  return successResponse(res, { property });
};

export const createProperty = async (req, res) => {
  const property = await propertiesService.createProperty(req.body);
  return successResponse(res, { property }, 201);
};

export const updateProperty = async (req, res) => {
  const property = await propertiesService.updateProperty(req.params.id, req.body);
  return successResponse(res, { property });
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

  const files = req.files || [req.file];
  const urls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  return successResponse(res, {
    urls,
    url: urls[0],
  }, 201);
};
