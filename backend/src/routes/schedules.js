const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Récupérer les emplois du temps
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: string
 *       - in: query
 *         name: day
 *         schema:
 *           type: string
 *           enum: [LUNDI, MARDI, MERCREDI, JEUDI, VENDREDI, SAMEDI]
 *     responses:
 *       200:
 *         description: Emplois du temps
 */
router.get('/', requirePermission('schedule:read'), async (req, res) => {
  try {
    const { classId, teacherId, day, roomId } = req.query;

    const where = {
      schoolId: req.user.schoolId,
      isActive: true
    };

    if (classId) where.classId = classId;
    if (teacherId) where.teacherId = teacherId;
    if (day) where.day = day;
    if (roomId) where.roomId = roomId;

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            section: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            coefficient: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
            capacity: true
          }
        }
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ]
    });

    // Organiser par jour de la semaine
    const weekSchedule = {
      LUNDI: [],
      MARDI: [],
      MERCREDI: [],
      JEUDI: [],
      VENDREDI: [],
      SAMEDI: []
    };

    schedules.forEach(schedule => {
      if (weekSchedule[schedule.day]) {
        weekSchedule[schedule.day].push(schedule);
      }
    });

    res.json({
      success: true,
      data: {
        schedules,
        weekSchedule
      }
    });

  } catch (error) {
    logger.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des emplois du temps'
    });
  }
});

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Créer un créneau d'emploi du temps
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - subjectId
 *               - teacherId
 *               - day
 *               - startTime
 *               - endTime
 *             properties:
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               day:
 *                 type: string
 *                 enum: [LUNDI, MARDI, MERCREDI, JEUDI, VENDREDI, SAMEDI]
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: Créneau créé avec succès
 */
router.post('/', [
  requirePermission('schedule:create'),
  body('classId').isUUID().withMessage('ID de classe invalide'),
  body('subjectId').isUUID().withMessage('ID de matière invalide'),
  body('teacherId').isUUID().withMessage('ID d\'enseignant invalide'),
  body('day').isIn(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'])
    .withMessage('Jour invalide'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de début invalide (format HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide (format HH:MM)'),
  body('roomId').optional().isUUID().withMessage('ID de salle invalide')
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

    const scheduleData = req.body;
    scheduleData.schoolId = req.user.schoolId;

    // Vérifier que l'heure de fin est après l'heure de début
    if (scheduleData.startTime >= scheduleData.endTime) {
      return res.status(400).json({
        success: false,
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    // Vérifier que la classe appartient à l'école
    const classExists = await prisma.class.findFirst({
      where: {
        id: scheduleData.classId,
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
        id: scheduleData.subjectId,
        schoolId: req.user.schoolId
      }
    });

    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        message: 'Matière non trouvée dans cette école'
      });
    }

    // Vérifier que l'enseignant appartient à l'école
    const teacherExists = await prisma.teacher.findFirst({
      where: {
        id: scheduleData.teacherId,
        schoolId: req.user.schoolId
      }
    });

    if (!teacherExists) {
      return res.status(400).json({
        success: false,
        message: 'Enseignant non trouvé dans cette école'
      });
    }

    // Vérifier les conflits d'horaires pour la classe
    const classConflict = await prisma.schedule.findFirst({
      where: {
        schoolId: req.user.schoolId,
        classId: scheduleData.classId,
        day: scheduleData.day,
        isActive: true,
        OR: [
          {
            AND: [
              { startTime: { lte: scheduleData.startTime } },
              { endTime: { gt: scheduleData.startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: scheduleData.endTime } },
              { endTime: { gte: scheduleData.endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: scheduleData.startTime } },
              { endTime: { lte: scheduleData.endTime } }
            ]
          }
        ]
      }
    });

    if (classConflict) {
      return res.status(400).json({
        success: false,
        message: 'Conflit d\'horaire détecté pour cette classe'
      });
    }

    // Vérifier les conflits d'horaires pour l'enseignant
    const teacherConflict = await prisma.schedule.findFirst({
      where: {
        schoolId: req.user.schoolId,
        teacherId: scheduleData.teacherId,
        day: scheduleData.day,
        isActive: true,
        OR: [
          {
            AND: [
              { startTime: { lte: scheduleData.startTime } },
              { endTime: { gt: scheduleData.startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: scheduleData.endTime } },
              { endTime: { gte: scheduleData.endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: scheduleData.startTime } },
              { endTime: { lte: scheduleData.endTime } }
            ]
          }
        ]
      }
    });

    if (teacherConflict) {
      return res.status(400).json({
        success: false,
        message: 'Conflit d\'horaire détecté pour cet enseignant'
      });
    }

    // Vérifier les conflits pour la salle si spécifiée
    if (scheduleData.roomId) {
      const roomConflict = await prisma.schedule.findFirst({
        where: {
          schoolId: req.user.schoolId,
          roomId: scheduleData.roomId,
          day: scheduleData.day,
          isActive: true,
          OR: [
            {
              AND: [
                { startTime: { lte: scheduleData.startTime } },
                { endTime: { gt: scheduleData.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: scheduleData.endTime } },
                { endTime: { gte: scheduleData.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: scheduleData.startTime } },
                { endTime: { lte: scheduleData.endTime } }
              ]
            }
          ]
        }
      });

      if (roomConflict) {
        return res.status(400).json({
          success: false,
          message: 'Conflit d\'horaire détecté pour cette salle'
        });
      }
    }

    const schedule = await prisma.schedule.create({
      data: scheduleData,
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
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        room: {
          select: {
            name: true,
            type: true
          }
        }
      }
    });

    logger.info(`Schedule created: ${schedule.class.name} - ${schedule.subject.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Créneau d\'emploi du temps créé avec succès',
      data: schedule
    });

  } catch (error) {
    logger.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du créneau'
    });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Mettre à jour un créneau d'emploi du temps
 *     tags: [Schedules]
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
 *         description: Créneau mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('schedule:update'),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de début invalide (format HH:MM)'),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de fin invalide (format HH:MM)')
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

    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }

    // Vérifier que l'heure de fin est après l'heure de début
    const startTime = updateData.startTime || existingSchedule.startTime;
    const endTime = updateData.endTime || existingSchedule.endTime;

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: updateData,
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
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        room: {
          select: {
            name: true,
            type: true
          }
        }
      }
    });

    logger.info(`Schedule updated: ${updatedSchedule.class.name} - ${updatedSchedule.subject.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Créneau mis à jour avec succès',
      data: updatedSchedule
    });

  } catch (error) {
    logger.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du créneau'
    });
  }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Supprimer un créneau d'emploi du temps
 *     tags: [Schedules]
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
 *         description: Créneau supprimé avec succès
 */
router.delete('/:id', requirePermission('schedule:delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }

    await prisma.schedule.delete({
      where: { id }
    });

    logger.info(`Schedule deleted: ${id} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Créneau supprimé avec succès'
    });

  } catch (error) {
    logger.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du créneau'
    });
  }
});

module.exports = router;