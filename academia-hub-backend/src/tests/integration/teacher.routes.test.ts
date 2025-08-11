import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { TeacherDTO, CreateTeacherDTO } from '../../src/types/teacher';

describe('Teacher Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.teacher.deleteMany();
    await prisma.$disconnect();
  });

  const validTeacher: CreateTeacherDTO = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'teacher@example.com',
    phone: '1234567890',
    address: '123 Teacher Street',
    city: 'Teacher City',
    postalCode: '12345',
    country: 'France',
    schoolId: 'test-school-id',
    department: 'Mathematics',
    specialization: 'Algebra',
    status: 'active',
    userId: 'test-user-id'
  };

  describe('POST /api/teachers', () => {
    it('should create a new teacher', async () => {
      const response = await request(app)
        .post('/api/teachers')
        .send(validTeacher)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('firstName', validTeacher.firstName);
      expect(response.body).toHaveProperty('lastName', validTeacher.lastName);
      expect(response.body).toHaveProperty('department', validTeacher.department);
      expect(response.body).toHaveProperty('specialization', validTeacher.specialization);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidTeacher = { ...validTeacher, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/teachers')
        .send(invalidTeacher)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });
  });

  describe('GET /api/teachers', () => {
    it('should list teachers with pagination', async () => {
      // Create test teachers
      await prisma.teacher.createMany({
        data: [
          { ...validTeacher, firstName: 'Teacher 1' },
          { ...validTeacher, firstName: 'Teacher 2' },
          { ...validTeacher, firstName: 'Teacher 3' }
        ]
      });

      const response = await request(app)
        .get('/api/teachers')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('teachers');
      expect(response.body.teachers).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter teachers by department', async () => {
      // Create teachers in different departments
      await prisma.teacher.createMany({
        data: [
          { ...validTeacher, department: 'Mathematics' },
          { ...validTeacher, department: 'Science' }
        ]
      });

      const response = await request(app)
        .get('/api/teachers')
        .query({ department: 'Mathematics' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.teachers).toHaveLength(1);
      expect(response.body.teachers[0]).toHaveProperty('department', 'Mathematics');
    });
  });

  describe('GET /api/teachers/:id', () => {
    it('should get teacher by id', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .get(`/api/teachers/${createdTeacher.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdTeacher.id);
      expect(response.body).toHaveProperty('firstName', validTeacher.firstName);
      expect(response.body).toHaveProperty('lastName', validTeacher.lastName);
    });

    it('should return 404 for non-existent teacher', async () => {
      const response = await request(app)
        .get('/api/teachers/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });

  describe('PUT /api/teachers/:id', () => {
    it('should update teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const updatedData = {
        firstName: 'Updated Name',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/teachers/${createdTeacher.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', updatedData.firstName);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should return 404 for non-existent teacher', async () => {
      const response = await request(app)
        .put('/api/teachers/non-existent-id')
        .send({ firstName: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });

  describe('DELETE /api/teachers/:id', () => {
    it('should delete teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .delete(`/api/teachers/${createdTeacher.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify teacher is deleted
      const teacher = await prisma.teacher.findUnique({
        where: { id: createdTeacher.id }
      });

      expect(teacher).toBeNull();
    });

    it('should return 404 for non-existent teacher', async () => {
      const response = await request(app)
        .delete('/api/teachers/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });

  describe('PUT /api/teachers/:id/status', () => {
    it('should update teacher status', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .put(`/api/teachers/${createdTeacher.id}/status`)
        .send({ status: 'inactive' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const teacher = await prisma.teacher.findUnique({
        where: { id: createdTeacher.id }
      });

      expect(teacher?.status).toBe('inactive');
    });

    it('should return 400 for invalid status', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .put(`/api/teachers/${createdTeacher.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });

  describe('POST /api/teachers/:id/classes/:classId', () => {
    it('should add class to teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .post(`/api/teachers/${createdTeacher.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/teachers/:id/classes/:classId', () => {
    it('should remove class from teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      // First add a class
      await request(app)
        .post(`/api/teachers/${createdTeacher.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      const response = await request(app)
        .delete(`/api/teachers/${createdTeacher.id}/classes/class-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/teachers/:id/subjects/:subjectId', () => {
    it('should add subject to teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      const response = await request(app)
        .post(`/api/teachers/${createdTeacher.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/teachers/:id/subjects/:subjectId', () => {
    it('should remove subject from teacher', async () => {
      const createdTeacher = await prisma.teacher.create({
        data: validTeacher
      });

      // First add a subject
      await request(app)
        .post(`/api/teachers/${createdTeacher.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      const response = await request(app)
        .delete(`/api/teachers/${createdTeacher.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });
});
