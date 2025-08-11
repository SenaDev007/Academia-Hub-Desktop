const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/exams:
 *   get:
 *     summary: Récupérer les sessions d'examens
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED]
 *     responses:
 *       200:
 *         description: Liste des sessions d'examens
 */
router.get('/', requirePermission('exam:read'), async (req, res) => {
  try {
    const { type, classId, status, teacherId } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;
    if (classId) where.classId = classId;
    if (status) where.status = status;
    if (teacherId) where.teacherId = teacherId;

    const examSessions = await prisma.examSession.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            coefficient: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            section: true
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
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json({
      success: true,
      data: examSessions
    });

  } catch (error) {
    logger.error('Get exam sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions d\'examens'
    });
  }
});

/**
 * @swagger
 * /api/exams:
 *   post:
 *     summary: Créer une nouvelle session d'examen
 *     tags: [Exams]
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
 *               - subjectId
 *               - classId
 *               - teacherId
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type d'examen (EM1, EM2, EC, IE1, IE2, DS1, DS2)
 *               subjectId:
 *                 type: string
 *               classId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Session d'examen créée avec succès
 */
router.post('/', [
  requirePermission('exam:create'),
  body('type').notEmpty().withMessage('Le type d\'examen est requis'),
  body('subjectId').isUUID().withMessage('ID de matière invalide'),
  body('classId').isUUID().withMessage('ID de classe invalide'),
  body('teacherId').isUUID().withMessage('ID d\'enseignant invalide'),
  body('date').isISO8601().withMessage('Date invalide')
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

    const examData = req.body;
    examData.schoolId = req.user.schoolId;

    // Vérifier que la classe appartient à l'école
    const classExists = await prisma.class.findFirst({
      where: {
        id: examData.classId,
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
        id: examData.subjectId,
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
        id: examData.teacherId,
        schoolId: req.user.schoolId
      }
    });

    if (!teacherExists) {
      return res.status(400).json({
        success: false,
        message: 'Enseignant non trouvé dans cette école'
      });
    }

    // Vérifier qu'il n'y a pas déjà un examen du même type pour cette matière et cette classe
    const existingExam = await prisma.examSession.findFirst({
      where: {
        schoolId: req.user.schoolId,
        type: examData.type,
        subjectId: examData.subjectId,
        classId: examData.classId,
        status: { in: ['PENDING', 'ACTIVE'] }
      }
    });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: 'Un examen de ce type existe déjà pour cette matière et cette classe'
      });
    }

    const examSession = await prisma.examSession.create({
      data: examData,
      include: {
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        class: {
          select: {
            name: true,
            grade: true,
            section: true
          }
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Créer une notification pour la session d'examen
    await prisma.examSessionNotification.create({
      data: {
        examSessionId: examSession.id,
        type: 'IN_APP',
        content: `Nouvel examen programmé: ${examSession.type} - ${examSession.subject.name} pour la classe ${examSession.class.name}`,
        status: 'PENDING'
      }
    });

    logger.info(`Exam session created: ${examSession.type} - ${examSession.subject.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Session d\'examen créée avec succès',
      data: examSession
    });

  } catch (error) {
    logger.error('Create exam session error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session d\'examen'
    });
  }
});

/**
 * @swagger
 * /api/exams/{id}:
 *   get:
 *     summary: Récupérer une session d'examen par ID
 *     tags: [Exams]
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
 *         description: Détails de la session d'examen
 */
router.get('/:id', requirePermission('exam:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const examSession = await prisma.examSession.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        subject: true,
        class: {
          include: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                educmasterNumber: true,
                grades: {
                  where: {
                    subjectId: req.body.subjectId,
                    type: req.body.type
                  }
                }
              }
            }
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
        notifications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!examSession) {
      return res.status(404).json({
        success: false,
        message: 'Session d\'examen non trouvée'
      });
    }

    res.json({
      success: true,
      data: examSession
    });

  } catch (error) {
    logger.error('Get exam session error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la session d\'examen'
    });
  }
});

/**
 * @swagger
 * /api/exams/{id}:
 *   put:
 *     summary: Mettre à jour une session d'examen
 *     tags: [Exams]
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
 *         description: Session d'examen mise à jour avec succès
 */
router.put('/:id', [
  requirePermission('exam:update'),
  body('date').optional().isISO8601().withMessage('Date invalide'),
  body('status').optional().isIn(['PENDING', 'ACTIVE', 'COMPLETED'])
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

    const existingExam = await prisma.examSession.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: 'Session d\'examen non trouvée'
      });
    }

    const updatedExam = await prisma.examSession.update({
      where: { id },
      data: updateData,
      include: {
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        class: {
          select: {
            name: true,
            grade: true,
            section: true
          }
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Créer une notification de mise à jour si le statut change
    if (updateData.status && updateData.status !== existingExam.status) {
      await prisma.examSessionNotification.create({
        data: {
          examSessionId: id,
          type: 'IN_APP',
          content: `Statut de l'examen mis à jour: ${updatedExam.type} - ${updatedExam.subject.name} (${updateData.status})`,
          status: 'PENDING'
        }
      });
    }

    logger.info(`Exam session updated: ${updatedExam.type} - ${updatedExam.subject.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Session d\'examen mise à jour avec succès',
      data: updatedExam
    });

  } catch (error) {
    logger.error('Update exam session error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la session d\'examen'
    });
  }
});

/**
 * @swagger
 * /api/exams/{id}/complete:
 *   post:
 *     summary: Marquer une session d'examen comme terminée
 *     tags: [Exams]
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
 *         description: Session d'examen marquée comme terminée
 */
router.post('/:id/complete', requirePermission('exam:update'), async (req, res) => {
  try {
    const { id } = req.params;

    const examSession = await prisma.examSession.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } }
      }
    });

    if (!examSession) {
      return res.status(404).json({
        success: false,
        message: 'Session d\'examen non trouvée'
      });
    }

    if (examSession.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Cette session d\'examen est déjà terminée'
      });
    }

    const updatedExam = await prisma.examSession.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // Créer une notification de fin d'examen
    await prisma.examSessionNotification.create({
      data: {
        examSessionId: id,
        type: 'IN_APP',
        content: `Examen terminé: ${examSession.type} - ${examSession.subject.name} pour la classe ${examSession.class.name}`,
        status: 'PENDING'
      }
    });

    logger.info(`Exam session completed: ${examSession.type} - ${examSession.subject.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Session d\'examen marquée comme terminée',
      data: updatedExam
    });

  } catch (error) {
    logger.error('Complete exam session error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la finalisation de la session d\'examen'
    });
  }
});

module.exports = router;