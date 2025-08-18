// Configuration de l'API
const API_BASE_URL = 'http://localhost:3001/api';

// Fonction utilitaire pour les requêtes API
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// Services API
export const apiService = {
  // Années scolaires
  getAnneesScolaires: () => apiRequest('/annees'),
  getTrimestres: (anneeId) => apiRequest(`/annees/${anneeId}/trimestres`),

  // Classes
  getClasses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/classes${query ? `?${query}` : ''}`);
  },
  createClasse: (data) => apiRequest('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Élèves
  getEleves: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/eleves${query ? `?${query}` : ''}`);
  },
  createEleve: (data) => apiRequest('/eleves', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Matières
  getMatieres: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/matieres${query ? `?${query}` : ''}`);
  },

  // Évaluations
  getEvaluations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/evaluations${query ? `?${query}` : ''}`);
  },
  createEvaluation: (data) => apiRequest('/evaluations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Notes
  getNotes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/notes${query ? `?${query}` : ''}`);
  },
  saisirNotes: (data) => apiRequest('/notes/saisie', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  validerNotes: (noteIds) => apiRequest('/notes/validation', {
    method: 'PUT',
    body: JSON.stringify({ note_ids: noteIds }),
  }),
  getBordereau: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/notes/bordereau${query ? `?${query}` : ''}`);
  },

  // Moyennes
  getMoyennes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/moyennes${query ? `?${query}` : ''}`);
  },
  genererMoyennes: (data) => apiRequest('/moyennes/generer', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Conseils de classe
  getConseils: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/conseils${query ? `?${query}` : ''}`);
  },
  getConseil: (id) => apiRequest(`/conseils/${id}`),
  createConseil: (data) => apiRequest('/conseils', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  saveDecisions: (conseilId, decisions) => apiRequest(`/conseils/${conseilId}/decisions`, {
    method: 'POST',
    body: JSON.stringify({ decisions }),
  }),
  genererPV: (conseilId) => apiRequest(`/conseils/${conseilId}/pv`, {
    method: 'POST',
  }),

  // Bulletins
  getBulletins: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bulletins${query ? `?${query}` : ''}`);
  },
  getBulletin: (eleveId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bulletins/${eleveId}${query ? `?${query}` : ''}`);
  },
  genererBulletins: (data) => apiRequest('/bulletins/generer', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  marquerImprime: (bulletinId) => apiRequest(`/bulletins/${bulletinId}/imprimer`, {
    method: 'PUT',
  }),

  // Statistiques
  getStatistiques: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/statistiques${query ? `?${query}` : ''}`);
  },
  genererStatistiques: (data) => apiRequest('/statistiques/generer', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getTableauHonneur: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/statistiques/tableau-honneur${query ? `?${query}` : ''}`);
  },
  getStatistiquesGlobales: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/statistiques/globales${query ? `?${query}` : ''}`);
  },

  // Notifications
  sendSMSToParents: (data) => apiRequest('/notifications/sms/parents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  sendBulletinByEmail: (data) => apiRequest('/notifications/email/bulletin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  sendBulletinByWhatsApp: (data) => apiRequest('/notifications/whatsapp/bulletin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  sendTableauHonneur: (data) => apiRequest('/notifications/tableau-honneur', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Test de connexion
  healthCheck: () => apiRequest('/health'),
};