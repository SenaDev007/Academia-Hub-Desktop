import rateLimit from 'express-rate-limit';

// Rate limiter pour les requêtes d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par fenêtre
  message: 'Trop de tentatives d\'authentification. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limite de 1000 requêtes par fenêtre
  message: 'Trop de requêtes. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});
