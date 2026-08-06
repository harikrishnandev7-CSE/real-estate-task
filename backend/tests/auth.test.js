import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../src/app.js';
import authService from '../src/services/auth.service.js';

describe('Auth Endpoints Smoke Tests', () => {
  const newUserPayload = {
    name: 'New User',
    email: 'newuser@example.com',
    phone: '+91 99900 00000',
    password: 'Password@123',
  };

  it('POST /api/v1/auth/register - should register a new customer', async () => {
    jest.spyOn(authService, 'registerUser').mockResolvedValueOnce({
      token: 'fake-jwt-access-token',
      accessToken: 'fake-jwt-access-token',
      refreshToken: 'fake-jwt-refresh-token',
      user: {
        id: 'user-uuid-123',
        fullName: 'New User',
        email: 'newuser@example.com',
        role: 'customer',
      },
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(newUserPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(newUserPayload.email.toLowerCase());
    expect(res.body.data.user.role).toBe('customer');
  });

  it('POST /api/v1/auth/login - should login user and return JWT token', async () => {
    jest.spyOn(authService, 'loginUser').mockResolvedValueOnce({
      token: 'fake-jwt-access-token',
      accessToken: 'fake-jwt-access-token',
      refreshToken: 'fake-jwt-refresh-token',
      user: {
        id: 'user-uuid-123',
        fullName: 'New User',
        email: 'newuser@example.com',
        role: 'customer',
      },
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'newuser@example.com',
        password: 'Password@123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('GET /api/v1/auth/me - should reject request without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
