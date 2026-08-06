/**
 * Standardized Success Response Envelope
 */
export const successResponse = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

/**
 * Standardized Error Response Envelope
 */
export const errorResponse = (res, message = 'Internal Server Error', code = 'SERVER_ERROR', statusCode = 500, details = null) => {
  const payload = {
    message,
    code,
  };
  if (details) {
    payload.details = details;
  }
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: payload,
  });
};
