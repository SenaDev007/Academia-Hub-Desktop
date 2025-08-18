import { dataService } from '../dataService';
import { Payment, Expense, Invoice, FeeStructure } from '../dataService';

export interface CreatePaymentData {
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mobile_money';
  reference?: string;
  description?: string;
  date?: string;
  type?: string;
}

export interface CreateExpenseData {
  amount: number;
  description: string;
  category: string;
  date?: string;
  paymentMethod: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CreateFeeStructureData {
  name: string;
  amount: number;
  classId?: string;
  academicYearId?: string;
  termId?: string;
  description?: string;
  dueDate?: string;
  isActive?: boolean;
}

export interface FinanceFilters {
  studentId?: string;
  classId?: string;
  academicYearId?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
  type?: string;
}

export const financeService = {
  // Dashboard
  async getDashboard() {
    try {
      const dashboard = await dataService.getFinanceDashboard();
      return {
        data: dashboard,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Payments
  async getPayments(filters?: FinanceFilters) {
    try {
      const payments = await dataService.getAllPayments(filters);
      return {
        data: payments,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getPayment(id: string) {
    try {
      const payment = await dataService.getPaymentById(id);
      if (!payment) {
        return {
          data: null,
          success: false,
          error: 'Paiement non trouvé'
        };
      }
      return {
        data: payment,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du paiement:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async createPayment(data: CreatePaymentData) {
    try {
      const payment = await dataService.createPayment(data);
      return {
        data: payment,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async updatePayment(id: string, data: Partial<CreatePaymentData>) {
    try {
      const payment = await dataService.updatePayment(id, data);
      return {
        data: payment,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async deletePayment(id: string) {
    try {
      const success = await dataService.deletePayment(id);
      return {
        data: success,
        success
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      return {
        data: false,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Expenses
  async getExpenses(filters?: FinanceFilters) {
    try {
      const expenses = await dataService.getAllExpenses(filters);
      return {
        data: expenses,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getExpense(id: string) {
    try {
      const expense = await dataService.getExpenseById(id);
      if (!expense) {
        return {
          data: null,
          success: false,
          error: 'Dépense non trouvée'
        };
      }
      return {
        data: expense,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la dépense:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async createExpense(data: CreateExpenseData) {
    try {
      const expense = await dataService.createExpense(data);
      return {
        data: expense,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la création de la dépense:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async updateExpense(id: string, data: Partial<CreateExpenseData>) {
    try {
      const expense = await dataService.updateExpense(id, data);
      return {
        data: expense,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async deleteExpense(id: string) {
    try {
      const success = await dataService.deleteExpense(id);
      return {
        data: success,
        success
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
      return {
        data: false,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Fee Structures
  async getFeeStructures(filters?: {
    classId?: string;
    academicYearId?: string;
    isActive?: boolean;
  }) {
    try {
      const feeStructures = await dataService.getAllFeeStructures(filters);
      return {
        data: feeStructures,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des structures de frais:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getFeeStructure(id: string) {
    try {
      const feeStructure = await dataService.getFeeStructureById(id);
      if (!feeStructure) {
        return {
          data: null,
          success: false,
          error: 'Structure de frais non trouvée'
        };
      }
      return {
        data: feeStructure,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la structure de frais:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async createFeeStructure(data: CreateFeeStructureData) {
    try {
      const feeStructure = await dataService.createFeeStructure(data);
      return {
        data: feeStructure,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la création de la structure de frais:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async updateFeeStructure(id: string, data: Partial<CreateFeeStructureData>) {
    try {
      const feeStructure = await dataService.updateFeeStructure(id, data);
      return {
        data: feeStructure,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la structure de frais:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async deleteFeeStructure(id: string) {
    try {
      const success = await dataService.deleteFeeStructure(id);
      return {
        data: success,
        success
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la structure de frais:', error);
      return {
        data: false,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Student Balance
  async getStudentBalance(studentId: string) {
    try {
      const balance = await dataService.getStudentBalance(studentId);
      return {
        data: balance,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du solde étudiant:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Reports
  async getFinanceReport(filters: {
    startDate: string;
    endDate: string;
    type: 'income' | 'expense' | 'balance';
  }) {
    try {
      const report = await dataService.getFinanceReport(filters);
      return {
        data: report,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
};
