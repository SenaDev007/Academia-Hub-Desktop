const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Récupérer la liste des enseignants
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des enseignants
 */
router.get('/', requirePermission('teacher:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      schoolId: req.user.schoolId
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              status: true,
              lastLoginAt: true
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
          _count: {
            select: {
              schedules: true,
              grades: true,
              cahierJournals: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ]
      }),
      prisma.teacher.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        teachers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des enseignants'
    });
  }
});

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Créer un nouvel enseignant
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               salary:
 *                 type: number
 *               hireDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Enseignant créé avec succès
 */
router.post('/', [
  requirePermission('teacher:create'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('employeeId').optional().isString(),
  body('salary').optional().isNumeric().withMessage('Le salaire doit être un nombre'),
  body('hireDate').optional().isISO8601().withMessage('Date d\'embauche invalide')
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

    const teacherData = req.body;
    teacherData.schoolId = req.user.schoolId;

    // Vérifier l'unicité de l'employeeId
    if (teacherData.employeeId) {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          schoolId: req.user.schoolId,
          employeeId: teacherData.employeeId
        }
      });

      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Cet ID employé est déjà utilisé'
        });
      }
    }

    // Vérifier l'unicité de l'email
    const existingUser = await prisma.user.findUnique({
      where: { email: teacherData.email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur pour l'enseignant
      const user = await tx.user.create({
        data: {
          schoolId: req.user.schoolId,
          email: teacherData.email,
          passwordHash: await bcrypt.hash('password123', 12), // Mot de passe par défaut
          role: 'TEACHER',
          status: 'active',
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          phone: teacherData.phone
        }
      });

      // Créer l'enseignant
      const teacher = await tx.teacher.create({
        data: {
          ...teacherData,
          userId: user.id
        },
        include: {
          user: {
            select: {
              email: true,
              status: true
            }
          }
        }
      });

      return teacher;
    });

    logger.info(`Teacher created: ${result.firstName} ${result.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Enseignant créé avec succès',
      data: result
    });

  } catch (error) {
    logger.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'enseignant'
    });
  }
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Récupérer un enseignant par ID
 *     tags: [Teachers]
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
 *         description: Détails de l'enseignant
 */
router.get('/:id', requirePermission('teacher:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        user: {
          select: {
            email: true,
            status: true,
            lastLoginAt: true
          }
        },
        class: {
          include: {
            _count: {
              select: {
                students: true
              }
            }
          }
        },
        schedules: {
          include: {
            subject: true,
            class: true,
            room: true
          },
          orderBy: [
            { day: 'asc' },
            { startTime: 'asc' }
          ]
        },
        grades: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            subject: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        cahierJournals: {
          include: {
            class: true,
            subject: true
          },
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    res.json({
      success: true,
      data: teacher
    });

  } catch (error) {
    logger.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'enseignant'
    });
  }
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Mettre à jour un enseignant
 *     tags: [Teachers]
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
 *         description: Enseignant mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('teacher:update'),
  body('firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('salary').optional().isNumeric().withMessage('Le salaire doit être un nombre')
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

    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    // Vérifier l'unicité de l'employeeId si modifié
    if (updateData.employeeId && updateData.employeeId !== existingTeacher.employeeId) {
      const duplicateTeacher = await prisma.teacher.findFirst({
        where: {
          schoolId: req.user.schoolId,
          employeeId: updateData.employeeId,
          id: { not: id }
        }
      });

      if (duplicateTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Cet ID employé est déjà utilisé'
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'utilisateur si nécessaire
      if (updateData.firstName || updateData.lastName || updateData.email || updateData.phone) {
        await tx.user.update({
          where: { id: existingTeacher.userId },
          data: {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            phone: updateData.phone
          }
        });
      }

      // Mettre à jour l'enseignant
      const teacher = await tx.teacher.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              email: true,
              status: true
            }
          }
        }
      });

      return teacher;
    });

    logger.info(`Teacher updated: ${result.firstName} ${result.lastName} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Enseignant mis à jour avec succès',
      data: result
    });

  } catch (error) {
    logger.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'enseignant'
    });
  }
});

/**
 * @swagger
 * /api/teachers/{id}/schedule:
 *   get:
 *     summary: Récupérer l'emploi du temps d'un enseignant
 *     tags: [Teachers]
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
 *         description: Emploi du temps de l'enseignant
 */
router.get('/:id/schedule', requirePermission('schedule:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    const schedule = await prisma.schedule.findMany({
      where: {
        teacherId: id,
        isActive: true
      },
      include: {
        subject: true,
        class: true,
        room: true
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

    schedule.forEach(entry => {
      if (weekSchedule[entry.day]) {
        weekSchedule[entry.day].push(entry);
      }
    });

    res.json({
      success: true,
      data: {
        teacher: {
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName
        },
        schedule: weekSchedule
      }
    });

  } catch (error) {
    logger.error('Get teacher schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'emploi du temps'
    });
  }
});

module.exports = router;