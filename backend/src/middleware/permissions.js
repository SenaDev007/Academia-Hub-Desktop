const logger = require('../utils/logger');

// Définition des permissions par rôle
const PERMISSIONS = {
  SUPER_ADMIN: ['*'], // Accès complet
  SCHOOL_ADMIN: [
    'school:read', 'school:update',
    'user:*',
    'student:*',
    'teacher:*',
    'class:*',
    'subject:*',
    'grade:*',
    'schedule:*',
    'planning:*',
    'exam:*',
    'document:*',
    'notification:*',
    'report:*',
    'academic:*',
    'absence:*',
    'cahier_journal:*',
    'competence:*',
    'finance:*',
    'room:*',
    'parent:*',
    'bulletin:*',
    'payroll:*',
    'support:*'
  ],
  DIRECTOR: {
    MATERNELLE: [
      'school:read',
      'user:read',
      'student:read', 'student:update',
      'teacher:read',
      'class:read', 'class:update',
      'subject:read',
      'grade:read', 'grade:update',
      'schedule:read',
      'planning:read', 'planning:create', 'planning:update',
      'exam:read', 'exam:create', 'exam:update',
      'document:read', 'document:create',
      'notification:read', 'notification:create',
      'report:read',
      'academic:read',
      'absence:read', 'absence:create', 'absence:update',
      'cahier_journal:read', 'cahier_journal:create', 'cahier_journal:validate',
      'competence:read', 'competence:create',
      'finance:read',
      'room:read', 'room:reserve',
      'parent:read',
      'bulletin:read', 'bulletin:create'
    ],
    PRIMAIRE: [
      'school:read',
      'user:read',
      'student:read', 'student:update',
      'teacher:read',
      'class:read', 'class:update',
      'subject:read',
      'grade:read', 'grade:update',
      'schedule:read',
      'planning:read', 'planning:create', 'planning:update',
      'exam:read', 'exam:create', 'exam:update',
      'document:read', 'document:create',
      'notification:read', 'notification:create',
      'report:read',
      'academic:read',
      'absence:read', 'absence:create', 'absence:update',
      'cahier_journal:read', 'cahier_journal:create', 'cahier_journal:validate',
      'competence:read', 'competence:create',
      'finance:read',
      'room:read', 'room:reserve',
      'parent:read',
      'bulletin:read', 'bulletin:create'
    ],
    SECONDAIRE: [
      'school:read',
      'user:read',
      'student:read', 'student:update',
      'teacher:read',
      'class:read', 'class:update',
      'subject:read',
      'grade:read', 'grade:update',
      'schedule:read',
      'planning:read', 'planning:create', 'planning:update',
      'exam:read', 'exam:create', 'exam:update',
      'document:read', 'document:create',
      'notification:read', 'notification:create',
      'report:read',
      'academic:read',
      'absence:read', 'absence:create', 'absence:update',
      'cahier_journal:read', 'cahier_journal:create', 'cahier_journal:validate',
      'competence:read', 'competence:create',
      'finance:read',
      'room:read', 'room:reserve',
      'parent:read',
      'bulletin:read', 'bulletin:create'
    ]
  },
  SECRETARY: [
    'school:read',
    'user:read', 'user:create', 'user:update',
    'student:*',
    'teacher:read',
    'class:read',
    'subject:read',
    'document:*',
    'notification:read', 'notification:create',
    'academic:read',
    'absence:*',
    'parent:*',
    'room:read',
    'support:read', 'support:create'
  ],
  ACCOUNTANT: [
    'school:read',
    'user:read',
    'student:read',
    'teacher:read',
    'expense:*',
    'payroll:*',
    'report:read', 'report:create',
    'finance:*',
    'bulletin:read',
    'academic:read',
    'support:read', 'support:create'
  ],
  TEACHER: [
    'school:read',
    'user:read',
    'student:read',
    'class:read',
    'subject:read',
    'grade:read', 'grade:create', 'grade:update',
    'schedule:read',
    'planning:read',
    'exam:read', 'exam:create',
    'document:read', 'document:create',
    'cahier_journal:*',
    'academic:read',
    'absence:read', 'absence:create',
    'competence:read', 'competence:create',
    'room:read', 'room:reserve',
    'parent:read',
    'bulletin:read', 'bulletin:create',
    'finance:read',
    'support:read', 'support:create'
  ],
  STUDENT: [
    'user:read', 'user:update',
    'grade:read',
    'schedule:read',
    'document:read',
    'notification:read',
    'academic:read',
    'absence:read',
    'bulletin:read',
    'support:read', 'support:create'
  ],
  PARENT: [
    'user:read', 'user:update',
    'student:read',
    'grade:read',
    'schedule:read',
    'document:read',
    'notification:read',
    'academic:read',
    'absence:read',
    'bulletin:read',
    'finance:read',
    'support:read', 'support:create'
  ]
};

// Middleware de vérification des permissions
const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié',
          error: 'NOT_AUTHENTICATED'
        });
      }

      // Super admin a tous les droits
      if (user.role === 'SUPER_ADMIN') {
        return next();
      }

      let userPermissions = [];

      // Récupération des permissions selon le rôle
      if (user.role === 'DIRECTOR') {
        // Pour les directeurs, on doit vérifier leur niveau
        const directorLevel = user.directorLevel || 'SECONDAIRE'; // Par défaut SECONDAIRE
        userPermissions = PERMISSIONS.DIRECTOR[directorLevel] || [];
      } else {
        userPermissions = PERMISSIONS[user.role] || [];
      }

      // Vérification de la permission
      const hasPermission = userPermissions.includes('*') || 
                           userPermissions.includes(requiredPermission) ||
                           userPermissions.some(permission => {
                             if (permission.endsWith(':*')) {
                               const module = permission.split(':')[0];
                               return requiredPermission.startsWith(module + ':');
                             }
                             return false;
                           });

      if (!hasPermission) {
        logger.warn(`Permission denied for user ${user.id}:`, {
          userId: user.id,
          role: user.role,
          requiredPermission,
          userPermissions
        });

        return res.status(403).json({
          success: false,
          message: 'Permission insuffisante',
          error: 'INSUFFICIENT_PERMISSION'
        });
      }

      next();
    } catch (error) {
      logger.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur de vérification des permissions',
        error: 'PERMISSION_ERROR'
      });
    }
  };
};

// Middleware pour vérifier si l'utilisateur peut accéder aux données d'une école
const requireSchoolAccess = (req, res, next) => {
  try {
    const user = req.user;
    const schoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;

    // Super admin peut accéder à toutes les écoles
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Vérifier que l'utilisateur appartient à l'école
    if (user.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette école',
        error: 'SCHOOL_ACCESS_DENIED'
      });
    }

    next();
  } catch (error) {
    logger.error('School access middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de vérification d\'accès école',
      error: 'SCHOOL_ACCESS_ERROR'
    });
  }
};

module.exports = {
  requirePermission,
  requireSchoolAccess,
  PERMISSIONS
};