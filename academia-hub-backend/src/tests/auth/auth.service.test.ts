import { AuthService } from '../../services/auth';
import { PrismaClient } from '@prisma/client';
import { Logger } from '../../utils/logger';
import { RegisterUserDTO } from '../../types/auth';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    authService = new AuthService();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('register', () => {
    const validUser: RegisterUserDTO = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'student',
      subdomain: 'test-school'
    };

    it('should register a new user successfully', async () => {
      // Mock school existence
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'test-school-id',
        subdomain: 'test-school',
        status: 'active'
      });

      // Mock user creation
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 'test-user-id',
        email: validUser.email,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        role: validUser.role,
        schoolId: 'test-school-id',
        status: 'active'
      });

      // Mock token creation
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValue({
        id: 'test-refresh-token-id',
        token: 'refresh-token',
        userId: 'test-user-id'
      });

      const result = await authService.register(validUser);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toEqual({
        id: 'test-user-id',
        email: validUser.email,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        role: validUser.role,
        schoolId: 'test-school-id'
      });
    });

    it('should throw error for invalid email format', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      await expect(authService.register(invalidUser))
        .rejects
        .toThrow('Invalid email format');
    });

    it('should throw error for weak password', async () => {
      const weakPasswordUser = { ...validUser, password: 'weak' };
      await expect(authService.register(weakPasswordUser))
        .rejects
        .toThrow('Password must be at least 8 characters');
    });

    it('should throw error for non-existent school', async () => {
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue(null);
      await expect(authService.register(validUser))
        .rejects
        .toThrow('School not found');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      // Mock user existence
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        schoolId: 'test-school-id',
        status: 'active'
      });

      // Mock bcrypt compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      // Mock school status
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'test-school-id',
        status: 'active'
      });

      // Mock token creation
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValue({
        id: 'test-refresh-token-id',
        token: 'refresh-token',
        userId: 'test-user-id'
      });

      const result = await authService.login('test@example.com', 'correctpassword');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('id', 'test-user-id');
    });

    it('should throw error for invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(authService.login('nonexistent@example.com', 'password'))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error for inactive account', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'test-user-id',
        status: 'inactive'
      });
      await expect(authService.login('test@example.com', 'password'))
        .rejects
        .toThrow('Account is not active');
    });

    it('should throw error for inactive school', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'test-user-id',
        schoolId: 'test-school-id'
      });
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: 'test-school-id',
        status: 'inactive'
      });
      await expect(authService.login('test@example.com', 'password'))
        .rejects
        .toThrow('School subscription is not active');
    });
  });

  describe('validateToken', () => {
    it('should validate access token and return new tokens', async () => {
      const token = 'valid-access-token';
      const decoded = { userId: 'test-user-id', schoolId: 'test-school-id' };

      // Mock jwt verify
      jest.spyOn(jwt, 'verify').mockReturnValue(decoded);

      // Mock user existence
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: decoded.userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        schoolId: decoded.schoolId
      });

      // Mock school status
      jest.spyOn(prisma.school, 'findUnique').mockResolvedValue({
        id: decoded.schoolId,
        status: 'active'
      });

      // Mock refresh token creation
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValue({
        id: 'test-refresh-token-id',
        token: 'new-refresh-token',
        userId: decoded.userId
      });

      const result = await authService.validateToken(token);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('id', decoded.userId);
    });

    it('should validate refresh token and return new tokens', async () => {
      const token = 'valid-refresh-token';
      const decoded = { userId: 'test-user-id', schoolId: 'test-school-id' };

      // Mock jwt verify
      jest.spyOn(jwt, 'verify').mockReturnValue(decoded);

      // Mock refresh token existence
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValue({
        id: 'test-refresh-token-id',
        token,
        userId: decoded.userId,
        user: {
          id: decoded.userId,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          schoolId: decoded.schoolId
        }
      });

      const result = await authService.validateToken(token, true);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken', token);
      expect(result.user).toHaveProperty('id', decoded.userId);
    });

    it('should throw error for invalid token', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('invalid token');
      });
      await expect(authService.validateToken('invalid-token'))
        .rejects
        .toThrow('No token provided');
    });
  });

  describe('logout', () => {
    it('should successfully invalidate refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      
      // Mock refresh token existence
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValue({
        id: 'test-refresh-token-id',
        token: refreshToken,
        userId: 'test-user-id'
      });

      // Mock refresh token deletion
      jest.spyOn(prisma.refreshToken, 'delete').mockResolvedValue({
        id: 'test-refresh-token-id',
        token: refreshToken,
        userId: 'test-user-id'
      });

      await expect(authService.logout(refreshToken))
        .resolves
        .not
        .toThrow();
    });

    it('should throw error for invalid refresh token', async () => {
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValue(null);
      await expect(authService.logout('invalid-token'))
        .rejects
        .toThrow('Invalid refresh token');
    });
  });
});
