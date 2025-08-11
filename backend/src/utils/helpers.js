/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Générer un identifiant unique
 */
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

/**
 * Formater un montant en devise
 */
function formatCurrency(amount, currency = 'XOF') {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
}

/**
 * Formater une date
 */
function formatDate(date, format = 'DD/MM/YYYY') {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return d.toLocaleDateString('fr-FR');
  }
}

/**
 * Calculer l'âge à partir de la date de naissance
 */
function calculateAge(birthDate) {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Valider un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un numéro de téléphone (format international)
 */
function isValidPhone(phone) {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Générer un mot de passe aléatoire
 */
function generatePassword(length = 8) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

/**
 * Nettoyer et normaliser une chaîne de caractères
 */
function sanitizeString(str) {
  if (!str) return '';
  
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '');
}

/**
 * Convertir une chaîne en slug
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Paginer des résultats
 */
function paginate(data, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  
  return {
    data: paginatedData,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(data.length / limit),
      total: data.length,
      hasNext: offset + limit < data.length,
      hasPrev: page > 1
    }
  };
}

/**
 * Calculer le pourcentage
 */
function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

/**
 * Arrondir un nombre à n décimales
 */
function roundToDecimals(number, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
}

/**
 * Vérifier si une date est dans une plage
 */
function isDateInRange(date, startDate, endDate) {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return d >= start && d <= end;
}

/**
 * Obtenir le début et la fin d'une période
 */
function getPeriodBounds(period, date = new Date()) {
  const d = new Date(date);
  
  switch (period) {
    case 'day':
      return {
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      };
    case 'week':
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return {
        start: startOfWeek,
        end: endOfWeek
      };
    case 'month':
      return {
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      };
    case 'year':
      return {
        start: new Date(d.getFullYear(), 0, 1),
        end: new Date(d.getFullYear(), 11, 31, 23, 59, 59)
      };
    default:
      return { start: d, end: d };
  }
}

/**
 * Générer un numéro de facture
 */
function generateInvoiceNumber(schoolId, count) {
  const year = new Date().getFullYear();
  const schoolCode = schoolId.slice(-4).toUpperCase();
  const number = String(count + 1).padStart(4, '0');
  
  return `INV-${year}-${schoolCode}-${number}`;
}

/**
 * Générer un numéro d'élève (Educmaster)
 */
function generateStudentNumber(schoolId, count) {
  const year = new Date().getFullYear().toString().slice(-2);
  const schoolCode = schoolId.slice(-3).toUpperCase();
  const number = String(count + 1).padStart(4, '0');
  
  return `${year}${schoolCode}${number}`;
}

/**
 * Valider une année académique
 */
function validateAcademicYear(academicYear) {
  const regex = /^\d{4}-\d{4}$/;
  if (!regex.test(academicYear)) return false;
  
  const [startYear, endYear] = academicYear.split('-').map(Number);
  return endYear === startYear + 1;
}

/**
 * Obtenir l'année académique actuelle
 */
function getCurrentAcademicYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // L'année scolaire commence généralement en septembre
  if (currentMonth >= 9) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
}

/**
 * Obtenir le trimestre actuel
 */
function getCurrentTrimester() {
  const now = new Date();
  const month = now.getMonth() + 1;
  
  if (month >= 9 && month <= 12) return 'T1';
  if (month >= 1 && month <= 3) return 'T2';
  if (month >= 4 && month <= 7) return 'T3';
  
  return 'T1'; // Par défaut
}

/**
 * Masquer des informations sensibles
 */
function maskSensitiveData(data, fields = ['password', 'passwordHash', 'token']) {
  const masked = { ...data };
  
  fields.forEach(field => {
    if (masked[field]) {
      masked[field] = '***';
    }
  });
  
  return masked;
}

/**
 * Générer une couleur aléatoire (hex)
 */
function generateRandomColor() {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Valider un fichier uploadé
 */
function validateFile(file, allowedTypes = [], maxSize = 10 * 1024 * 1024) {
  const errors = [];
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    errors.push('Type de fichier non autorisé');
  }
  
  if (file.size > maxSize) {
    errors.push(`Fichier trop volumineux (max: ${formatFileSize(maxSize)})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Formater la taille d'un fichier
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  generateId,
  formatCurrency,
  formatDate,
  calculateAge,
  isValidEmail,
  isValidPhone,
  generatePassword,
  sanitizeString,
  slugify,
  paginate,
  calculatePercentage,
  roundToDecimals,
  isDateInRange,
  getPeriodBounds,
  generateInvoiceNumber,
  generateStudentNumber,
  validateAcademicYear,
  getCurrentAcademicYear,
  getCurrentTrimester,
  maskSensitiveData,
  generateRandomColor,
  validateFile,
  formatFileSize
};