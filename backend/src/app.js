import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { successResponse, errorResponse } from './utils/apiResponse.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import propertiesRoutes from './routes/properties.routes.js';
import searchRoutes from './routes/search.routes.js';
import userRoutes from './routes/user.routes.js';
import siteVisitsRoutes from './routes/siteVisits.routes.js';
import customersRoutes from './routes/customers.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import broadcastsRoutes from './routes/broadcasts.routes.js';
import inquiriesRoutes from './routes/inquiries.routes.js';
import consultantsRoutes from './routes/consultants.routes.js';
import consultantDashboardRoutes from './routes/consultantDashboard.routes.js';
import adminCalendarRoutes from './routes/adminCalendar.routes.js';
import banksRoutes from './routes/banks.routes.js';
import publicConsultantsRoutes from './routes/publicConsultants.routes.js';
import projectsRoutes from './routes/projects.routes.js';

const app = express();

// Basic Security & Logging Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // allow static upload image access cross-origin
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// CORS Configuration
const allowedOrigins = [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev to ensure frontend integration
    }
  },
  credentials: true,
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// (Images served from Cloudinary CDN — no local /uploads static route needed)


// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  return successResponse(res, { status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/site-visits', siteVisitsRoutes);

// Admin-specific API Route Mounts (matching frontend paths)
app.use('/api/v1/admin/customers', customersRoutes);
app.use('/api/v1/admin/site-visits', siteVisitsRoutes);
app.use('/api/v1/admin/broadcasts', broadcastsRoutes);
app.use('/api/v1/admin/inquiries', inquiriesRoutes);
app.use('/api/v1/admin/properties', propertiesRoutes);
app.use('/api/v1/admin/consultants', consultantsRoutes);
app.use('/api/v1/admin', adminCalendarRoutes);

// Consultant dashboard (role: consultant)
app.use('/api/v1/consultant', consultantDashboardRoutes);

// Shared & Public Route Mounts
app.use('/api/v1/blogs', blogsRoutes);
app.use('/api/v1/admin/blogs', blogsRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/admin/projects', projectsRoutes);
app.use('/api/v1/inquiries', inquiriesRoutes);
app.use('/api/v1/banks', banksRoutes);
app.use('/api/v1/consultants', publicConsultantsRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  return errorResponse(res, `Route '${req.originalUrl}' not found on this server.`, 'NOT_FOUND', 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
