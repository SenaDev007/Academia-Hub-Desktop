import { apiClient } from './config';

export interface ReportFilters {
  classId?: string;
  studentId?: string;
  termId?: string;
  academicYearId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const reportsService = {
  async generateStudentReport(studentId: string, termId: string) {
    const response = await apiClient.get(`/reports/student/${studentId}`, {
      params: { termId }
    });
    return response.data;
  },

  async generateClassReport(classId: string, termId: string) {
    const response = await apiClient.get(`/reports/class/${classId}`, {
      params: { termId }
    });
    return response.data;
  },

  async exportReport(type: string, params: ReportFilters): Promise<Blob> {
    const response = await apiClient.get(`/reports/${type}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
