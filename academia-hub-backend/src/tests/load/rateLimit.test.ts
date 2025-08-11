import request from 'supertest';
import { app } from '../../index';
import { test } from 'node:test';

describe('Rate Limiting Tests', () => {
  const RATE_LIMIT_WINDOW_MS = 900000; // 15 minutes
  const RATE_LIMIT_MAX_REQUESTS = 100;

  describe('Auth Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Make 99 requests (below the limit)
      for (let i = 0; i < 99; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData);

        expect(response.status).toBe(401); // User doesn't exist, but request is allowed
      }
    });

    it('should block requests when rate limit is exceeded', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Make 100 requests (exceeding the limit)
      for (let i = 0; i < 100; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData);

        if (i >= 99) {
          expect(response.status).toBe(429); // Too Many Requests
          expect(response.body.message).toBe('Trop de tentatives d\'authentification. Veuillez réessayer plus tard.');
        } else {
          expect(response.status).toBe(401); // User doesn't exist, but request is allowed
        }
      }
    });

    it('should reset rate limit after window expires', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Make 100 requests to exceed limit
      for (let i = 0; i < 100; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData);
      }

      // Wait for rate limit window to expire
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WINDOW_MS + 1000));

      // Make another request - should be allowed
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401); // User doesn't exist, but request is allowed
    });
  });

  describe('API Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make 999 requests (below the limit)
      for (let i = 0; i < 999; i++) {
        const response = await request(app).get('/api/profile');
        expect(response.status).toBe(401); // No token, but request is allowed
      }
    });

    it('should block requests when rate limit is exceeded', async () => {
      // Make 1000 requests (exceeding the limit)
      for (let i = 0; i < 1000; i++) {
        const response = await request(app).get('/api/profile');

        if (i >= 999) {
          expect(response.status).toBe(429); // Too Many Requests
          expect(response.body.message).toBe('Trop de requêtes. Veuillez réessayer plus tard.');
        } else {
          expect(response.status).toBe(401); // No token, but request is allowed
        }
      }
    });

    it('should reset rate limit after window expires', async () => {
      // Make 1000 requests to exceed limit
      for (let i = 0; i < 1000; i++) {
        await request(app).get('/api/profile');
      }

      // Wait for rate limit window to expire
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WINDOW_MS + 1000));

      // Make another request - should be allowed
      const response = await request(app).get('/api/profile');
      expect(response.status).toBe(401); // No token, but request is allowed
    });
  });
});
