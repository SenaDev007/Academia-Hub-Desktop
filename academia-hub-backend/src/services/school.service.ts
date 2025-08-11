import { PrismaClient } from '@prisma/client';
import { SchoolDTO, UpdateSchoolDTO } from '../types/school';

const prisma = new PrismaClient();

export class SchoolService {
  /**
   * Crée une nouvelle école
   * @param schoolData Les données de l'école à créer
   * @returns Les données de l'école créée
   */
  async createSchool(schoolData: SchoolDTO): Promise<SchoolDTO> {
    try {
      const school = await prisma.school.create({
        data: {
          name: schoolData.name,
          address: schoolData.address,
          email: schoolData.email,
          phone: schoolData.phone,
          logo: schoolData.logo,
          website: schoolData.website,
          description: schoolData.description,
          academicYear: schoolData.academicYear,
          status: 'ACTIVE'
        }
      });

      return school;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Récupère une école par son ID
   * @param schoolId L'ID de l'école à récupérer
   * @returns Les données de l'école
   */
  async getSchoolById(schoolId: string): Promise<SchoolDTO> {
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!school) {
      throw new Error('School not found');
    }

    return school;
  }

  /**
   * Récupère une école par son sous-domaine
   * @param subdomain Le sous-domaine de l'école
   * @returns Les données de l'école
   */
  async getSchoolBySubdomain(subdomain: string): Promise<SchoolDTO> {
    const school = await prisma.school.findUnique({
      where: { subdomain }
    });

    if (!school) {
      throw new Error('School not found');
    }

    return school;
  }

  /**
   * Met à jour les informations d'une école
   * @param schoolId L'ID de l'école à mettre à jour
   * @param updateData Les données à mettre à jour
   * @returns Les données mises à jour de l'école
   */
  async updateSchool(
    schoolId: string,
    updateData: UpdateSchoolDTO
  ): Promise<SchoolDTO> {
    const school = await prisma.school.update({
      where: { id: schoolId },
      data: updateData
    });

    return school;
  }

  /**
   * Supprime une école
   * @param schoolId L'ID de l'école à supprimer
   */
  async deleteSchool(schoolId: string): Promise<void> {
    await prisma.school.delete({
      where: { id: schoolId }
    });
  }

  /**
   * Récupère la liste des écoles avec pagination
   * @param page Le numéro de page
   * @param limit Le nombre d'items par page
   * @returns La liste des écoles et le total
   */
  async listSchools(page: number = 1, limit: number = 10): Promise<{
    schools: SchoolDTO[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.school.count()
    ]);

    return { schools, total };
  }

  /**
   * Active ou désactive une école
   * @param schoolId L'ID de l'école
   * @param status Le nouveau statut (ACTIVE/INACTIVE)
   */
  async updateSchoolStatus(schoolId: string, status: string): Promise<void> {
    await prisma.school.update({
      where: { id: schoolId },
      data: { status }
    });
  }
}
