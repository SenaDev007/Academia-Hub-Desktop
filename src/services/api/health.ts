/**
 * Service API pour la gestion de la santé des élèves (Module Health)
 */

import { apiClient } from './config';

// Types pour la santé
export interface MedicalRecord {
  id: string;
  studentId: string;
  studentName?: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContact: string;
  emergencyPhone: string;
  insuranceNumber?: string;
  height?: number;
  weight?: number;
  vaccinationStatus: 'up_to_date' | 'pending' | 'overdue';
  lastCheckup?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthConsultation {
  id: string;
  studentId: string;
  studentName?: string;
  date: string;
  time: string;
  reason: string;
  symptoms: string[];
  diagnosis?: string;
  treatment: string;
  medication?: string;
  followUp?: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'referred';
  treatedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthAlert {
  id: string;
  studentId: string;
  studentName?: string;
  type: 'allergy' | 'chronic_condition' | 'medication' | 'emergency';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'ignored';
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  studentId: string;
  vaccineName: string;
  date: string;
  dose: number;
  nextDose?: string;
  administeredBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthStats {
  totalStudents: number;
  studentsWithMedicalRecords: number;
  consultationsThisMonth: number;
  activeAlerts: number;
  vaccinationRate: number;
  emergencyCases: number;
  chronicConditionsCount: number;
  allergiesCount: number;
}

export interface CreateMedicalRecord {
  studentId: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContact: string;
  emergencyPhone: string;
  insuranceNumber?: string;
  height?: number;
  weight?: number;
  vaccinationStatus: 'up_to_date' | 'pending' | 'overdue';
  lastCheckup?: string;
  notes?: string;
}

export interface CreateHealthConsultation {
  studentId: string;
  date: string;
  time: string;
  reason: string;
  symptoms: string[];
  diagnosis?: string;
  treatment: string;
  medication?: string;
  followUp?: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  treatedBy: string;
  notes?: string;
}

// Service API Health
export class HealthService {
  /**
   * Récupérer tous les dossiers médicaux
   */
  static async getMedicalRecords(params?: {
    studentId?: string;
    classId?: string;
    hasAllergies?: boolean;
    hasChronicConditions?: boolean;
    vaccinationStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: MedicalRecord[];
    pagination: any;
  }> {
    const response = await apiClient.get('/health/medical-records', { params });
    return response.data;
  }

  /**
   * Créer un dossier médical
   */
  static async createMedicalRecord(data: CreateMedicalRecord): Promise<{
    success: boolean;
    data: MedicalRecord;
  }> {
    const response = await apiClient.post('/health/medical-records', data);
    return response.data;
  }

  /**
   * Récupérer un dossier médical par ID
   */
  static async getMedicalRecord(id: string): Promise<{
    success: boolean;
    data: MedicalRecord;
  }> {
    const response = await apiClient.get(`/health/medical-records/${id}`);
    return response.data;
  }

  /**
   * Mettre à jour un dossier médical
   */
  static async updateMedicalRecord(id: string, data: Partial<CreateMedicalRecord>): Promise<{
    success: boolean;
    data: MedicalRecord;
  }> {
    const response = await apiClient.put(`/health/medical-records/${id}`, data);
    return response.data;
  }

  /**
   * Supprimer un dossier médical
   */
  static async deleteMedicalRecord(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.delete(`/health/medical-records/${id}`);
    return response.data;
  }

  /**
   * Récupérer toutes les consultations de santé
   */
  static async getHealthConsultations(params?: {
    studentId?: string;
    date?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: HealthConsultation[];
    pagination: any;
  }> {
    const response = await apiClient.get('/health/consultations', { params });
    return response.data;
  }

  /**
   * Créer une consultation de santé
   */
  static async createHealthConsultation(data: CreateHealthConsultation): Promise<{
    success: boolean;
    data: HealthConsultation;
  }> {
    const response = await apiClient.post('/health/consultations', data);
    return response.data;
  }

  /**
   * Récupérer une consultation par ID
   */
  static async getHealthConsultation(id: string): Promise<{
    success: boolean;
    data: HealthConsultation;
  }> {
    const response = await apiClient.get(`/health/consultations/${id}`);
    return response.data;
  }

  /**
   * Mettre à jour une consultation
   */
  static async updateHealthConsultation(id: string, data: Partial<CreateHealthConsultation>): Promise<{
    success: boolean;
    data: HealthConsultation;
  }> {
    const response = await apiClient.put(`/health/consultations/${id}`, data);
    return response.data;
  }

  /**
   * Supprimer une consultation
   */
  static async deleteHealthConsultation(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.delete(`/health/consultations/${id}`);
    return response.data;
  }

  /**
   * Récupérer les alertes de santé
   */
  static async getHealthAlerts(params?: {
    studentId?: string;
    type?: string;
    severity?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: HealthAlert[];
  }> {
    const response = await apiClient.get('/health/alerts', { params });
    return response.data;
  }

  /**
   * Créer une alerte de santé
   */
  static async createHealthAlert(data: {
    studentId: string;
    type: string;
    message: string;
    severity: string;
  }): Promise<{
    success: boolean;
    data: HealthAlert;
  }> {
    const response = await apiClient.post('/health/alerts', data);
    return response.data;
  }

  /**
   * Résoudre une alerte de santé
   */
  static async resolveHealthAlert(id: string): Promise<{
    success: boolean;
    data: HealthAlert;
  }> {
    const response = await apiClient.put(`/health/alerts/${id}/resolve`);
    return response.data;
  }

  /**
   * Récupérer les dossiers de vaccination
   */
  static async getVaccinationRecords(params?: {
    studentId?: string;
    vaccineName?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: VaccinationRecord[];
  }> {
    const response = await apiClient.get('/health/vaccinations', { params });
    return response.data;
  }

  /**
   * Créer un dossier de vaccination
   */
  static async createVaccinationRecord(data: {
    studentId: string;
    vaccineName: string;
    date: string;
    dose: number;
    administeredBy: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    data: VaccinationRecord;
  }> {
    const response = await apiClient.post('/health/vaccinations', data);
    return response.data;
  }

  /**
   * Récupérer les statistiques de santé
   */
  static async getHealthStats(): Promise<{
    success: boolean;
    data: HealthStats;
  }> {
    const response = await apiClient.get('/health/stats');
    return response.data;
  }

  /**
   * Récupérer les élèves avec conditions médicales
   */
  static async getStudentsWithMedicalConditions(): Promise<{
    success: boolean;
    data: MedicalRecord[];
  }> {
    const response = await apiClient.get('/health/students-with-conditions');
    return response.data;
  }

  /**
   * Récupérer les élèves ayant besoin de vaccination
   */
  static async getStudentsNeedingVaccination(): Promise<{
    success: boolean;
    data: MedicalRecord[];
  }> {
    const response = await apiClient.get('/health/students-needing-vaccination');
    return response.data;
  }

  /**
   * Exporter les données de santé
   */
  static async exportHealthData(params: {
    format: 'csv' | 'excel' | 'pdf';
    type?: 'medical-records' | 'consultations' | 'vaccinations';
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<{
    success: boolean;
    data: {
      url: string;
      filename: string;
    };
  }> {
    const response = await apiClient.post('/health/export', params, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Rechercher des dossiers médicaux
   */
  static async searchMedicalRecords(query: string): Promise<{
    success: boolean;
    data: MedicalRecord[];
  }> {
    const response = await apiClient.get('/health/search', { params: { query } });
    return response.data;
  }
}

// Instance exportée pour utilisation directe
export const healthService = HealthService;
