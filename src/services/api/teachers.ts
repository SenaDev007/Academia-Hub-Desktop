import { apiClient } from './config';

export interface Teacher {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  qualification?: string;
  specialization?: string[];
  hireDate?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'on_leave';
  photo?: string;
  subjects?: string[];
  classes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherData {
  matricule?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  qualification?: string;
  specialization?: string[];
  hireDate?: string;
  salary?: number;
  photo?: File;
  subjects?: string[];
}

export interface TeacherFilters {
  specialization?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const teachersService = {
  async getTeachers(filters?: TeacherFilters) {
    const response = await apiClient.get('/teachers', { params: filters });
    return response.data;
  },

  async getTeacher(id: string): Promise<Teacher> {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data;
  },

  async createTeacher(data: CreateTeacherData): Promise<Teacher> {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key as keyof CreateTeacherData];
      if (value !== undefined) {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await apiClient.post('/teachers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateTeacher(id: string, data: Partial<CreateTeacherData>): Promise<Teacher> {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key as keyof CreateTeacherData];
      if (value !== undefined) {
        if (key === 'photo' && value instanceof File) {
          formData.append('photo', value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await apiClient.put(`/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async deleteTeacher(id: string): Promise<void> {
    await apiClient.delete(`/teachers/${id}`);
  },

  async getTeacherClasses(teacherId: string) {
    const response = await apiClient.get(`/teachers/${teacherId}/classes`);
    return response.data;
  },

  async getTeacherSubjects(teacherId: string) {
    const response = await apiClient.get(`/teachers/${teacherId}/subjects`);
    return response.data;
  },

  async getTeacherSchedule(teacherId: string, date?: string) {
    const response = await apiClient.get(`/teachers/${teacherId}/schedule`, {
      params: { date }
    });
    return response.data;
  },

  async getTeacherStats(teacherId: string) {
    const response = await apiClient.get(`/teachers/${teacherId}/stats`);
    return response.data;
  },

  async assignToClass(teacherId: string, classId: string): Promise<void> {
    await apiClient.post(`/teachers/${teacherId}/classes`, { classId });
  },

  async assignToSubject(teacherId: string, subjectId: string): Promise<void> {
    await apiClient.post(`/teachers/${teacherId}/subjects`, { subjectId });
  },

  async uploadPhoto(id: string, file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await apiClient.post(`/teachers/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async generateMatricule(): Promise<{ matricule: string }> {
    const response = await apiClient.get('/teachers/matricule/generate');
    return response.data;
  },

  async importTeachers(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/teachers/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async exportTeachers(filters?: TeacherFilters): Promise<Blob> {
    const response = await apiClient.get('/teachers/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};
