const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/health/medical-records:
 *   get:
 *     summary: Récupérer tous les dossiers médicaux
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/medical-records', requirePermission('health:read'), async (req, res) => {
  try {
    const { studentId, classId, hasAllergies, hasChronicConditions, vaccinationStatus, page = 1, limit = 20 } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (studentId) where.studentId = studentId;
    if (classId) where.classId = classId;
    if (hasAllergies === 'true') where.allergies = { not: '' };
    if (hasChronicConditions === 'true') where.chronicConditions = { not: '' };
    if (vaccinationStatus) where.vaccinationStatus = vaccinationStatus;

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              educmasterNumber: true,
              class: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.medicalRecord.count({ where })
    ]);

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des dossiers médicaux'
    });
  }
});

/**
 * @swagger
 * /api/health/medical-records:
 *   post:
 *     summary: Créer un dossier médical
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.post('/medical-records', [
  requirePermission('health:create'),
  body('studentId').notEmpty().withMessage('L\'ID étudiant est requis'),
  body('bloodType').notEmpty().withMessage('Le groupe sanguin est requis'),
  body('emergencyContact').notEmpty().withMessage('Le contact d\'urgence est requis'),
  body('emergencyPhone').notEmpty().withMessage('Le téléphone d\'urgence est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const recordData = {
      ...req.body,
      schoolId: req.user.schoolId,
      createdById: req.user.id
    };

    const record = await prisma.medicalRecord.create({
      data: recordData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            educmasterNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    logger.error('Create medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du dossier médical'
    });
  }
});

/**
 * @swagger
 * /api/health/medical-records/{id}:
 *   get:
 *     summary: Récupérer un dossier médical par ID
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/medical-records/:id', requirePermission('health:read'), async (req, res) => {
  try {
    const record = await prisma.medicalRecord.findFirst({
      where: {
        id: req.params.id,
        schoolId: req.user.schoolId
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            educmasterNumber: true,
            class: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Dossier médical non trouvé'
      });
    }

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    logger.error('Get medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du dossier médical'
    });
  }
});

/**
 * @swagger
 * /api/health/medical-records/{id}:
 *   put:
 *     summary: Mettre à jour un dossier médical
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.put('/medical-records/:id', [
  requirePermission('health:update'),
  body('bloodType').optional().notEmpty(),
  body('emergencyContact').optional().notEmpty(),
  body('emergencyPhone').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const record = await prisma.medicalRecord.update({
      where: {
        id: req.params.id,
        schoolId: req.user.schoolId
      },
      data: {
        ...req.body,
        updatedAt: new Date()
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            educmasterNumber: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    logger.error('Update medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du dossier médical'
    });
  }
});

/**
 * @swagger
 * /api/health/medical-records/{id}:
 *   delete:
 *     summary: Supprimer un dossier médical
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/medical-records/:id', requirePermission('health:delete'), async (req, res) => {
  try {
    await prisma.medicalRecord.delete({
      where: {
        id: req.params.id,
        schoolId: req.user.schoolId
      }
    });

    res.json({
      success: true,
      message: 'Dossier médical supprimé avec succès'
    });

  } catch (error) {
    logger.error('Delete medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du dossier médical'
    });
  }
});

/**
 * @swagger
 * /api/health/consultations:
 *   get:
 *     summary: Récupérer toutes les consultations de santé
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/consultations', requirePermission('health:read'), async (req, res) => {
  try {
    const { studentId, date, severity, status, page = 1, limit = 20 } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (studentId) where.studentId = studentId;
    if (date) where.date = new Date(date);
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const skip = (page - 1) * limit;

    const [consultations, total] = await Promise.all([
      prisma.healthConsultation.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              educmasterNumber: true,
              class: {
                select: {
                  name: true
                }
              }
            }
          },
          treatedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.healthConsultation.count({ where })
    ]);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get health consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des consultations'
    });
  }
});

/**
 * @swagger
 * /api/health/consultations:
 *   post:
 *     summary: Créer une consultation de santé
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.post('/consultations', [
  requirePermission('health:create'),
  body('studentId').notEmpty().withMessage('L\'ID étudiant est requis'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('time').notEmpty().withMessage('L\'heure est requise'),
  body('reason').notEmpty().withMessage('La raison est requise'),
  body('treatment').notEmpty().withMessage('Le traitement est requis'),
  body('treatedBy').notEmpty().withMessage('Le soignant est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const consultationData = {
      ...req.body,
      schoolId: req.user.schoolId,
      createdById: req.user.id
    };

    const consultation = await prisma.healthConsultation.create({
      data: consultationData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            educmasterNumber: true
          }
        },
        treatedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: consultation
    });

  } catch (error) {
    logger.error('Create health consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la consultation'
    });
  }
});

/**
 * @swagger
 * /api/health/stats:
 *   get:
 *     summary: Récupérer les statistiques de santé
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', requirePermission('health:read'), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    const [
      totalStudents,
      studentsWithMedicalRecords,
      consultationsThisMonth,
      activeAlerts,
      emergencyCases,
      chronicConditionsCount,
      allergiesCount
    ] = await Promise.all([
      prisma.student.count({ where: { schoolId } }),
      prisma.medicalRecord.count({ where: { schoolId } }),
      prisma.healthConsultation.count({
        where: {
          schoolId,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.healthAlert.count({
        where: { schoolId, status: 'active' }
      }),
      prisma.healthConsultation.count({
        where: { schoolId, severity: 'urgent' }
      }),
      prisma.medicalRecord.count({
        where: {
          schoolId,
          chronicConditions: { not: '' }
        }
      }),
      prisma.medicalRecord.count({
        where: {
          schoolId,
          allergies: { not: '' }
        }
      })
    ]);

    const vaccinationRate = studentsWithMedicalRecords > 0 
      ? Math.round((await prisma.medicalRecord.count({
          where: {
            schoolId,
            vaccinationStatus: 'up_to_date'
          }
        })) / studentsWithMedicalRecords * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        studentsWithMedicalRecords,
        consultationsThisMonth,
        activeAlerts,
        vaccinationRate,
        emergencyCases,
        chronicConditionsCount,
        allergiesCount
      }
    });

  } catch (error) {
    logger.error('Get health stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

/**
 * @swagger
 * /api/health/students-with-conditions:
 *   get:
 *     summary: Récupérer les élèves avec conditions médicales
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/students-with-conditions', requirePermission('health:read'), async (req, res) => {
  try {
    const students = await prisma.medicalRecord.findMany({
      where: {
        schoolId: req.user.schoolId,
        OR: [
          { allergies: { not: '' } },
          { chronicConditions: { not: '' } }
        ]
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            educmasterNumber: true,
            class: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    logger.error('Get students with conditions error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des élèves avec conditions médicales'
    });
  }
});

/**
 * @swagger
 * /api/health/search:
 *   get:
 *     summary: Rechercher des dossiers médicaux
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
router.get('/search', requirePermission('health:read'), async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Paramètre de recherche requis'
      });
    }

    const students = await prisma.student.findMany({
      where: {
        schoolId: req.user.schoolId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { educmasterNumber: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        medicalRecord: true,
        class: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    logger.error('Search medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche'
    });
  }
});

module.exports = router;
