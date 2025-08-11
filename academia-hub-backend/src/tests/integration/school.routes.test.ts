import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { SchoolDTO } from '../../src/types/school';

describe('School Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.school.deleteMany();
    await prisma.$disconnect();
  });

  const validSchool: SchoolDTO = {
    name: 'Test School',
    address: '123 Test Street',
    email: 'test@school.com',
    phone: '1234567890',
    academicYear: '2023-2024',
    logo: 'https://example.com/logo.png',
    website: 'https://test.school.com',
    description: 'Test school description',
    status: 'ACTIVE'
  };

  describe('POST /api/schools', () => {
    it('should create a new school', async () => {
      const response = await request(app)
        .post('/api/schools')
        .send(validSchool)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', validSchool.name);
      expect(response.body).toHaveProperty('email', validSchool.email);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidSchool = { ...validSchool, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/schools')
        .send(invalidSchool)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });

    it('should return 409 for duplicate email', async () => {
      // Create first school
      await request(app)
        .post('/api/schools')
        .send(validSchool)
        .set('Authorization', 'Bearer valid-token');

      // Try to create another school with same email
      const response = await request(app)
        .post('/api/schools')
        .send(validSchool)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('GET /api/schools', () => {
    it('should list schools with pagination', async () => {
      // Create test schools
      await prisma.school.createMany({
        data: [
          { ...validSchool, name: 'School 1' },
          { ...validSchool, name: 'School 2' },
          { ...validSchool, name: 'School 3' }
        ]
      });

      const response = await request(app)
        .get('/api/schools')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('schools');
      expect(response.body.schools).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });
  });

  describe('GET /api/schools/:id', () => {
    it('should get school by id', async () => {
      const createdSchool = await prisma.school.create({
        data: validSchool
      });

      const response = await request(app)
        .get(`/api/schools/${createdSchool.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdSchool.id);
      expect(response.body).toHaveProperty('name', validSchool.name);
    });

    it('should return 404 for non-existent school', async () => {
      const response = await request(app)
        .get('/api/schools/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('School not found');
    });
  });

  describe('PUT /api/schools/:id', () => {
    it('should update school', async () => {
      const createdSchool = await prisma.school.create({
        data: validSchool
      });

      const updatedData = {
        name: 'Updated School Name',
        status: 'INACTIVE'
      };

      const response = await request(app)
        .put(`/api/schools/${createdSchool.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should return 404 for non-existent school', async () => {
      const response = await request(app)
        .put('/api/schools/non-existent-id')
        .send({ name: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('School not found');
    });
  });

  describe('DELETE /api/schools/:id', () => {
    it('should delete school', async () => {
      const createdSchool = await prisma.school.create({
        data: validSchool
      });

      const response = await request(app)
        .delete(`/api/schools/${createdSchool.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify school is deleted
      const school = await prisma.school.findUnique({
        where: { id: createdSchool.id }
      });

      expect(school).toBeNull();
    });

    it('should return 404 for non-existent school', async () => {
      const response = await request(app)
        .delete('/api/schools/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('School not found');
    });
  });

  describe('PUT /api/schools/:id/status', () => {
    it('should update school status', async () => {
      const createdSchool = await prisma.school.create({
        data: validSchool
      });

      const response = await request(app)
        .put(`/api/schools/${createdSchool.id}/status`)
        .send({ status: 'INACTIVE' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const school = await prisma.school.findUnique({
        where: { id: createdSchool.id }
      });

      expect(school?.status).toBe('INACTIVE');
    });

    it('should return 400 for invalid status', async () => {
      const createdSchool = await prisma.school.create({
        data: validSchool
      });

      const response = await request(app)
        .put(`/api/schools/${createdSchool.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });
});
