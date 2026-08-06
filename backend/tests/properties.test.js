import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../src/app.js';
import propertiesService from '../src/services/properties.service.js';

describe('Properties Endpoints Smoke Tests', () => {
  it('GET /api/v1/properties - should return list of properties', async () => {
    jest.spyOn(propertiesService, 'getProperties').mockResolvedValueOnce({
      total: 1,
      page: 1,
      limit: 12,
      totalPages: 1,
      properties: [
        {
          id: 'imperia-ritz',
          title: 'The Ritz-Carlton Residences',
          price: '₹14.5 Cr',
          numericPrice: 145000000,
          location: 'OMR, Chennai',
          city: 'Chennai',
          type: 'Apartment',
        },
      ],
    });

    const res = await request(app).get('/api/v1/properties');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('properties');
    expect(Array.isArray(res.body.data.properties)).toBe(true);
    expect(res.body.data.properties.length).toBe(1);
    expect(res.body.data.properties[0].id).toBe('imperia-ritz');
  });

  it('GET /api/v1/health - should return health status ok', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});
