import { PrismaClient } from '@prisma/client';
import { SubjectDTO, CreateSubjectDTO, UpdateSubjectDTO } from '../types/subject';
import { TeacherDTO } from '../types/teacher';
import { ClassDTO } from '../types/class';

const prisma = new PrismaClient();

export class SubjectService {
  /**
   * Crée une nouvelle matière
   * @param subjectData Les données de la matière à créer
   * @returns Les données de la matière créée
   */
  async createSubject(subjectData: CreateSubjectDTO): Promise<SubjectDTO> {
    try {
      const subject = await prisma.subject.create({
        data: {
          name: subjectData.name,
          code: subjectData.code,
          description: subjectData.description,
          credits: subjectData.credits,
          schoolId: subjectData.schoolId,
          status: subjectData.status || 'active',
          teacherId: subjectData.teacherId
        },
        include: {
          teacher: true,
          classes: true
        }
      });

      return subject;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère une matière par son ID
   * @param subjectId L'ID de la matière à récupérer
   * @returns Les données de la matière
   */
  async getSubjectById(subjectId: string): Promise<SubjectDTO> {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        teacher: true,
        classes: true
      }
    });

    if (!subject) {
      throw new Error('Subject not found');
    }

    return subject;
  }

  /**
   * Met à jour les informations d'une matière
   * @param subjectId L'ID de la matière à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de la matière
   */
  async updateSubject(
    subjectId: string,
    updateData: UpdateSubjectDTO
  ): Promise<SubjectDTO> {
    const subject = await prisma.subject.update({
      where: { id: subjectId },
      data: updateData,
      include: {
        teacher: true,
        classes: true
      }
    });

    return subject;
  }

  /**
   * Supprime une matière
   * @param subjectId L'ID de la matière à supprimer
   */
  async deleteSubject(subjectId: string): Promise<void> {
    await prisma.subject.delete({
      where: { id: subjectId }
    });
  }

  /**
   * Récupère la liste des matières avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @param schoolId L'ID de l'école (optionnel)
   * @param name Le nom de la matière (optionnel)
   * @returns La liste des matières et le total
   */
  async listSubjects(
    page: number = 1,
    limit: number = 10,
    schoolId?: string,
    name?: string
  ): Promise<{
    subjects: SubjectDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(schoolId && { schoolId }),
      ...(name && { name: { contains: name } })
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        skip,
        take: limit,
        where,
        include: {
          teacher: true,
          classes: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subject.count({ where })
    ]);

    return { subjects, total };
  }

  /**
   * Active ou désactive une matière
   * @param subjectId L'ID de la matière
   * @param status Le nouveau statut (active/inactive)
   */
  async updateStatus(subjectId: string, status: string): Promise<void> {
    await prisma.subject.update({
      where: { id: subjectId },
      data: { status }
    });
  }

  /**
   * Ajoute une classe à une matière
   * @param subjectId L'ID de la matière
   * @param classId L'ID de la classe
   */
  async addClassToSubject(subjectId: string, classId: string): Promise<void> {
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        classes: {
          connect: { id: classId }
        }
      }
    });
  }

  /**
   * Supprime une classe d'une matière
   * @param subjectId L'ID de la matière
   * @param classId L'ID de la classe
   */
  async removeClassFromSubject(subjectId: string, classId: string): Promise<void> {
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        classes: {
          disconnect: { id: classId }
        }
      }
    });
  }
}
