import { apiClient } from './config';

export interface Class {
  id: string;
  name: string;
  code: string;
  level: string;
  section?: string;
  capacity: number;
  currentStudents: number;
  academicYearId: string;
  teacherId?: string;
  teacherName?: string;
  roomId?: string;
  roomName?: string;
  schedule?: any;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassData {
  name: string;
  code: string;
  level: string;
  section?: string;
  capacity?: number;
  academicYearId: string;
  teacherId?: string;
  roomId?: string;
  description?: string;
}

export interface ClassFilters {
  academicYearId?: string;
  level?: string;
  teacherId?: string;
  roomId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const classesService = {
  async getClasses(filters?: ClassFilters) {
    const response = await apiClient.get('/classes', { params: filters });
    return response.data;
  },

  async getClass(id: string): Promise<Class> {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  },

  async createClass(data: CreateClassData): Promise<Class> {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  async updateClass(id: string, data: Partial<CreateClassData>): Promise<Class> {
    const response = await apiClient.put(`/classes/${id}`, data);
    return response.data;
  },

  async deleteClass(id: string): Promise<void> {
    await apiClient.delete(`/classes/${id}`);
  },

  async getClassStudents(classId: string) {
    const response = await apiClient.get(`/classes/${classId}/students`);
    return response.data;
  },

  async getClassSubjects(classId: string) {
    const response = await apiClient.get(`/classes/${classId}/subjects`);
    return response.data;
  },

  async getClassSchedule(classId: string) {
    const response = await apiClient.get(`/classes/${classId}/schedule`);
    return response.data;
  },

  async getClassStats(classId: string) {
    const response = await apiClient.get(`/classes/${classId}/stats`);
    return response.data;
  },

  async assignTeacher(classId: string, teacherId: string): Promise<Class> {
    const response = await apiClient.put(`/classes/${classId}/teacher`, { teacherId });
    return response.data;
  },

  async assignRoom(classId: string, roomId: string): Promise<Class> {
    const response = await apiClient.put(`/classes/${classId}/room`, { roomId });
    return response.data;
  },

  async getAvailableRooms(classId: string, date?: string, timeSlot?: string) {
    const response = await apiClient.get(`/classes/${classId}/available-rooms`, {
      params: { date, timeSlot }
    });
    return response.data;
  },

  async duplicateClass(id: string, newAcademicYearId: string): Promise<Class> {
    const response = await apiClient.post(`/classes/${id}/duplicate`, {
      academicYearId: newAcademicYearId
    });
    return response.data;
  },

  async getClassLevels() {
    const response = await apiClient.get('/classes/levels');
    return response.data;
  }
};
