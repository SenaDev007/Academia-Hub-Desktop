import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';
import { test } from 'node:test';

describe('Data Validation', () => {
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
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('User Registration Validation', () => {
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STUDENT',
          schoolId: testSchool.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STUDENT',
          schoolId: testSchool.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be at least 8 characters long');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields');
    });

    it('should validate role exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'INVALID_ROLE',
          schoolId: testSchool.id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid role');
    });

    it('should validate schoolId exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STUDENT',
          schoolId: 'non-existent-id'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('School not found');
    });

    it('should validate school status', async () => {
      // Mettre l'école en statut inactive
      await prisma.school.update({
        where: { id: testSchool.id },
        data: { status: 'inactive' }
      });

      const response = await request(app)
        .post('/api/auth/register')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STUDENT',
          schoolId: testSchool.id
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School subscription is not active');
    });
  });

  describe('School Validation', () => {
    it('should validate school subdomain uniqueness', async () => {
      // Créer une autre école avec le même sous-domaine
      const response = await request(app)
        .post('/api/schools')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          name: 'Duplicate School',
          subdomain: testSchool.subdomain,
          email: 'duplicate@school.com',
          phone: '0987654321'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Subdomain already exists');
    });

    it('should validate school status', async () => {
      // Mettre l'école en statut inactive
      await prisma.school.update({
        where: { id: testSchool.id },
        data: { status: 'inactive' }
      });

      // Essayer d'accéder à une route protégée
      const response = await request(app)
        .get('/api/schools/dashboard')
        .set('Host', `${testSchool.subdomain}.test`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('School subscription is not active');
    });

    it('should validate school email format', async () => {
      const response = await request(app)
        .post('/api/schools')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          name: 'Invalid Email School',
          subdomain: 'invalid-email',
          email: 'invalid-email',
          phone: '1234567890'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });

    it('should validate school phone number format', async () => {
      const response = await request(app)
        .post('/api/schools')
        .set('Host', `${testSchool.subdomain}.test`)
        .send({
          name: 'Invalid Phone School',
          subdomain: 'invalid-phone',
          email: 'test@school.com',
          phone: '123' // Trop court
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid phone number format');
    });
  });
});
