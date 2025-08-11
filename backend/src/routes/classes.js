const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Récupérer la liste des classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des classes
 */
router.get('/', requirePermission('class:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, grade, isActive } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      schoolId: req.user.schoolId
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { grade: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (grade) {
      where.grade = grade;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              students: true,
              schedules: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [
          { grade: 'asc' },
          { section: 'asc' },
          { name: 'asc' }
        ]
      }),
      prisma.class.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        classes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des classes'
    });
  }
});

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Créer une nouvelle classe
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - grade
 *               - academicYear
 *             properties:
 *               name:
 *                 type: string
 *               grade:
 *                 type: string
 *               section:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               teacherId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Classe créée avec succès
 */
router.post('/', [
  requirePermission('class:create'),
  body('name').notEmpty().withMessage('Le nom de la classe est requis'),
  body('grade').notEmpty().withMessage('Le niveau est requis'),
  body('academicYear').matches(/^\d{4}-\d{4}$/).withMessage('Format d\'année académique invalide'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('La capacité doit être un nombre positif'),
  body('teacherId').optional().isUUID().withMessage('ID enseignant invalide')
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

    const classData = req.body;
    classData.schoolId = req.user.schoolId;

    // Vérifier l'unicité du nom de classe pour l'année académique
    const existingClass = await prisma.class.findFirst({
      where: {
        schoolId: req.user.schoolId,
        name: classData.name,
        academicYear: classData.academicYear
      }
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Une classe avec ce nom existe déjà pour cette année académique'
      });
    }

    // Vérifier que l'enseignant appartient à l'école si spécifié
    if (classData.teacherId) {
      const teacher = await prisma.teacher.findFirst({
        where: {
          id: classData.teacherId,
          schoolId: req.user.schoolId
        }
      });

      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: 'Enseignant non trouvé dans cette école'
        });
      }

      // Vérifier que l'enseignant n'est pas déjà titulaire d'une autre classe
      const existingAssignment = await prisma.class.findFirst({
        where: {
          teacherId: classData.teacherId,
          isActive: true,
          id: { not: undefined }
        }
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Cet enseignant est déjà titulaire d\'une autre classe'
        });
      }
    }

    const newClass = await prisma.class.create({
      data: classData,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    logger.info(`Class created: ${newClass.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Classe créée avec succès',
      data: newClass
    });

  } catch (error) {
    logger.error('Create class error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la classe'
    });
  }
});

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Récupérer une classe par ID
 *     tags: [Classes]
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
 *         description: Détails de la classe
 */
router.get('/:id', requirePermission('class:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            educmasterNumber: true,
            status: true,
            enrollmentDate: true
          },
          orderBy: [
            { lastName: 'asc' },
            { firstName: 'asc' }
          ]
        },
        schedules: {
          include: {
            subject: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            room: true
          },
          orderBy: [
            { day: 'asc' },
            { startTime: 'asc' }
          ]
        },
        _count: {
          select: {
            students: true,
            schedules: true,
            absences: true,
            cahierJournals: true
          }
        }
      }
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    res.json({
      success: true,
      data: classData
    });

  } catch (error) {
    logger.error('Get class error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la classe'
    });
  }
});

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Mettre à jour une classe
 *     tags: [Classes]
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
 *         description: Classe mise à jour avec succès
 */
router.put('/:id', [
  requirePermission('class:update'),
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('La capacité doit être un nombre positif'),
  body('teacherId').optional().isUUID().withMessage('ID enseignant invalide')
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

    const existingClass = await prisma.class.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Vérifier l'unicité du nom si modifié
    if (updateData.name && updateData.name !== existingClass.name) {
      const duplicateClass = await prisma.class.findFirst({
        where: {
          schoolId: req.user.schoolId,
          name: updateData.name,
          academicYear: existingClass.academicYear,
          id: { not: id }
        }
      });

      if (duplicateClass) {
        return res.status(400).json({
          success: false,
          message: 'Une classe avec ce nom existe déjà pour cette année académique'
        });
      }
    }

    // Vérifier l'enseignant si modifié
    if (updateData.teacherId && updateData.teacherId !== existingClass.teacherId) {
      if (updateData.teacherId) {
        const teacher = await prisma.teacher.findFirst({
          where: {
            id: updateData.teacherId,
            schoolId: req.user.schoolId
          }
        });

        if (!teacher) {
          return res.status(400).json({
            success: false,
            message: 'Enseignant non trouvé dans cette école'
          });
        }

        // Vérifier que l'enseignant n'est pas déjà titulaire d'une autre classe
        const existingAssignment = await prisma.class.findFirst({
          where: {
            teacherId: updateData.teacherId,
            isActive: true,
            id: { not: id }
          }
        });

        if (existingAssignment) {
          return res.status(400).json({
            success: false,
            message: 'Cet enseignant est déjà titulaire d\'une autre classe'
          });
        }
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    logger.info(`Class updated: ${updatedClass.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Classe mise à jour avec succès',
      data: updatedClass
    });

  } catch (error) {
    logger.error('Update class error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la classe'
    });
  }
});

/**
 * @swagger
 * /api/classes/{id}/students:
 *   get:
 *     summary: Récupérer les élèves d'une classe
 *     tags: [Classes]
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
 *         description: Liste des élèves de la classe
 */
router.get('/:id/students', requirePermission('student:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    const students = await prisma.student.findMany({
      where: {
        classId: id
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        educmasterNumber: true,
        email: true,
        phone: true,
        birthDate: true,
        gender: true,
        status: true,
        enrollmentDate: true,
        parent: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        },
        _count: {
          select: {
            grades: true,
            absences: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: {
        class: {
          id: classData.id,
          name: classData.name,
          grade: classData.grade,
          section: classData.section
        },
        students,
        total: students.length
      }
    });

  } catch (error) {
    logger.error('Get class students error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des élèves'
    });
  }
});

module.exports = router;