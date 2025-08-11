const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis',
        error: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with school info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        school: true,
        student: true,
        teacher: true,
        parent: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
        error: 'USER_NOT_FOUND'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé',
        error: 'ACCOUNT_DISABLED'
      });
    }

    // Check school status
    if (user.school.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'École suspendue',
        error: 'SCHOOL_SUSPENDED'
      });
    }

    // Check trial expiration for free plans
    if (user.school.plan.name === 'Gratuit' && user.school.trialEndsAt) {
      if (new Date() > user.school.trialEndsAt) {
        return res.status(403).json({
          success: false,
          message: 'Période d\'essai expirée',
          error: 'TRIAL_EXPIRED'
        });
      }
    }

    req.user = user;
    req.schoolId = user.schoolId;
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide',
        error: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré',
        error: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
      error: 'AUTH_ERROR'
    });
  }
};

module.exports = authMiddleware;