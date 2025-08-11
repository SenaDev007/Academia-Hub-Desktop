import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../src/services/auth';
import { Logger } from '../../src/utils/logger';

describe('Auth Routes Integration Tests', () => {
  let prisma: PrismaClient;
  let authService: AuthService;

  beforeEach(async () => {
    prisma = new PrismaClient();
    authService = new AuthService();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      // Create test school
      const school = await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      const registerData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        subdomain: 'test-school'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(registerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', registerData.email);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          subdomain: 'test-school'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return tokens', async () => {
      // Create test user
      const school = await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('Password123!', 10),
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          schoolId: school.id,
          status: 'active'
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', user.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      // Create test user and refresh token
      const school = await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('Password123!', 10),
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          schoolId: school.id,
          status: 'active'
        }
      });

      const refreshToken = await prisma.refreshToken.create({
        data: {
          token: 'test-refresh-token',
          userId: user.id
        }
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken.token
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', user.email);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should invalidate refresh token', async () => {
      // Create test refresh token
      const school = await prisma.school.create({
        data: {
          subdomain: 'test-school',
          status: 'active'
        }
      });

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('Password123!', 10),
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          schoolId: school.id,
          status: 'active'
        }
      });

      const refreshToken = await prisma.refreshToken.create({
        data: {
          token: 'test-refresh-token',
          userId: user.id
        }
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: refreshToken.token
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully logged out');

      // Verify refresh token is deleted
      const token = await prisma.refreshToken.findUnique({
        where: { token: refreshToken.token }
      });

      expect(token).toBeNull();
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });
});
