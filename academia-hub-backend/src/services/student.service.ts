import { PrismaClient } from '@prisma/client';
import { StudentDTO, CreateStudentDTO, UpdateStudentDTO } from '../types/student';
import { ClassDTO } from '../types/class';
import { UserDTO } from '../types/user';
import { ParentDTO } from '../types/parent';

const prisma = new PrismaClient();

export class StudentService {
  /**
   * Crée un nouvel élève
   * @param studentData Les données de l'élève à créer
   * @returns Les données de l'élève créé
   */
  async createStudent(studentData: CreateStudentDTO): Promise<StudentDTO> {
    try {
      const student = await prisma.student.create({
        data: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          phone: studentData.phone,
          birthDate: studentData.birthDate,
          gender: studentData.gender,
          address: studentData.address,
          city: studentData.city,
          postalCode: studentData.postalCode,
          country: studentData.country,
          schoolId: studentData.schoolId,
          classId: studentData.classId,
          enrollmentDate: studentData.enrollmentDate || new Date(),
          status: studentData.status || 'active',
          studentId: studentData.studentId,
          medicalInfo: studentData.medicalInfo,
          allergies: studentData.allergies,
          emergencyContactName: studentData.emergencyContactName,
          emergencyContactPhone: studentData.emergencyContactPhone,
          emergencyContactRelationship: studentData.emergencyContactRelationship,
          emergencyContactAddress: studentData.emergencyContactAddress,
          userId: studentData.userId,
          parentId: studentData.parentId
        },
        include: {
          user: true,
          class: true,
          parent: true
        }
      });

      return student;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Student ID already exists');
      }
      throw error;
    }
  }

  /**
   * Récupère un élève par son ID
   * @param studentId L'ID de l'élève à récupérer
   * @returns Les données de l'élève
   */
  async getStudentById(studentId: string): Promise<StudentDTO> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
        parent: true
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  /**
   * Récupère un élève par son studentId
   * @param studentId Le studentId de l'élève
   * @returns Les données de l'élève
   */
  async getStudentByStudentId(studentId: string): Promise<StudentDTO> {
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        user: true,
        class: true,
        parent: true
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  /**
   * Met à jour les informations d'un élève
   * @param studentId L'ID de l'élève à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de l'élève
   */
  async updateStudent(
    studentId: string,
    updateData: UpdateStudentDTO
  ): Promise<StudentDTO> {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
      include: {
        user: true,
        class: true,
        parent: true
      }
    });

    return student;
  }

  /**
   * Supprime un élève
   * @param studentId L'ID de l'élève à supprimer
   */
  async deleteStudent(studentId: string): Promise<void> {
    await prisma.student.delete({
      where: { id: studentId }
    });
  }

  /**
   * Récupère la liste des élèves avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @param schoolId L'ID de l'école (optionnel)
   * @param classId L'ID de la classe (optionnel)
   * @returns La liste des élèves et le total
   */
  async listStudents(
    page: number = 1,
    limit: number = 10,
    schoolId?: string,
    classId?: string
  ): Promise<{
    students: StudentDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(schoolId && { schoolId }),
      ...(classId && { classId })
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: true,
          class: true,
          parent: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where })
    ]);

    return { students, total };
  }

  /**
   * Active ou désactive un élève
   * @param studentId L'ID de l'élève
   * @param status Le nouveau statut (active/inactive)
   */
  async updateStatus(studentId: string, status: string): Promise<void> {
    await prisma.student.update({
      where: { id: studentId },
      data: { status }
    });
  }

  /**
   * Récupère les documents d'un élève
   * @param studentId L'ID de l'élève
   * @returns La liste des documents
   */
  async getStudentDocuments(studentId: string): Promise<any[]> {
    const documents = await prisma.studentDocument.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });

    return documents;
  }

  /**
   * Ajoute un document à un élève
   * @param studentId L'ID de l'élève
   * @param documentData Les données du document
   */
  async addStudentDocument(studentId: string, documentData: any): Promise<any> {
    const document = await prisma.studentDocument.create({
      data: {
        ...documentData,
        studentId,
        schoolId: documentData.schoolId
      }
    });

    return document;
  }
}
