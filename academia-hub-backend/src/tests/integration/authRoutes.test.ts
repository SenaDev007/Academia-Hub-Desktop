import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { test } from 'node:test';

describe('Auth Routes Integration Tests', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'register@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body.role).toBe(userData.role);
      expect(response.body.schoolId).toBe(userData.schoolId);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register user first
      await request(app).post('/api/auth/register').send(userData);

      // Try to register again
      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register user first
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return 401 for incorrect password', async () => {
      const userData = {
        email: 'wrongpassword@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register user first
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid password');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /api/profile', () => {
    it('should return user profile with valid token', async () => {
      const userData = {
        email: 'profile@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register and login user
      await request(app).post('/api/auth/register').send(userData);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      const token = loginResponse.body.token;

      // Get profile
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body.role).toBe(userData.role);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
