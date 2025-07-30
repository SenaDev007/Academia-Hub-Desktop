/**
 * Service for authentication and user management
 */

import { User, UserRole } from '../types/tenant';

// Interface for registration data
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  schoolName: string;
  schoolType: string;
  schoolAddress: string;
  subdomain: string;
}

// Interface for login data
interface LoginData {
  email: string;
  password: string;
  schoolId?: string;
}

// Interface for login response
interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Register a new school and promoter
 */
export const registerSchool = async (data: RegisterData): Promise<User> => {
  try {
    // In a real implementation, you would make an API call
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulated response
    return {
      id: `user-${Date.now()}`,
      schoolId: `school-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'promoter',
      status: 'pending',
      phone: data.phone,
      kycVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to register school:', error);
    throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
  }
};

/**
 * Login a user
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    // In a real implementation, you would make an API call
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated response
    return {
      user: {
        id: 'user-1',
        schoolId: data.schoolId || 'school-1',
        email: data.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        status: 'active',
        kycVerified: true,
        lastLogin: new Date().toISOString(),
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      token: 'mock-jwt-token'
    };
  } catch (error) {
    console.error('Failed to login:', error);
    throw new Error('Identifiants incorrects. Veuillez réessayer.');
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    // In a real implementation, you might need to invalidate the token on the server
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tenant');
  } catch (error) {
    console.error('Failed to logout:', error);
    throw new Error('Erreur lors de la déconnexion. Veuillez réessayer.');
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // In a real implementation, you would validate the token and get the user
    // For now, we'll just check localStorage
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

/**
 * Check if the user has a specific role
 */
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    // In a real implementation, you would make an API call
    // For now, we'll simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Failed to request password reset:', error);
    throw new Error('Erreur lors de la demande de réinitialisation du mot de passe. Veuillez réessayer.');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // In a real implementation, you would make an API call
    // For now, we'll simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Failed to reset password:', error);
    throw new Error('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  try {
    // In a real implementation, you would make an API call
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get current user data
    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    
    // Update user data
    const updatedUser = {
      ...currentUser,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
  }
};