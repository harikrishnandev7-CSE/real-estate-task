import { errorResponse } from '../utils/apiResponse.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err instanceof ZodError) {
    const issueMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return errorResponse(res, `Validation error: ${issueMessages}`, 'VALIDATION_ERROR', 400, err.errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
    return errorResponse(res, `A record with this ${field} already exists.`, 'DUPLICATE_ENTRY', 409);
  }

  // Mongoose CastError (invalid ObjectId or type casting)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid resource identifier format.`, 'INVALID_ID', 400);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join(', ');
    return errorResponse(res, `Validation error: ${messages}`, 'VALIDATION_ERROR', 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return errorResponse(res, message, code, statusCode);
};

export default errorHandler;
