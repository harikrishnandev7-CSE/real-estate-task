import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 'UNAUTHORIZED', 401);
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User associated with token no longer exists.', 'UNAUTHORIZED', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired.', 'TOKEN_EXPIRED', 401);
    }
    return errorResponse(res, 'Invalid access token.', 'INVALID_TOKEN', 401);
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 'UNAUTHORIZED', 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', 'FORBIDDEN', 403);
    }
    next();
  };
};
