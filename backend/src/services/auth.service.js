import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { sanitizeUser } from '../utils/transform.js';

export const generateTokens = (user) => {
  const payload = { id: user._id ? user._id.toString() : user.id, email: user.email, role: user.role };
  
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, fullName, email, phone, password }) => {
  const userEmail = email.toLowerCase().trim();
  const userName = fullName || name || 'Imperia User';

  const existing = await User.findOne({ email: userEmail });

  if (existing) {
    const error = new Error('User with this email already exists.');
    error.statusCode = 409;
    error.code = 'USER_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName: userName,
    email: userEmail,
    phone: phone || null,
    passwordHash,
    role: 'customer',
  });

  const tokens = generateTokens(user);
  return {
    user: sanitizeUser(user),
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const userEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const tokens = generateTokens(user);
  return {
    user: sanitizeUser(user),
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required.');
    error.statusCode = 401;
    error.code = 'NO_REFRESH_TOKEN';
    throw error;
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 401;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const tokens = generateTokens(user);
    return {
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
      user: sanitizeUser(user),
    };
  } catch (err) {
    const error = new Error('Invalid or expired refresh token.');
    error.statusCode = 401;
    error.code = 'INVALID_REFRESH_TOKEN';
    throw error;
  }
};

const authService = {
  generateTokens,
  registerUser,
  loginUser,
  refreshAccessToken,
};

export default authService;
