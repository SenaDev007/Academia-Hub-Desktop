import { apiClient } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    schoolId?: string;
  };
  permissions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // Authentification
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put('/auth/profile', data);
    const user = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await apiClient.put('/auth/change-password', data);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  // Utilitaires
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
  }
};
