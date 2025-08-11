import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../types/user';

const prisma = new PrismaClient();

export class UserService {
  private static readonly MIN_PASSWORD_LENGTH = 8;

  /**
   * Crée un nouvel utilisateur
   * @param userData Les données de l'utilisateur à créer
   * @returns Les données de l'utilisateur créé
   */
  async createUser(userData: CreateUserDTO): Promise<UserDTO> {
    try {
      if (!userData.password || userData.password.length < UserService.MIN_PASSWORD_LENGTH) {
        throw new Error('Password must be at least 8 characters');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          schoolId: userData.schoolId,
          status: 'ACTIVE'
        }
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   * @param userId L'ID de l'utilisateur à récupérer
   * @returns Les données de l'utilisateur
   */
  async getUserById(userId: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Récupère un utilisateur par son email
   * @param email L'email de l'utilisateur
   * @returns Les données de l'utilisateur
   */
  async getUserByEmail(email: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Met à jour les informations d'un utilisateur
   * @param userId L'ID de l'utilisateur à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de l'utilisateur
   */
  async updateUser(
    userId: string,
    updateData: UpdateUserDTO
  ): Promise<UserDTO> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return user;
  }

  /**
   * Supprime un utilisateur
   * @param userId L'ID de l'utilisateur à supprimer
   */
  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId }
    });
  }

  /**
   * Récupère la liste des utilisateurs avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @returns La liste des utilisateurs et le total
   */
  async listUsers(
    page: number = 1,
    limit: number = 10,
    schoolId?: string
  ): Promise<{
    users: UserDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = schoolId ? { schoolId } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }

  /**
   * Active ou désactive un utilisateur
   * @param userId L'ID de l'utilisateur
   * @param status Le nouveau statut (ACTIVE/INACTIVE)
   */
  async updateStatus(userId: string, status: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });
  }

  /**
   * Vérifie si un utilisateur a le rôle requis
   * @param userId L'ID de l'utilisateur
   * @param requiredRole Le rôle requis
   * @returns true si l'utilisateur a le rôle, false sinon
   */
  async hasRole(userId: string, requiredRole: Role): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.role === requiredRole;
  }
}
