const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/planning:
 *   get:
 *     summary: Récupérer les plannings
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WEEKLY, MONTHLY, SEMESTER, ANNUAL]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, CANCELLED]
 *     responses:
 *       200:
 *         description: Liste des plannings
 */
router.get('/', requirePermission('planning:read'), async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;
    if (status) where.status = status;

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const plannings = await prisma.planning.findMany({
      where,
      include: {
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json({
      success: true,
      data: plannings
    });

  } catch (error) {
    logger.error('Get plannings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des plannings'
    });
  }
});

/**
 * @swagger
 * /api/planning:
 *   post:
 *     summary: Créer un nouveau planning
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - startDate
 *               - endDate
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [WEEKLY, MONTHLY, SEMESTER, ANNUAL]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED, CANCELLED]
 *                 default: DRAFT
 *     responses:
 *       201:
 *         description: Planning créé avec succès
 */
router.post('/', [
  requirePermission('planning:create'),
  body('type').isIn(['WEEKLY', 'MONTHLY', 'SEMESTER', 'ANNUAL'])
    .withMessage('Type de planning invalide'),
  body('startDate').isISO8601().withMessage('Date de début invalide'),
  body('endDate').isISO8601().withMessage('Date de fin invalide'),
  body('content').notEmpty().withMessage('Le contenu du planning est requis'),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'])
    .withMessage('Statut invalide')
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

    const planningData = req.body;
    planningData.schoolId = req.user.schoolId;

    // Vérifier que la date de fin est après la date de début
    if (new Date(planningData.startDate) >= new Date(planningData.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début'
      });
    }

    const planning = await prisma.planning.create({
      data: planningData
    });

    logger.info(`Planning created: ${planning.type} (${planning.id}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Planning créé avec succès',
      data: planning
    });

  } catch (error) {
    logger.error('Create planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du planning'
    });
  }
});

/**
 * @swagger
 * /api/planning/{id}:
 *   get:
 *     summary: Récupérer un planning par ID
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du planning
 */
router.get('/:id', requirePermission('planning:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const planning = await prisma.planning.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        notifications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Planning non trouvé'
      });
    }

    res.json({
      success: true,
      data: planning
    });

  } catch (error) {
    logger.error('Get planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du planning'
    });
  }
});

/**
 * @swagger
 * /api/planning/{id}:
 *   put:
 *     summary: Mettre à jour un planning
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Planning mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('planning:update'),
  body('startDate').optional().isISO8601().withMessage('Date de début invalide'),
  body('endDate').optional().isISO8601().withMessage('Date de fin invalide'),
  body('content').optional().notEmpty().withMessage('Le contenu ne peut pas être vide'),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'])
    .withMessage('Statut invalide')
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

    const { id } = req.params;
    const updateData = req.body;

    const existingPlanning = await prisma.planning.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingPlanning) {
      return res.status(404).json({
        success: false,
        message: 'Planning non trouvé'
      });
    }

    // Vérifier les dates si modifiées
    const startDate = updateData.startDate ? new Date(updateData.startDate) : existingPlanning.startDate;
    const endDate = updateData.endDate ? new Date(updateData.endDate) : existingPlanning.endDate;

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être après la date de début'
      });
    }

    const updatedPlanning = await prisma.planning.update({
      where: { id },
      data: updateData
    });

    logger.info(`Planning updated: ${updatedPlanning.type} (${id}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Planning mis à jour avec succès',
      data: updatedPlanning
    });

  } catch (error) {
    logger.error('Update planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du planning'
    });
  }
});

/**
 * @swagger
 * /api/planning/{id}/publish:
 *   post:
 *     summary: Publier un planning
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Planning publié avec succès
 */
router.post('/:id/publish', requirePermission('planning:update'), async (req, res) => {
  try {
    const { id } = req.params;

    const planning = await prisma.planning.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Planning non trouvé'
      });
    }

    if (planning.status === 'PUBLISHED') {
      return res.status(400).json({
        success: false,
        message: 'Ce planning est déjà publié'
      });
    }

    const updatedPlanning = await prisma.planning.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });

    // Créer une notification de publication
    await prisma.planningNotification.create({
      data: {
        planningId: id,
        type: 'UPDATE',
        content: `Le planning ${planning.type} a été publié`,
        status: 'PENDING'
      }
    });

    logger.info(`Planning published: ${planning.type} (${id}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Planning publié avec succès',
      data: updatedPlanning
    });

  } catch (error) {
    logger.error('Publish planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la publication du planning'
    });
  }
});

module.exports = router;