import { apiClient } from './config';

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'completed' | 'upcoming';
  terms: Term[];
  createdAt: string;
  updatedAt: string;
}

export interface Term {
  id: string;
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  sequence: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface CreateAcademicYearData {
  name: string;
  startDate: string;
  endDate: string;
  terms: Array<{
    name: string;
    startDate: string;
    endDate: string;
    sequence: number;
  }>;
}

export const academicYearsService = {
  async getAcademicYears() {
    const response = await apiClient.get('/academic-years');
    return response.data;
  },

  async getAcademicYear(id: string): Promise<AcademicYear> {
    const response = await apiClient.get(`/academic-years/${id}`);
    return response.data;
  },

  async createAcademicYear(data: CreateAcademicYearData): Promise<AcademicYear> {
    const response = await apiClient.post('/academic-years', data);
    return response.data;
  },

  async updateAcademicYear(id: string, data: Partial<CreateAcademicYearData>): Promise<AcademicYear> {
    const response = await apiClient.put(`/academic-years/${id}`, data);
    return response.data;
  },

  async deleteAcademicYear(id: string): Promise<void> {
    await apiClient.delete(`/academic-years/${id}`);
  },

  async setCurrentAcademicYear(id: string): Promise<AcademicYear> {
    const response = await apiClient.put(`/academic-years/${id}/set-current`);
    return response.data;
  },

  async getCurrentAcademicYear(): Promise<AcademicYear> {
    const response = await apiClient.get('/academic-years/current');
    return response.data;
  },

  async getTerms(academicYearId: string) {
    const response = await apiClient.get(`/academic-years/${academicYearId}/terms`);
    return response.data;
  },

  async setCurrentTerm(termId: string): Promise<Term> {
    const response = await apiClient.put(`/terms/${termId}/set-current`);
    return response.data;
  }
};
