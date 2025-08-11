const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/absences:
 *   get:
 *     summary: Récupérer les absences
 *     tags: [Absences]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requirePermission('absence:read'), async (req, res) => {
  try {
    const { studentId, classId, startDate, endDate, status, type } = req.query;

    const where = {
      student: {
        schoolId: req.user.schoolId
      }
    };

    if (studentId) where.studentId = studentId;
    if (classId) where.student.classId = classId;
    if (status) where.status = status;
    if (type) where.type = type;

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const absences = await prisma.absence.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: {
              select: {
                name: true,
                grade: true
              }
            }
          }
        },
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: absences
    });

  } catch (error) {
    logger.error('Get absences error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des absences'
    });
  }
});

/**
 * @swagger
 * /api/absences:
 *   post:
 *     summary: Créer une nouvelle absence
 *     tags: [Absences]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('absence:create'),
  body('studentId').isUUID().withMessage('ID élève invalide'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('type').isIn(['JUSTIFIED', 'UNJUSTIFIED', 'ABSENT', 'EXCUSED']).withMessage('Type d\'absence invalide'),
  body('reason').optional().isString()
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

    const absenceData = req.body;

    // Vérifier que l'élève appartient à l'école
    const student = await prisma.student.findFirst({
      where: {
        id: absenceData.studentId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé dans cette école'
      });
    }

    const absence = await prisma.absence.create({
      data: {
        ...absenceData,
        date: new Date(absenceData.date),
        status: 'PENDING'
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            class: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    logger.info(`Absence created for student ${absence.student.firstName} ${absence.student.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Absence créée avec succès',
      data: absence
    });

  } catch (error) {
    logger.error('Create absence error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'absence'
    });
  }
});

module.exports = router;