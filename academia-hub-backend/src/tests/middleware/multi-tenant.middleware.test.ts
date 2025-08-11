import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';

describe('Multi-tenant Middleware Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('Subdomain Validation', () => {
    it('should allow valid subdomain', async () => {
      // Create test school
      await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', 'test-school.local');

      expect(response.status).toBe(200);
    });

    it('should reject invalid subdomain', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', 'nonexistent-school.local');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School not found');
    });
  });

  describe('School Status Validation', () => {
    it('should allow active school', async () => {
      // Create active school
      await prisma.school.create({
        data: {
          subdomain: 'active-school',
          status: 'active'
        }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', 'active-school.local');

      expect(response.status).toBe(200);
    });

    it('should reject inactive school', async () => {
      // Create inactive school
      await prisma.school.create({
        data: {
          subdomain: 'inactive-school',
          status: 'inactive'
        }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', 'inactive-school.local');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School subscription is not active');
    });
  });

  describe('SchoolId Injection', () => {
    it('should inject schoolId into request', async () => {
      // Create test school
      const school = await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      // Mock route that uses schoolId
      app.get('/api/test-school-id', async (req, res) => {
        res.json({ schoolId: req.schoolId });
      });

      const response = await request(app)
        .get('/api/test-school-id')
        .set('Host', 'test-school.local');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('schoolId', school.id);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit requests per minute', async () => {
      // Create test school
      await prisma.school.create({
        data: {
          subdomain: 'rate-limit-school',
          status: 'active'
        }
      });

      // Make 100 requests in quick succession
      const promises = Array(100).fill(0).map(() =>
        request(app)
          .get('/api/test')
          .set('Host', 'rate-limit-school.local')
      );

      const responses = await Promise.allSettled(promises);

      // Check how many requests were successful
      const successful = responses.filter(r => r.status === 'fulfilled')
        .length;

      // We should have fewer successful requests than the total
      expect(successful).toBeLessThan(100);
    });

    it('should reset rate limit after time period', async () => {
      // Create test school
      await prisma.school.create({
        data: {
          subdomain: 'reset-school',
          status: 'active'
        }
      });

      // Make a request to hit the rate limit
      await request(app)
        .get('/api/test')
        .set('Host', 'reset-school.local')
        .expect(429);

      // Wait for rate limit to reset (1 minute)
      await new Promise(resolve => setTimeout(resolve, 60000));

      // Try again - should work
      await request(app)
        .get('/api/test')
        .set('Host', 'reset-school.local')
        .expect(200);
    });
  });
});
