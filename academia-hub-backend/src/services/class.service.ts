import { PrismaClient } from '@prisma/client';
import { ClassDTO, CreateClassDTO, UpdateClassDTO } from '../types/class';
import { StudentDTO } from '../types/student';
import { TeacherDTO } from '../types/teacher';
import { SubjectDTO } from '../types/subject';

const prisma = new PrismaClient();

export class ClassService {
  /**
   * Crée une nouvelle classe
   * @param classData Les données de la classe à créer
   * @returns Les données de la classe créée
   */
  async createClass(classData: CreateClassDTO): Promise<ClassDTO> {
    try {
      const classObj = await prisma.class.create({
        data: {
          name: classData.name,
          grade: classData.grade,
          level: classData.level,
          section: classData.section,
          academicYear: classData.academicYear,
          schoolId: classData.schoolId,
          status: classData.status || 'active',
          teacherId: classData.teacherId
        },
        include: {
          teacher: true,
          students: true,
          subjects: true
        }
      });

      return classObj;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère une classe par son ID
   * @param classId L'ID de la classe à récupérer
   * @returns Les données de la classe
   */
  async getClassById(classId: string): Promise<ClassDTO> {
    const classObj = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: true,
        students: true,
        subjects: true
      }
    });

    if (!classObj) {
      throw new Error('Class not found');
    }

    return classObj;
  }

  /**
   * Met à jour les informations d'une classe
   * @param classId L'ID de la classe à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de la classe
   */
  async updateClass(
    classId: string,
    updateData: UpdateClassDTO
  ): Promise<ClassDTO> {
    const classObj = await prisma.class.update({
      where: { id: classId },
      data: updateData,
      include: {
        teacher: true,
        students: true,
        subjects: true
      }
    });

    return classObj;
  }

  /**
   * Supprime une classe
   * @param classId L'ID de la classe à supprimer
   */
  async deleteClass(classId: string): Promise<void> {
    await prisma.class.delete({
      where: { id: classId }
    });
  }

  /**
   * Récupère la liste des classes avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @param schoolId L'ID de l'école (optionnel)
   * @param grade Le niveau (optionnel)
   * @param academicYear L'année académique (optionnel)
   * @returns La liste des classes et le total
   */
  async listClasses(
    page: number = 1,
    limit: number = 10,
    schoolId?: string,
    grade?: string,
    academicYear?: string
  ): Promise<{
    classes: ClassDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(schoolId && { schoolId }),
      ...(grade && { grade }),
      ...(academicYear && { academicYear })
    };

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        skip,
        take: limit,
        where,
        include: {
          teacher: true,
          students: true,
          subjects: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.class.count({ where })
    ]);

    return { classes, total };
  }

  /**
   * Active ou désactive une classe
   * @param classId L'ID de la classe
   * @param status Le nouveau statut (active/inactive)
   */
  async updateStatus(classId: string, status: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: { status }
    });
  }

  /**
   * Ajoute un élève à une classe
   * @param classId L'ID de la classe
   * @param studentId L'ID de l'élève
   */
  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentId }
        }
      }
    });
  }

  /**
   * Supprime un élève d'une classe
   * @param classId L'ID de la classe
   * @param studentId L'ID de l'élève
   */
  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId }
        }
      }
    });
  }

  /**
   * Ajoute une matière à une classe
   * @param classId L'ID de la classe
   * @param subjectId L'ID de la matière
   */
  async addSubjectToClass(classId: string, subjectId: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          connect: { id: subjectId }
        }
      }
    });
  }

  /**
   * Supprime une matière d'une classe
   * @param classId L'ID de la classe
   * @param subjectId L'ID de la matière
   */
  async removeSubjectFromClass(classId: string, subjectId: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          disconnect: { id: subjectId }
        }
      }
    });
  }
}
