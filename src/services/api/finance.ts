import { apiClient } from './config';

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  classId?: string;
  academicYearId: string;
  termId?: string;
  description?: string;
  dueDate?: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mobile_money';
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  description?: string;
}

export const financeService = {
  async getFeeStructures(params?: { classId?: string; academicYearId?: string }) {
    const response = await apiClient.get('/finance/fee-structures', { params });
    return response.data;
  },

  async createFeeStructure(data: Omit<FeeStructure, 'id'>): Promise<FeeStructure> {
    const response = await apiClient.post('/finance/fee-structures', data);
    return response.data;
  },

  async getPayments(params?: { studentId?: string; dateFrom?: string; dateTo?: string }) {
    const response = await apiClient.get('/finance/payments', { params });
    return response.data;
  },

  async createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
    const response = await apiClient.post('/finance/payments', data);
    return response.data;
  },

  async getStudentBalance(studentId: string) {
    const response = await apiClient.get(`/finance/students/${studentId}/balance`);
    return response.data;
  }
};
