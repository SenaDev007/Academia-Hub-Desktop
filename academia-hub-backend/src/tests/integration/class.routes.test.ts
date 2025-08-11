import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { ClassDTO, CreateClassDTO } from '../../src/types/class';

describe('Class Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.class.deleteMany();
    await prisma.$disconnect();
  });

  const validClass: CreateClassDTO = {
    name: '6ème A',
    grade: '6ème',
    level: 'Première année',
    section: 'A',
    academicYear: '2023-2024',
    schoolId: 'test-school-id',
    status: 'active',
    teacherId: 'test-teacher-id'
  };

  describe('POST /api/classes', () => {
    it('should create a new class', async () => {
      const response = await request(app)
        .post('/api/classes')
        .send(validClass)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', validClass.name);
      expect(response.body).toHaveProperty('grade', validClass.grade);
      expect(response.body).toHaveProperty('academicYear', validClass.academicYear);
    });

    it('should return 400 for invalid academic year format', async () => {
      const invalidClass = { ...validClass, academicYear: 'invalid-year' };
      
      const response = await request(app)
        .post('/api/classes')
        .send(invalidClass)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid academic year format');
    });
  });

  describe('GET /api/classes', () => {
    it('should list classes with pagination', async () => {
      // Create test classes
      await prisma.class.createMany({
        data: [
          { ...validClass, name: '6ème A' },
          { ...validClass, name: '6ème B' },
          { ...validClass, name: '6ème C' }
        ]
      });

      const response = await request(app)
        .get('/api/classes')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('classes');
      expect(response.body.classes).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter classes by grade', async () => {
      // Create classes in different grades
      await prisma.class.createMany({
        data: [
          { ...validClass, grade: '6ème' },
          { ...validClass, grade: '5ème' }
        ]
      });

      const response = await request(app)
        .get('/api/classes')
        .query({ grade: '6ème' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.classes).toHaveLength(1);
      expect(response.body.classes[0]).toHaveProperty('grade', '6ème');
    });

    it('should filter classes by academic year', async () => {
      // Create classes in different academic years
      await prisma.class.createMany({
        data: [
          { ...validClass, academicYear: '2023-2024' },
          { ...validClass, academicYear: '2022-2023' }
        ]
      });

      const response = await request(app)
        .get('/api/classes')
        .query({ academicYear: '2023-2024' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.classes).toHaveLength(1);
      expect(response.body.classes[0]).toHaveProperty('academicYear', '2023-2024');
    });
  });

  describe('GET /api/classes/:id', () => {
    it('should get class by id', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .get(`/api/classes/${createdClass.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdClass.id);
      expect(response.body).toHaveProperty('name', validClass.name);
      expect(response.body).toHaveProperty('grade', validClass.grade);
    });

    it('should return 404 for non-existent class', async () => {
      const response = await request(app)
        .get('/api/classes/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Class not found');
    });
  });

  describe('PUT /api/classes/:id', () => {
    it('should update class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const updatedData = {
        name: 'Updated Class',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/classes/${createdClass.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should return 404 for non-existent class', async () => {
      const response = await request(app)
        .put('/api/classes/non-existent-id')
        .send({ name: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Class not found');
    });
  });

  describe('DELETE /api/classes/:id', () => {
    it('should delete class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .delete(`/api/classes/${createdClass.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify class is deleted
      const classObj = await prisma.class.findUnique({
        where: { id: createdClass.id }
      });

      expect(classObj).toBeNull();
    });

    it('should return 404 for non-existent class', async () => {
      const response = await request(app)
        .delete('/api/classes/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Class not found');
    });
  });

  describe('PUT /api/classes/:id/status', () => {
    it('should update class status', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .put(`/api/classes/${createdClass.id}/status`)
        .send({ status: 'inactive' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const classObj = await prisma.class.findUnique({
        where: { id: createdClass.id }
      });

      expect(classObj?.status).toBe('inactive');
    });

    it('should return 400 for invalid status', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .put(`/api/classes/${createdClass.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });

  describe('POST /api/classes/:id/students/:studentId', () => {
    it('should add student to class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .post(`/api/classes/${createdClass.id}/students/student-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/classes/:id/students/:studentId', () => {
    it('should remove student from class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      // First add a student
      await request(app)
        .post(`/api/classes/${createdClass.id}/students/student-123`)
        .set('Authorization', 'Bearer valid-token');

      const response = await request(app)
        .delete(`/api/classes/${createdClass.id}/students/student-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/classes/:id/subjects/:subjectId', () => {
    it('should add subject to class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      const response = await request(app)
        .post(`/api/classes/${createdClass.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /api/classes/:id/subjects/:subjectId', () => {
    it('should remove subject from class', async () => {
      const createdClass = await prisma.class.create({
        data: validClass
      });

      // First add a subject
      await request(app)
        .post(`/api/classes/${createdClass.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      const response = await request(app)
        .delete(`/api/classes/${createdClass.id}/subjects/subject-123`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });
  });
});
