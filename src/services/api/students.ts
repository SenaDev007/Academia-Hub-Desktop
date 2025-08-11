import { apiClient } from './config';

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  classId: string;
  className?: string;
  academicYearId: string;
  photo?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  matricule?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  classId: string;
  academicYearId: string;
  photo?: File;
}

export interface StudentFilters {
  classId?: string;
  academicYearId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const studentsService = {
  async getStudents(filters?: StudentFilters) {
    const response = await apiClient.get('/students', { params: filters });
    return response.data;
  },

  async getStudent(id: string): Promise<Student> {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  async createStudent(data: CreateStudentData): Promise<Student> {
    const formData = new FormData();
    
    // Handle file upload
    Object.keys(data).forEach(key => {
      const value = data[key as keyof CreateStudentData];
      if (value !== undefined) {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await apiClient.post('/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateStudent(id: string, data: Partial<CreateStudentData>): Promise<Student> {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key as keyof CreateStudentData];
      if (value !== undefined) {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await apiClient.put(`/students/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },

  async getStudentsByClass(classId: string, academicYearId?: string) {
    const response = await apiClient.get(`/students/class/${classId}`, {
      params: { academicYearId }
    });
    return response.data;
  },

  async getStudentStats(classId?: string) {
    const response = await apiClient.get('/students/stats', {
      params: { classId }
    });
    return response.data;
  },

  async uploadPhoto(id: string, file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await apiClient.post(`/students/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async generateMatricule(): Promise<{ matricule: string }> {
    const response = await apiClient.get('/students/matricule/generate');
    return response.data;
  },

  async importStudents(file: File, classId: string, academicYearId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    formData.append('academicYearId', academicYearId);
    
    const response = await apiClient.post('/students/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async exportStudents(filters?: StudentFilters): Promise<Blob> {
    const response = await apiClient.get('/students/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};
