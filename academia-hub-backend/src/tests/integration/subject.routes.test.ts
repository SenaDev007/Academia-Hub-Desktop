import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { SubjectDTO, CreateSubjectDTO } from '../../src/types/subject';

describe('Subject Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.subject.deleteMany();
    await prisma.$disconnect();
  });

  const validSubject: CreateSubjectDTO = {
    name: 'Mathématiques',
    code: 'MATH101',
    description: 'Introduction aux mathématiques',
    credits: 4,
    schoolId: 'test-school-id',
    status: 'active',
    teacherId: 'test-teacher-id'
  };

  describe('POST /api/subjects', () => {
    it('should create a new subject', async () => {
      const response = await request(app)
        .post('/api/subjects')
        .send(validSubject)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', validSubject.name);
      expect(response.body).toHaveProperty('code', validSubject.code);
      expect(response.body).toHaveProperty('credits', validSubject.credits);
    });

    it('should return 400 for invalid credits', async () => {
      const invalidSubject = { ...validSubject, credits: -1 };
      
      const response = await request(app)
        .post('/api/subjects')
        .send(invalidSubject)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credits');
    });
  });

  describe('GET /api/subjects', () => {
    it('should list subjects with pagination', async () => {
      // Create test subjects
      await prisma.subject.createMany({
        data: [
          { ...validSubject, name: 'Mathématiques' },
          { ...validSubject, name: 'Physique' },
          { ...validSubject, name: 'Chimie' }
        ]
      });

      const response = await request(app)
        .get('/api/subjects')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('subjects');
      expect(response.body.subjects).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter subjects by name', async () => {
      // Create subjects with different names
      await prisma.subject.createMany({
        data: [
          { ...validSubject, name: 'Mathématiques' },
          { ...validSubject, name: 'Histoire' }
        ]
      });

      const response = await request(app)
        .get('/api/subjects')
        .query({ name: 'Math' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.subjects).toHaveLength(1);
      expect(response.body.subjects[0]).toHaveProperty('name', 'Mathématiques');
    });
  });

  describe('GET /api/subjects/:id', () => {
    it('should get subject by id', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const response = await request(app)
        .get(`/api/subjects/${createdSubject.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdSubject.id);
      expect(response.body).toHaveProperty('name', validSubject.name);
      expect(response.body).toHaveProperty('code', validSubject.code);
    });

    it('should return 404 for non-existent subject', async () => {
      const response = await request(app)
        .get('/api/subjects/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Subject not found');
    });
  });

  describe('PUT /api/subjects/:id', () => {
    it('should update subject', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const updatedData = {
        name: 'Updated Subject',
        credits: 5,
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/subjects/${createdSubject.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('credits', updatedData.credits);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should return 404 for non-existent subject', async () => {
      const response = await request(app)
        .put('/api/subjects/non-existent-id')
        .send({ name: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Subject not found');
    });
  });

  describe('DELETE /api/subjects/:id', () => {
    it('should delete subject', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const response = await request(app)
        .delete(`/api/subjects/${createdSubject.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify subject is deleted
      const subject = await prisma.subject.findUnique({
        where: { id: createdSubject.id }
      });

      expect(subject).toBeNull();
    });

    it('should return 404 for non-existent subject', async () => {
      const response = await request(app)
        .delete('/api/subjects/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Subject not found');
    });
  });

  describe('PUT /api/subjects/:id/status', () => {
    it('should update subject status', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const response = await request(app)
        .put(`/api/subjects/${createdSubject.id}/status`)
        .send({ status: 'inactive' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const subject = await prisma.subject.findUnique({
        where: { id: createdSubject.id }
      });

      expect(subject?.status).toBe('inactive');
    });

    it('should return 400 for invalid status', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const response = await request(app)
        .put(`/api/subjects/${createdSubject.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });

  describe('POST /api/subjects/:id/classes/:classId', () => {
    it('should add class to subject', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      const response = await request(app)
        .post(`/api/subjects/${createdSubject.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/subjects/:id/classes/:classId', () => {
    it('should remove class from subject', async () => {
      const createdSubject = await prisma.subject.create({
        data: validSubject
      });

      // First add a class
      await request(app)
        .post(`/api/subjects/${createdSubject.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      const response = await request(app)
        .delete(`/api/subjects/${createdSubject.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });
});
