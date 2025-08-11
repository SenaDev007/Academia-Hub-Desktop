import { apiClient } from './config';

export interface Grade {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName?: string;
  classId: string;
  className?: string;
  academicYearId: string;
  termId: string;
  evaluationType: 'test' | 'exam' | 'quiz' | 'homework' | 'participation';
  score: number;
  maxScore: number;
  coefficient: number;
  weightedScore: number;
  comment?: string;
  date: string;
  teacherId: string;
  teacherName?: string;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGradeData {
  studentId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
  termId: string;
  evaluationType: 'test' | 'exam' | 'quiz' | 'homework' | 'participation';
  score: number;
  maxScore: number;
  coefficient?: number;
  comment?: string;
  date: string;
}

export interface GradeFilters {
  studentId?: string;
  subjectId?: string;
  classId?: string;
  academicYearId?: string;
  termId?: string;
  teacherId?: string;
  evaluationType?: string;
  dateFrom?: string;
  dateTo?: string;
  isValidated?: boolean;
  page?: number;
  limit?: number;
}

export interface StudentAverage {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  average: number;
  rank: number;
  totalGrades: number;
  coefficient: number;
}

export interface ClassAverage {
  subjectId: string;
  subjectName: string;
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  totalStudents: number;
}

export const gradesService = {
  async getGrades(filters?: GradeFilters) {
    const response = await apiClient.get('/grades', { params: filters });
    return response.data;
  },

  async getGrade(id: string): Promise<Grade> {
    const response = await apiClient.get(`/grades/${id}`);
    return response.data;
  },

  async createGrade(data: CreateGradeData): Promise<Grade> {
    const response = await apiClient.post('/grades', data);
    return response.data;
  },

  async updateGrade(id: string, data: Partial<CreateGradeData>): Promise<Grade> {
    const response = await apiClient.put(`/grades/${id}`, data);
    return response.data;
  },

  async deleteGrade(id: string): Promise<void> {
    await apiClient.delete(`/grades/${id}`);
  },

  async bulkCreateGrades(grades: CreateGradeData[]): Promise<Grade[]> {
    const response = await apiClient.post('/grades/bulk', { grades });
    return response.data;
  },

  async validateGrades(gradeIds: string[]): Promise<void> {
    await apiClient.put('/grades/validate', { gradeIds });
  },

  async getStudentGrades(studentId: string, filters?: Omit<GradeFilters, 'studentId'>) {
    const response = await apiClient.get(`/grades/student/${studentId}`, { params: filters });
    return response.data;
  },

  async getSubjectGrades(subjectId: string, classId: string, termId: string) {
    const response = await apiClient.get(`/grades/subject/${subjectId}`, {
      params: { classId, termId }
    });
    return response.data;
  },

  async getClassAverages(classId: string, termId: string, subjectId?: string) {
    const response = await apiClient.get(`/grades/averages/class/${classId}`, {
      params: { termId, subjectId }
    });
    return response.data;
  },

  async getStudentAverage(studentId: string, termId: string) {
    const response = await apiClient.get(`/grades/averages/student/${studentId}`, {
      params: { termId }
    });
    return response.data;
  },

  async getRankings(classId: string, termId: string) {
    const response = await apiClient.get(`/grades/rankings/${classId}`, {
      params: { termId }
    });
    return response.data;
  },

  async importGrades(file: File, classId: string, subjectId: string, termId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    formData.append('subjectId', subjectId);
    formData.append('termId', termId);
    
    const response = await apiClient.post('/grades/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async exportGrades(filters?: GradeFilters): Promise<Blob> {
    const response = await apiClient.get('/grades/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },

  async getGradeStats(filters?: GradeFilters) {
    const response = await apiClient.get('/grades/stats', { params: filters });
    return response.data;
  }
};
