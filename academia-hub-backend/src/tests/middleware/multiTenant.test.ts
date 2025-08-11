import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';
import { test } from 'node:test';

describe('Multi-tenant Middleware', () => {
  let prisma: PrismaClient;
  let testSchool: any;

  beforeEach(async () => {
    prisma = new PrismaClient();
    // Créer une école de test
    testSchool = await prisma.school.create({
      data: {
        name: 'Test School',
        subdomain: 'test-school',
        email: 'test@school.com',
        phone: '1234567890',
        status: 'active'
      }
    });
  });

  afterEach(async () => {
    await prisma.school.deleteMany();
    await prisma.$disconnect();
  });

  describe('School Subdomain Validation', () => {
    it('should allow requests to valid subdomain', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(200);
      expect(response.body.schoolId).toBe(testSchool.id);
    });

    it('should block requests to invalid subdomain', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', 'invalid-school.test');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('School not found');
    });

    it('should handle malformed host header', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', 'malformed');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid host header');
    });
  });

  describe('School Status Validation', () => {
    it('should block requests to inactive school', async () => {
      // Mettre l'école en statut inactive
      await prisma.school.update({
        where: { id: testSchool.id },
        data: { status: 'inactive' }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School subscription is not active');
    });

    it('should block requests to expired school', async () => {
      // Mettre l'école en statut expired
      await prisma.school.update({
        where: { id: testSchool.id },
        data: { status: 'expired' }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School subscription has expired');
    });
  });

    it('should allow requests to active school', async () => {
      // Mettre l'école en statut active
      await prisma.school.update({
        where: { subdomain: 'test-school' },
        data: { status: 'active' }
      });

      const response = await request(app)
        .get('/api/test')
        .set('Host', 'test-school.test');

      expect(response.status).toBe(200);
    });
  });

  describe('School ID Injection', () => {
    it('should inject schoolId into request', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(200);
      expect(response.body.schoolId).toBe(testSchool.id);
    });

    it('should inject school settings into request', async () => {
      const response = await request(app)
        .get('/api/test')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(200);
      expect(response.body.schoolSettings).toBeDefined();
    });
  });
});
