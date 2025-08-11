const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware de validation générique
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', {
      url: req.originalUrl,
      method: req.method,
      errors: errors.array(),
      userId: req.user?.id
    });

    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Validation spécifique pour les notes selon le niveau
 */
const validateGradeByLevel = (req, res, next) => {
  const { score, qualitativeScore } = req.body;
  const level = req.body.level || 'SECONDAIRE';

  if (level === 'MATERNELLE') {
    if (!qualitativeScore || !['TS', 'S', 'PS'].includes(qualitativeScore)) {
      return res.status(400).json({
        success: false,
        message: 'Évaluation qualitative requise pour la maternelle (TS, S, PS)'
      });
    }
    if (score !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'Les notes numériques ne sont pas utilisées en maternelle'
      });
    }
  } else {
    if (!score || score < 0 || score > 20) {
      return res.status(400).json({
        success: false,
        message: 'Note numérique requise (0-20) pour ce niveau'
      });
    }
    if (qualitativeScore !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'L\'évaluation qualitative n\'est pas utilisée à ce niveau'
      });
    }
  }

  next();
};

/**
 * Validation des dates académiques
 */
const validateAcademicDates = (req, res, next) => {
  const { startDate, endDate } = req.body;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début'
      });
    }

    // Vérifier que l'année académique dure entre 8 et 12 mois
    const monthsDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsDiff < 8 || monthsDiff > 12) {
      return res.status(400).json({
        success: false,
        message: 'L\'année académique doit durer entre 8 et 12 mois'
      });
    }
  }

  next();
};

/**
 * Validation des horaires
 */
const validateTimeSlots = (req, res, next) => {
  const { startTime, endTime } = req.body;

  if (startTime && endTime) {
    // Convertir en minutes pour comparaison
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    // Vérifier que la durée est raisonnable (entre 30 minutes et 4 heures)
    const duration = end - start;
    if (duration < 30 || duration > 240) {
      return res.status(400).json({
        success: false,
        message: 'La durée doit être entre 30 minutes et 4 heures'
      });
    }
  }

  next();
};

/**
 * Convertir une heure (HH:MM) en minutes
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Validation des coefficients selon le niveau
 */
const validateCoefficients = (req, res, next) => {
  const { level, coefficient } = req.body;

  if (level === 'MATERNELLE' && coefficient && coefficient !== 0) {
    return res.status(400).json({
      success: false,
      message: 'Les coefficients ne sont pas utilisés en maternelle'
    });
  }

  if (level === 'PRIMAIRE' && coefficient && coefficient !== 1) {
    return res.status(400).json({
      success: false,
      message: 'Toutes les matières ont un coefficient de 1 au primaire'
    });
  }

  if (level === 'SECONDAIRE' && (!coefficient || coefficient < 1 || coefficient > 5)) {
    return res.status(400).json({
      success: false,
      message: 'Le coefficient doit être entre 1 et 5 au secondaire'
    });
  }

  next();
};

/**
 * Validation des trimestres
 */
const validateTrimester = (req, res, next) => {
  const { trimester } = req.body;

  if (trimester && !['T1', 'T2', 'T3'].includes(trimester)) {
    return res.status(400).json({
      success: false,
      message: 'Trimestre invalide (T1, T2, T3)'
    });
  }

  next();
};

/**
 * Validation des années académiques
 */
const validateAcademicYear = (req, res, next) => {
  const { academicYear } = req.body;

  if (academicYear && !/^\d{4}-\d{4}$/.test(academicYear)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'année académique invalide (YYYY-YYYY)'
    });
  }

  if (academicYear) {
    const [startYear, endYear] = academicYear.split('-').map(Number);
    if (endYear !== startYear + 1) {
      return res.status(400).json({
        success: false,
        message: 'L\'année de fin doit être l\'année suivante'
      });
    }
  }

  next();
};

module.exports = {
  validateRequest,
  validateGradeByLevel,
  validateAcademicDates,
  validateTimeSlots,
  validateCoefficients,
  validateTrimester,
  validateAcademicYear
};