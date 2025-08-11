import { AuthService } from '../../services/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { test } from 'node:test';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    authService = new AuthService();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      const user = await authService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.schoolId
      );

      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe(userData.role);
      expect(user.schoolId).toBe(userData.schoolId);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register user first
      await authService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.schoolId
      );

      // Try to register again
      await expect(
        authService.register(
          userData.email,
          userData.password,
          userData.firstName,
          userData.lastName,
          userData.role,
          userData.schoolId
        )
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
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
      await authService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.schoolId
      );

      const loginResult = await authService.login(userData.email, userData.password);
      expect(loginResult.token).toBeDefined();
      expect(loginResult.user.email).toBe(userData.email);
    });

    it('should throw error with incorrect password', async () => {
      const userData = {
        email: 'wrongpassword@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'test-school-id'
      };

      // Register user first
      await authService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role,
        userData.schoolId
      );

      await expect(
        authService.login(userData.email, 'wrongpassword')
      ).rejects.toThrow('Invalid password');
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('User not found');
    });
  });
});
