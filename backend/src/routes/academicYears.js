const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/academic-years:
 *   get:
 *     summary: Récupérer les années académiques
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des années académiques
 */
router.get('/', requirePermission('academic:read'), async (req, res) => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      where: {
        schoolId: req.user.schoolId
      },
      include: {
        trimesters: {
          orderBy: { number: 'asc' }
        },
        sessions: {
          include: {
            _count: {
              select: { grades: true }
            }
          }
        },
        calendar: true
      },
      orderBy: { startDate: 'desc' }
    });

    res.json({
      success: true,
      data: academicYears
    });

  } catch (error) {
    logger.error('Get academic years error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des années académiques'
    });
  }
});

/**
 * @swagger
 * /api/academic-years:
 *   post:
 *     summary: Créer une nouvelle année académique
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('academic:create'),
  body('name').notEmpty().withMessage('Le nom de l\'année académique est requis'),
  body('startDate').isISO8601().withMessage('Date de début invalide'),
  body('endDate').isISO8601().withMessage('Date de fin invalide')
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

    const { name, startDate, endDate, calendarId } = req.body;

    // Vérifier que la date de fin est après la date de début
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début'
      });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schoolId: req.user.schoolId,
        calendarId
      },
      include: {
        calendar: true
      }
    });

    // Créer automatiquement les 3 trimestres
    const trimesters = [];
    const yearStart = new Date(startDate);
    const yearEnd = new Date(endDate);
    const yearDuration = yearEnd.getTime() - yearStart.getTime();
    const trimesterDuration = yearDuration / 3;

    for (let i = 1; i <= 3; i++) {
      const trimesterStart = new Date(yearStart.getTime() + (i - 1) * trimesterDuration);
      const trimesterEnd = new Date(yearStart.getTime() + i * trimesterDuration);

      const trimester = await prisma.academicTrimester.create({
        data: {
          number: i,
          startDate: trimesterStart,
          endDate: trimesterEnd,
          yearId: academicYear.id
        }
      });

      trimesters.push(trimester);
    }

    logger.info(`Academic year created: ${academicYear.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Année académique créée avec succès',
      data: {
        ...academicYear,
        trimesters
      }
    });

  } catch (error) {
    logger.error('Create academic year error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'année académique'
    });
  }
});

module.exports = router;