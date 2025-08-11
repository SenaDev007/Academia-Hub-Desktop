const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/cahier-journal:
 *   get:
 *     summary: Récupérer les entrées du cahier journal
 *     tags: [Cahier Journal]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requirePermission('cahier_journal:read'), async (req, res) => {
  try {
    const { classId, subjectId, startDate, endDate, status } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    if (status) where.status = status;

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const entries = await prisma.cahierJournalEntry.findMany({
      where,
      include: {
        class: {
          select: {
            name: true,
            grade: true,
            section: true
          }
        },
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        validatedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        template: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: entries
    });

  } catch (error) {
    logger.error('Get cahier journal entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des entrées du cahier journal'
    });
  }
});

/**
 * @swagger
 * /api/cahier-journal:
 *   post:
 *     summary: Créer une nouvelle entrée de cahier journal
 *     tags: [Cahier Journal]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('cahier_journal:create'),
  body('classId').isUUID().withMessage('ID classe invalide'),
  body('subjectId').isUUID().withMessage('ID matière invalide'),
  body('date').isISO8601().withMessage('Date invalide'),
  body('duree').isInt({ min: 1 }).withMessage('Durée invalide'),
  body('objectifs').notEmpty().withMessage('Les objectifs sont requis'),
  body('deroulement').notEmpty().withMessage('Le déroulement est requis')
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

    const entryData = {
      ...req.body,
      schoolId: req.user.schoolId,
      createdById: req.user.id,
      date: new Date(req.body.date)
    };

    // Vérifier que la classe appartient à l'école
    const classExists = await prisma.class.findFirst({
      where: {
        id: entryData.classId,
        schoolId: req.user.schoolId
      }
    });

    if (!classExists) {
      return res.status(400).json({
        success: false,
        message: 'Classe non trouvée dans cette école'
      });
    }

    // Vérifier que la matière appartient à l'école
    const subjectExists = await prisma.subject.findFirst({
      where: {
        id: entryData.subjectId,
        schoolId: req.user.schoolId
      }
    });

    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        message: 'Matière non trouvée dans cette école'
      });
    }

    const entry = await prisma.cahierJournalEntry.create({
      data: entryData,
      include: {
        class: {
          select: {
            name: true,
            grade: true
          }
        },
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    logger.info(`Cahier journal entry created for class ${entry.class.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Entrée de cahier journal créée avec succès',
      data: entry
    });

  } catch (error) {
    logger.error('Create cahier journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'entrée'
    });
  }
});

/**
 * @swagger
 * /api/cahier-journal/{id}/validate:
 *   post:
 *     summary: Valider une entrée de cahier journal
 *     tags: [Cahier Journal]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/validate', requirePermission('cahier_journal:validate'), async (req, res) => {
  try {
    const { id } = req.params;
    const { observations } = req.body;

    const entry = await prisma.cahierJournalEntry.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée non trouvée'
      });
    }

    const updatedEntry = await prisma.cahierJournalEntry.update({
      where: { id },
      data: {
        status: 'VALIDATED',
        validatedById: req.user.id,
        observations
      }
    });

    // Créer un historique
    await prisma.cahierJournalHistory.create({
      data: {
        entryId: id,
        action: 'validated',
        userId: req.user.id,
        schoolId: req.user.schoolId,
        reason: 'Validation par le responsable'
      }
    });

    logger.info(`Cahier journal entry validated: ${id} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Entrée validée avec succès',
      data: updatedEntry
    });

  } catch (error) {
    logger.error('Validate cahier journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation'
    });
  }
});

module.exports = router;