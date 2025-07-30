import axios from 'axios';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Création de l'instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter l'authentification et le tenant
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const tenantId = localStorage.getItem('tenantId') || window.location.pathname.split('/')[1];
    
    if (!config.headers) {
      config.headers = {};
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types pour les données
export interface Note {
  id?: string;
  eleveId: string;
  matiereId: string;
  evaluationId: string;
  note: number;
  coefficient?: number;
  commentaire?: string;
  date?: string;
}

export interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  classeId: string;
  dateNaissance?: string;
  email?: string;
  telephone?: string;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  anneeScolaireId: string;
  professeurPrincipal?: string;
}

export interface Matiere {
  id: string;
  nom: string;
  code: string;
  coefficient: number;
  classeId: string;
  professeurId?: string;
}

export interface Evaluation {
  id: string;
  nom: string;
  type: string;
  date: string;
  coefficient: number;
  matiereId: string;
  classeId: string;
  maxPoints: number;
}

export interface Bulletin {
  id: string;
  eleveId: string;
  classeId: string;
  trimestreId: string;
  moyenneGenerale: number;
  rang: number;
  totalCoefficients: number;
  totalPoints: number;
  mention: string;
  observations?: string;
  dateGeneration: string;
}

export interface ConseilClasse {
  id: string;
  classeId: string;
  trimestreId: string;
  date: string;
  decisions: Array<{
    eleveId: string;
    decision: string;
    commentaire?: string;
  }>;
}

// Service API complet
export const apiService = {
  // Années scolaires
  getAnneesScolaires: () => api.get('/annees'),
  getTrimestres: (anneeId: string) => api.get(`/annees/${anneeId}/trimestres`),

  // Classes
  getClasses: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/classes${query ? `?${query}` : ''}`);
  },
  createClasse: (data: Partial<Classe>) => api.post('/classes', data),

  // Élèves
  getEleves: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/eleves${query ? `?${query}` : ''}`);
  },
  createEleve: (data: Partial<Eleve>) => api.post('/eleves', data),

  // Matières
  getMatieres: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/matieres${query ? `?${query}` : ''}`);
  },

  // Évaluations
  getEvaluations: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/evaluations${query ? `?${query}` : ''}`);
  },
  createEvaluation: (data: Partial<Evaluation>) => api.post('/evaluations', data),

  // Notes
  getNotes: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/notes${query ? `?${query}` : ''}`);
  },
  getNotesByClasseAndMatiere: (classeId: string, matiereId: string) =>
    api.get(`/notes/classe/${classeId}/matiere/${matiereId}`),
  saveNote: (data: Record<string, unknown>) => api.post('/notes/saisie', data),
  updateNote: (id: string, data: Record<string, unknown>) => api.put(`/notes/${id}`, data),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
  validerNotes: (noteIds: string[]) => api.post('/notes/validation', { noteIds }),

  // Bordereaux
  getBordereau: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bordereau${query ? `?${query}` : ''}`);
  },

  // Moyennes
  getMoyennes: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/moyennes${query ? `?${query}` : ''}`);
  },
  genererMoyennes: (data: Record<string, unknown>) => api.post('/moyennes/generation', data),

  // Conseils de classe
  getConseils: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/conseils${query ? `?${query}` : ''}`);
  },
  getConseil: (id: string) => api.get(`/conseils/${id}`),
  createConseil: (data: Partial<ConseilClasse>) => api.post('/conseils', data),
  saveDecisions: (conseilId: string, decisions: Array<{ eleveId: string; decision: string; commentaire?: string }>) =>
    api.post(`/conseils/${conseilId}/decisions`, { decisions }),
  genererPV: (conseilId: string) => api.post(`/conseils/${conseilId}/pv`),

  // Bulletins
  getBulletins: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bulletins${query ? `?${query}` : ''}`);
  },
  getBulletin: (eleveId: string, params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/bulletins/${eleveId}${query ? `?${query}` : ''}`);
  },
  genererBulletins: (data: Record<string, unknown>) => api.post('/bulletins/generation', data),
  marquerImprime: (bulletinId: string) => api.put(`/bulletins/${bulletinId}/imprime`),

  // Statistiques
  getStatistiques: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/statistiques${query ? `?${query}` : ''}`);
  },
  genererStatistiques: (data: Record<string, unknown>) => api.post('/statistiques/generation', data),

  // Tableau d'honneur
  getTableauHonneur: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/tableau-honneur${query ? `?${query}` : ''}`);
  },

  // Statistiques globales
  getStatistiquesGlobales: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/statistiques-globales${query ? `?${query}` : ''}`);
  },

  // Notifications
  sendSMSToParents: (data: { eleves: string[]; message: string }) =>
    api.post('/notifications/sms', data),
  sendBulletinByEmail: (data: { eleves: string[]; subject?: string }) =>
    api.post('/notifications/email-bulletins', data),
  sendBulletinByWhatsApp: (data: { eleves: string[]; message?: string }) =>
    api.post('/notifications/whatsapp-bulletins', data),
  sendTableauHonneur: (data: { classeId: string; trimestreId: string }) =>
    api.post('/notifications/tableau-honneur', data),

  // Test de connexion
  healthCheck: () => api.get('/health'),
};

export default api;
