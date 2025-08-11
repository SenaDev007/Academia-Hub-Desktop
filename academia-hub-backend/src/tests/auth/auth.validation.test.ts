import { AuthService } from '../../src/services/auth';
import { PrismaClient } from '@prisma/client';
import { Logger } from '../../src/utils/logger';
import { RegisterUserDTO } from '../../src/types/auth';

describe('Auth Validation Tests', () => {
  let authService: AuthService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    authService = new AuthService();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('Role Validation', () => {
    const validRoles = ['student', 'teacher', 'admin', 'principal'];

    it.each(validRoles)('should accept valid role: %s', async (role) => {
      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role,
        subdomain: 'test-school'
      };

      // Mock school existence
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'test-school-id',
        subdomain: 'test-school',
        status: 'active'
      });

      // Mock user creation
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 'test-user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role,
        schoolId: 'test-school-id',
        status: 'active'
      });

      await expect(authService.register(userData))
        .resolves
        .not
        .toThrow();
    });

    it('should reject invalid role', async () => {
      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'invalid-role',
        subdomain: 'test-school'
      };

      await expect(authService.register(userData))
        .rejects
        .toThrow('Invalid role');
    });
  });

  describe('Subdomain Uniqueness', () => {
    it('should reject duplicate subdomain', async () => {
      // Create first school
      await prisma.school.create({
        data: {
          subdomain: 'existing-school',
          status: 'active'
        }
      });

      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        subdomain: 'existing-school'
      };

      await expect(authService.register(userData))
        .rejects
        .toThrow('School already exists');
    });

    it('should allow different subdomain', async () => {
      // Create first school
      await prisma.school.create({
        data: {
          subdomain: 'existing-school',
          status: 'active'
        }
      });

      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        subdomain: 'new-school'
      };

      // Mock school existence
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'new-school-id',
        subdomain: 'new-school',
        status: 'active'
      });

      // Mock user creation
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 'test-user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        schoolId: 'new-school-id',
        status: 'active'
      });

      await expect(authService.register(userData))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('Password Strength', () => {
    const weakPasswords = [
      'password', // Too common
      '123456', // Too short, only numbers
      'abcdef', // Only lowercase letters
      'A1', // Too short
      'Password!', // Missing number
      'password123', // Missing uppercase
      'PASSWORD123!', // Missing lowercase
      'P@ssw0rd', // Too short
    ];

    it.each(weakPasswords)('should reject weak password: %s', async (password) => {
      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password,
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        subdomain: 'test-school'
      };

      await expect(authService.register(userData))
        .rejects
        .toThrow('Password must be at least 8 characters');
    });

    it('should accept strong password', async () => {
      const userData: RegisterUserDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        subdomain: 'test-school'
      };

      // Mock school existence
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'test-school-id',
        subdomain: 'test-school',
        status: 'active'
      });

      // Mock user creation
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 'test-user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        schoolId: 'test-school-id',
        status: 'active'
      });

      await expect(authService.register(userData))
        .resolves
        .not
        .toThrow();
    });
  });
});
