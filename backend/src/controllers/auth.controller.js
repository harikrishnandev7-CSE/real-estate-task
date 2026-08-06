import authService from '../services/auth.service.js';
import { successResponse } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/transform.js';

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  setRefreshCookie(res, result.refreshToken);
  return successResponse(res, {
    token: result.token,
    user: result.user,
  }, 201);
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  setRefreshCookie(res, result.refreshToken);
  return successResponse(res, {
    token: result.token,
    user: result.user,
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await authService.refreshAccessToken(refreshToken);
  return successResponse(res, {
    token: result.accessToken,
    accessToken: result.accessToken,
  });
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return successResponse(res, { message: 'Logged out successfully.' });
};

export const me = async (req, res) => {
  return successResponse(res, { user: sanitizeUser(req.user) });
};
