import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TokenResponse, RegisterUserDTO } from '../types/auth';
import Logger from '../utils/logger';

const logger = new Logger('AuthService');
const prisma = new PrismaClient();

export class AuthService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly ACCESS_TOKEN_EXPIRES_IN = '15m';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';

  private userId: string;
  private schoolId: string;

  constructor() {
    this.userId = '';
    this.schoolId = '';
  }

  private static isValidEmail(email: string): boolean {
    return AuthService.EMAIL_REGEX.test(email);
  }

  /**
   * Enregistre un nouvel utilisateur
   * @param userData Les données de l'utilisateur à enregistrer
   * @returns Un objet contenant les tokens et les informations de l'utilisateur
   */
  async register(userData: RegisterUserDTO): Promise<TokenResponse> {
    try {
      logger.info('Starting user registration process');
      
      // Validation des données d'entrée
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.role) {
        throw new Error('Missing required fields');
      }

      if (!AuthService.isValidEmail(userData.email)) {
        throw new Error('Invalid email format');
      }

      if (userData.password.length < AuthService.MIN_PASSWORD_LENGTH) {
        throw new Error(`Password must be at least ${AuthService.MIN_PASSWORD_LENGTH} characters`);
      }

      const school = await prisma.school.findUnique({
        where: { subdomain: userData.subdomain }
      });

      if (!school) {
        throw new Error('School not found');
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10),
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          schoolId: school.id,
          status: 'active'
        },
        include: { school: true }
      });

      const token = jwt.sign(
        { userId: user.id, schoolId: school.id },
        AuthService.JWT_SECRET,
        { expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, schoolId: school.id },
        AuthService.REFRESH_TOKEN_SECRET,
        { expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN }
      );

      // Sauvegarder le nouveau token de rafraîchissement
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          schoolId: school.id
        }
      });

      return {
        accessToken: token,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: school.id
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  }

  /**
   * Authentifie un utilisateur existant
   * @param email L'email de l'utilisateur
   * @param password Le mot de passe de l'utilisateur
   * @returns Un objet contenant les tokens et les informations de l'utilisateur
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      logger.info('Starting login process for email:', email);
      
      // Validation des données d'entrée
      if (!email || !password) {
        throw new Error('Missing required fields');
      }

      if (!AuthService.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: { school: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.school) {
        throw new Error('School not found');
      }

      if (user.school.status !== 'active') {
        throw new Error('School subscription is not active');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const accessToken = jwt.sign(
        { userId: user.id, schoolId: user.schoolId },
        AuthService.JWT_SECRET,
        { expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, schoolId: user.schoolId },
        AuthService.REFRESH_TOKEN_SECRET,
        { expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN }
      );

      // Sauvegarder le token de rafraîchissement
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          schoolId: user.schoolId
        }
      });

      logger.info('User logged in successfully');

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: user.schoolId
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }

  /**
   * Valide un token JWT et renvoie un nouveau token si nécessaire
   * @param token Le token à valider
   * @param isRefreshToken Indique si c'est un token de rafraîchissement
   * @returns Un objet contenant les tokens et les informations de l'utilisateur
   */
  async validateToken(token: string, isRefreshToken: boolean = false): Promise<TokenResponse> {
    try {
      logger.info('Starting token validation process');
      
      if (!token) {
        throw new Error('No token provided');
      }

      const secret = isRefreshToken 
        ? AuthService.REFRESH_TOKEN_SECRET 
        : AuthService.JWT_SECRET;

      const decoded = jwt.verify(token, secret) as {
        userId: string;
        schoolId: string;
      };

      if (isRefreshToken) {
        const refreshToken = await prisma.refreshToken.findUnique({
          where: { token },
          include: { user: true }
        });

        if (!refreshToken || !refreshToken.user) {
          throw new Error('Invalid refresh token');
        }

        const newAccessToken = jwt.sign(
          { userId: refreshToken.user.id, schoolId: refreshToken.user.schoolId },
          AuthService.JWT_SECRET,
          { expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN }
        );

        return {
          accessToken: newAccessToken,
          refreshToken: refreshToken.token,
          user: {
            id: refreshToken.user.id,
            email: refreshToken.user.email,
            firstName: refreshToken.user.firstName,
            lastName: refreshToken.user.lastName,
            role: refreshToken.user.role,
            schoolId: refreshToken.user.schoolId
          }
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { school: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.school) {
        throw new Error('School not found');
      }

      if (user.school.status !== 'active') {
        throw new Error('School subscription is not active');
      }

      const newRefreshToken = jwt.sign(
        { userId: user.id, schoolId: user.schoolId },
        AuthService.REFRESH_TOKEN_SECRET,
        { expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN }
      );

      // Sauvegarder le nouveau token de rafraîchissement
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id
        }
      });

      return {
        accessToken: jwt.sign(
          { userId: user.id, schoolId: user.schoolId },
          AuthService.JWT_SECRET,
          { expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN }
        ),
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          schoolId: user.schoolId
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Invalid token');
    }
  }
}
