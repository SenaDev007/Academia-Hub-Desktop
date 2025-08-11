import { apiClient } from './config';

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  classId: string;
  className?: string;
  teacherId?: string;
  teacherName?: string;
  academicYearId: string;
  totalHours?: number;
  practicalHours?: number;
  theoreticalHours?: number;
  evaluationType: 'continuous' | 'exams' | 'mixed';
  gradingScale: number;
  isCompulsory: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  coefficient: number;
  classId: string;
  teacherId?: string;
  totalHours?: number;
  practicalHours?: number;
  theoreticalHours?: number;
  evaluationType: 'continuous' | 'exams' | 'mixed';
  gradingScale?: number;
  isCompulsory?: boolean;
}

export interface SubjectFilters {
  classId?: string;
  teacherId?: string;
  academicYearId?: string;
  search?: string;
  isCompulsory?: boolean;
  page?: number;
  limit?: number;
}

export const subjectsService = {
  async getSubjects(filters?: SubjectFilters) {
    const response = await apiClient.get('/subjects', { params: filters });
    return response.data;
  },

  async getSubject(id: string): Promise<Subject> {
    const response = await apiClient.get(`/subjects/${id}`);
    return response.data;
  },

  async createSubject(data: CreateSubjectData): Promise<Subject> {
    const response = await apiClient.post('/subjects', data);
    return response.data;
  },

  async updateSubject(id: string, data: Partial<CreateSubjectData>): Promise<Subject> {
    const response = await apiClient.put(`/subjects/${id}`, data);
    return response.data;
  },

  async deleteSubject(id: string): Promise<void> {
    await apiClient.delete(`/subjects/${id}`);
  },

  async getSubjectsByClass(classId: string) {
    const response = await apiClient.get(`/subjects/class/${classId}`);
    return response.data;
  },

  async getSubjectsByTeacher(teacherId: string) {
    const response = await apiClient.get(`/subjects/teacher/${teacherId}`);
    return response.data;
  },

  async assignTeacher(subjectId: string, teacherId: string): Promise<Subject> {
    const response = await apiClient.put(`/subjects/${subjectId}/teacher`, { teacherId });
    return response.data;
  },

  async getSubjectStats(subjectId: string) {
    const response = await apiClient.get(`/subjects/${subjectId}/stats`);
    return response.data;
  },

  async duplicateSubjects(classId: string, targetClassId: string): Promise<Subject[]> {
    const response = await apiClient.post('/subjects/duplicate', {
      sourceClassId: classId,
      targetClassId: targetClassId
    });
    return response.data;
  },

  async importSubjects(file: File, classId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    
    const response = await apiClient.post('/subjects/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async exportSubjects(filters?: SubjectFilters): Promise<Blob> {
    const response = await apiClient.get('/subjects/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};
