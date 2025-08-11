/**
 * Constantes pour l'application Academia Hub
 */

// Rôles utilisateur
const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  DIRECTOR: 'DIRECTOR',
  SECRETARY: 'SECRETARY',
  ACCOUNTANT: 'ACCOUNTANT',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT'
};

// Statuts utilisateur
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};

// Types de documents
const DOCUMENT_TYPES = {
  IDENTITY: 'IDENTITY',
  MEDICAL: 'MEDICAL',
  ACADEMIC: 'ACADEMIC',
  OTHER: 'OTHER',
  CAHIER_JOURNAL: 'CAHIER_JOURNAL',
  BULLETIN: 'BULLETIN',
  TIMETABLE: 'TIMETABLE',
  REPORT: 'REPORT'
};

// Statuts de documents
const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  FINAL: 'FINAL',
  ARCHIVED: 'ARCHIVED'
};

// Types de notifications
const NOTIFICATION_TYPES = {
  SYSTEM: 'SYSTEM',
  REMINDER: 'REMINDER',
  UPDATE: 'UPDATE',
  ALERT: 'ALERT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  PERSONAL: 'PERSONAL'
};

// Statuts de notifications
const NOTIFICATION_STATUS = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  READ: 'READ',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

// Types d'examens selon le système béninois
const EXAM_TYPES = {
  MATERNELLE: ['OBSERVATION_CONTINUE', 'BILAN_TRIMESTRE', 'BILAN_ANNUEL'],
  PRIMAIRE: ['EM1', 'EM2', 'EC'],
  SECONDAIRE: ['IE1', 'IE2', 'DS1', 'DS2']
};

// Niveaux de compétences APC
const COMPETENCE_LEVELS = {
  EXPERT: 'EXPERT',
  AVANCE: 'AVANCE',
  INTERMEDIAIRE: 'INTERMEDIAIRE',
  DEBUTANT: 'DEBUTANT'
};

// Domaines de compétences APC
const COMPETENCE_DOMAINS = {
  DISCIPLINAIRE: 'DISCIPLINAIRE',
  METHODOLOGIQUE: 'METHODOLOGIQUE',
  SOCIALE_CIVIQUE: 'SOCIALE_CIVIQUE',
  PERSONNELLE_AUTONOMIE: 'PERSONNELLE_AUTONOMIE'
};

// Types d'absences
const ABSENCE_TYPES = {
  JUSTIFIED: 'JUSTIFIED',
  UNJUSTIFIED: 'UNJUSTIFIED',
  ABSENT: 'ABSENT',
  EXCUSED: 'EXCUSED'
};

// Statuts d'absences
const ABSENCE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// Jours de la semaine
const WEEK_DAYS = {
  MONDAY: 'LUNDI',
  TUESDAY: 'MARDI',
  WEDNESDAY: 'MERCREDI',
  THURSDAY: 'JEUDI',
  FRIDAY: 'VENDREDI',
  SATURDAY: 'SAMEDI',
  SUNDAY: 'DIMANCHE'
};

// Types de salles
const ROOM_TYPES = {
  SALLE: 'SALLE',
  LABO: 'LABO',
  BIBLIOTHEQUE: 'BIBLIOTHEQUE',
  AMPHITHEATRE: 'AMPHITHEATRE',
  GYMNASE: 'GYMNASE'
};

// Méthodes de paiement
const PAYMENT_METHODS = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  ONLINE_PAYMENT: 'ONLINE_PAYMENT',
  CHEQUE: 'CHEQUE',
  MOBILE_MONEY: 'MOBILE_MONEY',
  OTHER: 'OTHER'
};

// Statuts de paiement
const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  OVERPAID: 'OVERPAID',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED'
};

// Types de paiement
const PAYMENT_TYPES = {
  TUITION: 'TUITION',
  FEE: 'FEE',
  EXPENSE: 'EXPENSE',
  SALARY: 'SALARY',
  OTHER: 'OTHER'
};

// Devises
const CURRENCIES = {
  XOF: 'XOF', // Franc CFA
  EUR: 'EUR',
  USD: 'USD'
};

// Formats d'export
const EXPORT_FORMATS = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  XLSX: 'XLSX',
  CSV: 'CSV'
};

// Priorités
const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Statuts génériques
const GENERIC_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Limites de pagination
const PAGINATION_LIMITS = {
  DEFAULT: 10,
  MAX: 100,
  OPTIONS: [10, 25, 50, 100]
};

// Formats de date
const DATE_FORMATS = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm',
  ACADEMIC_YEAR: 'YYYY-YYYY'
};

// Messages d'erreur communs
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Données invalides',
  INTERNAL_ERROR: 'Erreur interne du serveur',
  DUPLICATE_ENTRY: 'Cette entrée existe déjà',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  TOKEN_EXPIRED: 'Token expiré',
  INSUFFICIENT_PERMISSION: 'Permissions insuffisantes'
};

// Messages de succès communs
const SUCCESS_MESSAGES = {
  CREATED: 'Créé avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  PASSWORD_RESET: 'Mot de passe réinitialisé',
  EMAIL_SENT: 'Email envoyé avec succès'
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  EXAM_TYPES,
  COMPETENCE_LEVELS,
  COMPETENCE_DOMAINS,
  ABSENCE_TYPES,
  ABSENCE_STATUS,
  WEEK_DAYS,
  ROOM_TYPES,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_TYPES,
  CURRENCIES,
  EXPORT_FORMATS,
  PRIORITIES,
  GENERIC_STATUS,
  PAGINATION_LIMITS,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};