const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Récupérer les salles
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requirePermission('room:read'), async (req, res) => {
  try {
    const { type, available } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        schedules: {
          include: {
            class: {
              select: {
                name: true
              }
            },
            subject: {
              select: {
                name: true
              }
            }
          }
        },
        reservations: {
          where: {
            status: 'APPROVED'
          }
        },
        _count: {
          select: {
            schedules: true,
            reservations: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: rooms
    });

  } catch (error) {
    logger.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des salles'
    });
  }
});

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Créer une nouvelle salle
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('room:create'),
  body('name').notEmpty().withMessage('Le nom de la salle est requis'),
  body('type').isIn(['SALLE', 'LABO', 'BIBLIOTHEQUE', 'AMPHITHEATRE', 'GYMNASE'])
    .withMessage('Type de salle invalide'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacité invalide')
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

    const roomData = {
      ...req.body,
      schoolId: req.user.schoolId
    };

    // Vérifier l'unicité du nom
    const existingRoom = await prisma.room.findFirst({
      where: {
        schoolId: req.user.schoolId,
        name: roomData.name
      }
    });

    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Une salle avec ce nom existe déjà'
      });
    }

    const room = await prisma.room.create({
      data: roomData
    });

    logger.info(`Room created: ${room.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Salle créée avec succès',
      data: room
    });

  } catch (error) {
    logger.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la salle'
    });
  }
});

/**
 * @swagger
 * /api/rooms/{id}/reservations:
 *   post:
 *     summary: Réserver une salle
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reservations', [
  requirePermission('room:reserve'),
  body('startTime').isISO8601().withMessage('Heure de début invalide'),
  body('endTime').isISO8601().withMessage('Heure de fin invalide'),
  body('purpose').notEmpty().withMessage('Le motif de réservation est requis')
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
    const { startTime, endTime, purpose } = req.body;

    // Vérifier que la salle existe
    const room = await prisma.room.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle non trouvée'
      });
    }

    // Vérifier les conflits de réservation
    const conflict = await prisma.roomReservation.findFirst({
      where: {
        roomId: id,
        status: 'APPROVED',
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } }
            ]
          }
        ]
      }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Conflit de réservation détecté'
      });
    }

    const reservation = await prisma.roomReservation.create({
      data: {
        roomId: id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        purpose,
        createdBy: req.user.id,
        status: 'PENDING'
      },
      include: {
        room: {
          select: {
            name: true,
            type: true
          }
        }
      }
    });

    logger.info(`Room reservation created: ${room.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: reservation
    });

  } catch (error) {
    logger.error('Create room reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation'
    });
  }
});

module.exports = router;