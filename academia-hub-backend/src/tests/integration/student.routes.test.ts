import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { StudentDTO, CreateStudentDTO } from '../../src/types/student';

describe('Student Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  });

  const validStudent: CreateStudentDTO = {
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '2000-01-01',
    gender: 'MALE',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '1234567890',
    emergencyContactRelationship: 'Mother',
    schoolId: 'test-school-id',
    userId: 'test-user-id',
    studentId: 'STUDENT-123'
  };

  describe('POST /api/students', () => {
    it('should create a new student', async () => {
      const response = await request(app)
        .post('/api/students')
        .send(validStudent)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('firstName', validStudent.firstName);
      expect(response.body).toHaveProperty('lastName', validStudent.lastName);
      expect(response.body).toHaveProperty('birthDate', validStudent.birthDate);
      expect(response.body).toHaveProperty('gender', validStudent.gender);
      expect(response.body).toHaveProperty('studentId', validStudent.studentId);
    });

    it('should return 400 for invalid birthDate format', async () => {
      const invalidStudent = { ...validStudent, birthDate: 'invalid-date' };
      
      const response = await request(app)
        .post('/api/students')
        .send(invalidStudent)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid birthDate format');
    });

    it('should return 409 for duplicate studentId', async () => {
      // Create first student
      await request(app)
        .post('/api/students')
        .send(validStudent)
        .set('Authorization', 'Bearer valid-token');

      // Try to create another student with same studentId
      const response = await request(app)
        .post('/api/students')
        .send(validStudent)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Student ID already exists');
    });
  });

  describe('GET /api/students', () => {
    it('should list students with pagination', async () => {
      // Create test students
      await prisma.student.createMany({
        data: [
          { ...validStudent, firstName: 'Student 1' },
          { ...validStudent, firstName: 'Student 2' },
          { ...validStudent, firstName: 'Student 3' }
        ]
      });

      const response = await request(app)
        .get('/api/students')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('students');
      expect(response.body.students).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter students by classId', async () => {
      // Create students in different classes
      await prisma.student.createMany({
        data: [
          { ...validStudent, classId: 'class-1' },
          { ...validStudent, classId: 'class-2' }
        ]
      });

      const response = await request(app)
        .get('/api/students')
        .query({ classId: 'class-1' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.students).toHaveLength(1);
      expect(response.body.students[0]).toHaveProperty('classId', 'class-1');
    });
  });

  describe('GET /api/students/:id', () => {
    it('should get student by id', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const response = await request(app)
        .get(`/api/students/${createdStudent.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdStudent.id);
      expect(response.body).toHaveProperty('firstName', validStudent.firstName);
      expect(response.body).toHaveProperty('lastName', validStudent.lastName);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .get('/api/students/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const updatedData = {
        firstName: 'Updated Name',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/students/${createdStudent.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', updatedData.firstName);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .put('/api/students/non-existent-id')
        .send({ firstName: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete student', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const response = await request(app)
        .delete(`/api/students/${createdStudent.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify student is deleted
      const student = await prisma.student.findUnique({
        where: { id: createdStudent.id }
      });

      expect(student).toBeNull();
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .delete('/api/students/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('PUT /api/students/:id/status', () => {
    it('should update student status', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const response = await request(app)
        .put(`/api/students/${createdStudent.id}/status`)
        .send({ status: 'inactive' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const student = await prisma.student.findUnique({
        where: { id: createdStudent.id }
      });

      expect(student?.status).toBe('inactive');
    });

    it('should return 400 for invalid status', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const response = await request(app)
        .put(`/api/students/${createdStudent.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });

  describe('GET /api/students/:id/documents', () => {
    it('should get student documents', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      // Create test documents
      await prisma.studentDocument.createMany({
        data: [
          {
            title: 'Medical Record',
            type: 'medical',
            fileUrl: 'https://example.com/medical.pdf',
            studentId: createdStudent.id,
            schoolId: createdStudent.schoolId
          },
          {
            title: 'School Report',
            type: 'academic',
            fileUrl: 'https://example.com/report.pdf',
            studentId: createdStudent.id,
            schoolId: createdStudent.schoolId
          }
        ]
      });

      const response = await request(app)
        .get(`/api/students/${createdStudent.id}/documents`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('type');
    });
  });

  describe('POST /api/students/:id/documents', () => {
    it('should add document to student', async () => {
      const createdStudent = await prisma.student.create({
        data: validStudent
      });

      const documentData = {
        title: 'New Document',
        type: 'academic',
        fileUrl: 'https://example.com/document.pdf',
        schoolId: createdStudent.schoolId
      };

      const response = await request(app)
        .post(`/api/students/${createdStudent.id}/documents`)
        .send(documentData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', documentData.title);
      expect(response.body).toHaveProperty('type', documentData.type);
    });
  });
});
