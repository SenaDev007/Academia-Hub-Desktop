const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Récupérer les notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SENT, READ, FAILED, CANCELLED]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [system, reminder, update, alert]
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get('/', requirePermission('notification:read'), async (req, res) => {
  try {
    const { status, type, targetRole } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (targetRole) where.targetRole = targetRole;

    // Filtrer par rôle si l'utilisateur n'est pas admin
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      where.OR = [
        { targetRole: req.user.role },
        { targetRole: null } // Notifications générales
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50 // Limiter à 50 notifications récentes
    });

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications'
    });
  }
});

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Créer une nouvelle notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [system, reminder, update, alert]
 *                 default: system
 *               targetRole:
 *                 type: string
 *                 enum: [TEACHER, STUDENT, PARENT, SECRETARY, ACCOUNTANT]
 *     responses:
 *       201:
 *         description: Notification créée avec succès
 */
router.post('/', [
  requirePermission('notification:create'),
  body('title').notEmpty().withMessage('Le titre de la notification est requis'),
  body('content').notEmpty().withMessage('Le contenu de la notification est requis'),
  body('type').optional().isIn(['system', 'reminder', 'update', 'alert'])
    .withMessage('Type de notification invalide'),
  body('targetRole').optional().isIn(['TEACHER', 'STUDENT', 'PARENT', 'SECRETARY', 'ACCOUNTANT'])
    .withMessage('Rôle cible invalide')
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

    const notificationData = req.body;
    notificationData.schoolId = req.user.schoolId;

    const notification = await prisma.notification.create({
      data: notificationData
    });

    logger.info(`Notification created: ${notification.title} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Notification créée avec succès',
      data: notification
    });

  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la notification'
    });
  }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Récupérer une notification par ID
 *     tags: [Notifications]
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
 *         description: Détails de la notification
 */
router.get('/:id', requirePermission('notification:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier les permissions de lecture selon le rôle
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      if (notification.targetRole && notification.targetRole !== req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette notification'
        });
      }
    }

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    logger.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la notification'
    });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   post:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
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
 *         description: Notification marquée comme lue
 */
router.post('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier les permissions selon le rôle
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      if (notification.targetRole && notification.targetRole !== req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette notification'
        });
      }
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { status: 'READ' }
    });

    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      data: updatedNotification
    });

  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la notification'
    });
  }
});

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   post:
 *     summary: Marquer toutes les notifications comme lues
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 */
router.post('/mark-all-read', async (req, res) => {
  try {
    const where = {
      schoolId: req.user.schoolId,
      status: { in: ['PENDING', 'SENT'] }
    };

    // Filtrer par rôle si l'utilisateur n'est pas admin
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      where.OR = [
        { targetRole: req.user.role },
        { targetRole: null }
      ];
    }

    const result = await prisma.notification.updateMany({
      where,
      data: { status: 'READ' }
    });

    logger.info(`${result.count} notifications marked as read by user ${req.user.id}`);

    res.json({
      success: true,
      message: `${result.count} notifications marquées comme lues`,
      data: { count: result.count }
    });

  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des notifications'
    });
  }
});

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Récupérer le nombre de notifications non lues
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de notifications non lues
 */
router.get('/unread-count', async (req, res) => {
  try {
    const where = {
      schoolId: req.user.schoolId,
      status: { in: ['PENDING', 'SENT'] }
    };

    // Filtrer par rôle si l'utilisateur n'est pas admin
    if (!['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(req.user.role)) {
      where.OR = [
        { targetRole: req.user.role },
        { targetRole: null }
      ];
    }

    const count = await prisma.notification.count({ where });

    res.json({
      success: true,
      data: { unreadCount: count }
    });

  } catch (error) {
    logger.error('Get unread notifications count error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des notifications'
    });
  }
});

module.exports = router;