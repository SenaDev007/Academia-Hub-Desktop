import { apiClient } from './config';

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  academicYearId: string;
  termId: string;
  isActive: boolean;
}

export const schedulesService = {
  async getSchedules(params?: { classId?: string; teacherId?: string; dayOfWeek?: number }) {
    const response = await apiClient.get('/schedules', { params });
    return response.data;
  },

  async createSchedule(data: Omit<Schedule, 'id'>): Promise<Schedule> {
    const response = await apiClient.post('/schedules', data);
    return response.data;
  },

  async updateSchedule(id: string, data: Partial<Omit<Schedule, 'id'>>): Promise<Schedule> {
    const response = await apiClient.put(`/schedules/${id}`, data);
    return response.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await apiClient.delete(`/schedules/${id}`);
  }
};
