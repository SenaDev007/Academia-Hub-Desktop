import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { UserDTO, CreateUserDTO } from '../../src/types/user';

describe('User Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  const validUser: CreateUserDTO = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT',
    password: 'Password123!',
    schoolId: 'test-school-id'
  };

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(validUser)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', validUser.email);
      expect(response.body).toHaveProperty('firstName', validUser.firstName);
      expect(response.body).toHaveProperty('lastName', validUser.lastName);
      expect(response.body).toHaveProperty('role', validUser.role);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });

    it('should return 409 for duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/users')
        .send(validUser)
        .set('Authorization', 'Bearer valid-token');

      // Try to create another user with same email
      const response = await request(app)
        .post('/api/users')
        .send(validUser)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should list users with pagination', async () => {
      // Create test users
      await prisma.user.createMany({
        data: [
          { ...validUser, firstName: 'User 1' },
          { ...validUser, firstName: 'User 2' },
          { ...validUser, firstName: 'User 3' }
        ]
      });

      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 2 })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(2);
      expect(response.body).toHaveProperty('total');
    });

    it('should filter users by schoolId', async () => {
      // Create users in different schools
      await prisma.user.createMany({
        data: [
          { ...validUser, schoolId: 'school-1' },
          { ...validUser, schoolId: 'school-2' }
        ]
      });

      const response = await request(app)
        .get('/api/users')
        .query({ schoolId: 'school-1' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0]).toHaveProperty('schoolId', 'school-1');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const response = await request(app)
        .get(`/api/users/${createdUser.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdUser.id);
      expect(response.body).toHaveProperty('email', validUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const updatedData = {
        firstName: 'Updated Name',
        status: 'INACTIVE'
      };

      const response = await request(app)
        .put(`/api/users/${createdUser.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', updatedData.firstName);
      expect(response.body).toHaveProperty('status', updatedData.status);
    });

    it('should update user password', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const updatedData = {
        password: 'NewPassword123!'
      };

      const response = await request(app)
        .put(`/api/users/${createdUser.id}`)
        .send(updatedData)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send({ firstName: 'Test' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const response = await request(app)
        .delete(`/api/users/${createdUser.id}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify user is deleted
      const user = await prisma.user.findUnique({
        where: { id: createdUser.id }
      });

      expect(user).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id/status', () => {
    it('should update user status', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const response = await request(app)
        .put(`/api/users/${createdUser.id}/status`)
        .send({ status: 'INACTIVE' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);

      // Verify status is updated
      const user = await prisma.user.findUnique({
        where: { id: createdUser.id }
      });

      expect(user?.status).toBe('INACTIVE');
    });

    it('should return 400 for invalid status', async () => {
      const createdUser = await prisma.user.create({
        data: validUser
      });

      const response = await request(app)
        .put(`/api/users/${createdUser.id}/status`)
        .send({ status: 'INVALID' })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status');
    });
  });
});
