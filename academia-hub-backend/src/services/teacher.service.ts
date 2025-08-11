import { PrismaClient } from '@prisma/client';
import { TeacherDTO, CreateTeacherDTO, UpdateTeacherDTO } from '../types/teacher';
import { UserDTO } from '../types/user';
import { ClassDTO } from '../types/class';
import { SubjectDTO } from '../types/subject';

const prisma = new PrismaClient();

export class TeacherService {
  /**
   * Crée un nouvel enseignant
   * @param teacherData Les données de l'enseignant à créer
   * @returns Les données de l'enseignant créé
   */
  async createTeacher(teacherData: CreateTeacherDTO): Promise<TeacherDTO> {
    try {
      const teacher = await prisma.teacher.create({
        data: {
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          phone: teacherData.phone,
          address: teacherData.address,
          city: teacherData.city,
          postalCode: teacherData.postalCode,
          country: teacherData.country,
          schoolId: teacherData.schoolId,
          department: teacherData.department,
          specialization: teacherData.specialization,
          status: teacherData.status || 'active',
          userId: teacherData.userId
        },
        include: {
          user: true,
          classes: true,
          subjects: true
        }
      });

      return teacher;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un enseignant par son ID
   * @param teacherId L'ID de l'enseignant à récupérer
   * @returns Les données de l'enseignant
   */
  async getTeacherById(teacherId: string): Promise<TeacherDTO> {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        classes: true,
        subjects: true
      }
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  }

  /**
   * Met à jour les informations d'un enseignant
   * @param teacherId L'ID de l'enseignant à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de l'enseignant
   */
  async updateTeacher(
    teacherId: string,
    updateData: UpdateTeacherDTO
  ): Promise<TeacherDTO> {
    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
      include: {
        user: true,
        classes: true,
        subjects: true
      }
    });

    return teacher;
  }

  /**
   * Supprime un enseignant
   * @param teacherId L'ID de l'enseignant à supprimer
   */
  async deleteTeacher(teacherId: string): Promise<void> {
    await prisma.teacher.delete({
      where: { id: teacherId }
    });
  }

  /**
   * Récupère la liste des enseignants avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @param schoolId L'ID de l'école (optionnel)
   * @param department Le département (optionnel)
   * @returns La liste des enseignants et le total
   */
  async listTeachers(
    page: number = 1,
    limit: number = 10,
    schoolId?: string,
    department?: string
  ): Promise<{
    teachers: TeacherDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(schoolId && { schoolId }),
      ...(department && { department })
    };

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: true,
          classes: true,
          subjects: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.teacher.count({ where })
    ]);

    return { teachers, total };
  }

  /**
   * Active ou désactive un enseignant
   * @param teacherId L'ID de l'enseignant
   * @param status Le nouveau statut (active/inactive)
   */
  async updateStatus(teacherId: string, status: string): Promise<void> {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { status }
    });
  }

  /**
   * Ajoute une classe à un enseignant
   * @param teacherId L'ID de l'enseignant
   * @param classId L'ID de la classe
   */
  async addClassToTeacher(teacherId: string, classId: string): Promise<void> {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        classes: {
          connect: { id: classId }
        }
      }
    });
  }

  /**
   * Supprime une classe d'un enseignant
   * @param teacherId L'ID de l'enseignant
   * @param classId L'ID de la classe
   */
  async removeClassFromTeacher(teacherId: string, classId: string): Promise<void> {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        classes: {
          disconnect: { id: classId }
        }
      }
    });
  }

  /**
   * Ajoute une matière à un enseignant
   * @param teacherId L'ID de l'enseignant
   * @param subjectId L'ID de la matière
   */
  async addSubjectToTeacher(teacherId: string, subjectId: string): Promise<void> {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subjects: {
          connect: { id: subjectId }
        }
      }
    });
  }

  /**
   * Supprime une matière d'un enseignant
   * @param teacherId L'ID de l'enseignant
   * @param subjectId L'ID de la matière
   */
  async removeSubjectFromTeacher(teacherId: string, subjectId: string): Promise<void> {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subjects: {
          disconnect: { id: subjectId }
        }
      }
    });
  }
}
