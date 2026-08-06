import Property from '../models/Property.js';
import { formatProperty } from '../utils/transform.js';
import { successResponse } from '../utils/apiResponse.js';

export const searchProperties = async (req, res) => {
  const queryTerm = (req.query.q || req.query.query || '').trim();
  if (!queryTerm) {
    return successResponse(res, { query: '', total: 0, properties: [] });
  }

  const regex = new RegExp(queryTerm, 'i');

  const rawProperties = await Property.find({
    $or: [
      { title: regex },
      { location: regex },
      { city: regex },
      { type: regex },
      { builder: regex },
      { tag: regex },
      { description: regex },
      { amenities: regex },
    ],
  })
    .sort({ views: -1 })
    .limit(20)
    .lean();

  const properties = rawProperties.map(formatProperty);

  return successResponse(res, {
    query: queryTerm,
    total: properties.length,
    properties,
  });
};
