import { apiClient } from './config';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  teacherId: string;
  teacherName?: string;
  termId: string;
  type: 'test' | 'quiz' | 'exam' | 'assignment';
  date: string;
  startTime: string;
  endTime: string;
  maxScore: number;
  coefficient: number;
  room?: string;
  instructions?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamData {
  title: string;
  description?: string;
  subjectId: string;
  classId: string;
  termId: string;
  type: 'test' | 'quiz' | 'exam' | 'assignment';
  date: string;
  startTime: string;
  endTime: string;
  maxScore: number;
  coefficient: number;
  room?: string;
  instructions?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  score: number;
  maxScore: number;
  grade?: string;
  remarks?: string;
  status: 'present' | 'absent' | 'excused';
  submittedAt?: string;
}

export const examsService = {
  async getExams(params?: {
    classId?: string;
    subjectId?: string;
    teacherId?: string;
    termId?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/exams', { params });
    return response.data;
  },

  async getExam(id: string): Promise<Exam> {
    const response = await apiClient.get(`/exams/${id}`);
    return response.data;
  },

  async createExam(data: CreateExamData): Promise<Exam> {
    const response = await apiClient.post('/exams', data);
    return response.data;
  },

  async updateExam(id: string, data: Partial<CreateExamData>): Promise<Exam> {
    const response = await apiClient.put(`/exams/${id}`, data);
    return response.data;
  },

  async deleteExam(id: string): Promise<void> {
    await apiClient.delete(`/exams/${id}`);
  },

  async getExamResults(examId: string) {
    const response = await apiClient.get(`/exams/${examId}/results`);
    return response.data;
  },

  async submitExamResult(examId: string, studentId: string, score: number, remarks?: string): Promise<ExamResult> {
    const response = await apiClient.post(`/exams/${examId}/results`, {
      studentId,
      score,
      remarks
    });
    return response.data;
  },

  async bulkSubmitResults(examId: string, results: Array<{
    studentId: string;
    score: number;
    remarks?: string;
    status?: string;
  }>): Promise<ExamResult[]> {
    const response = await apiClient.post(`/exams/${examId}/results/bulk`, { results });
    return response.data;
  },

  async getUpcomingExams(limit: number = 10) {
    const response = await apiClient.get('/exams/upcoming', { params: { limit } });
    return response.data;
  },

  async getExamSchedule(classId: string, date?: string) {
    const response = await apiClient.get(`/exams/schedule/${classId}`, {
      params: { date }
    });
    return response.data;
  }
};
