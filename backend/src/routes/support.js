const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/support/tickets:
 *   get:
 *     summary: Récupérer les tickets de support
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 */
router.get('/tickets', requirePermission('support:read'), async (req, res) => {
  try {
    const { status, priority, type } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;

    // Si l'utilisateur n'est pas admin, ne voir que ses tickets
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      where.userId = req.user.id;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            messages: true,
            attachments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    logger.error('Get support tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tickets'
    });
  }
});

/**
 * @swagger
 * /api/support/tickets:
 *   post:
 *     summary: Créer un nouveau ticket de support
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 */
router.post('/tickets', [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('type').isIn(['technical', 'billing', 'general', 'other']).withMessage('Type invalide'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priorité invalide')
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

    const ticketData = {
      ...req.body,
      userId: req.user.id,
      schoolId: req.user.schoolId,
      status: 'open'
    };

    const ticket = await prisma.supportTicket.create({
      data: ticketData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    logger.info(`Support ticket created: ${ticket.title} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Ticket de support créé avec succès',
      data: ticket
    });

  } catch (error) {
    logger.error('Create support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket'
    });
  }
});

module.exports = router;