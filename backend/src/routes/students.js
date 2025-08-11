const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Récupérer la liste des élèves
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
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
 *     responses:
 *       200:
 *         description: Liste des élèves
 */
router.get('/', requirePermission('student:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classId, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      schoolId: req.user.schoolId
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { educmasterNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (classId) {
      where.classId = classId;
    }

    if (status) {
      where.status = status;
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          class: true,
          parent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          user: {
            select: {
              email: true,
              status: true,
              lastLoginAt: true
            }
          },
          _count: {
            select: {
              grades: true,
              absences: true,
              documents: true
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
      prisma.student.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des élèves'
    });
  }
});

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Créer un nouvel élève
 *     tags: [Students]
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
 *               - birthDate
 *               - gender
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
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               classId:
 *                 type: string
 *               educmasterNumber:
 *                 type: string
 *               emergencyContactName:
 *                 type: string
 *               emergencyContactPhone:
 *                 type: string
 *               emergencyContactRelationship:
 *                 type: string
 *               medicalInfo:
 *                 type: string
 *               allergies:
 *                 type: string
 *     responses:
 *       201:
 *         description: Élève créé avec succès
 */
router.post('/', [
  requirePermission('student:create'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('birthDate').isISO8601().withMessage('Date de naissance invalide'),
  body('gender').isIn(['M', 'F']).withMessage('Le genre doit être M ou F'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('classId').optional().isUUID().withMessage('ID de classe invalide')
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

    const studentData = req.body;
    studentData.schoolId = req.user.schoolId;

    // Vérifier si la classe appartient à l'école
    if (studentData.classId) {
      const classExists = await prisma.class.findFirst({
        where: {
          id: studentData.classId,
          schoolId: req.user.schoolId
        }
      });

      if (!classExists) {
        return res.status(400).json({
          success: false,
          message: 'Classe non trouvée dans cette école'
        });
      }
    }

    // Vérifier l'unicité du numéro Educmaster
    if (studentData.educmasterNumber) {
      const existingStudent = await prisma.student.findFirst({
        where: {
          schoolId: req.user.schoolId,
          educmasterNumber: studentData.educmasterNumber
        }
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Ce numéro Educmaster est déjà utilisé'
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur pour l'élève
      const user = await tx.user.create({
        data: {
          schoolId: req.user.schoolId,
          email: studentData.email || `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}@${Date.now()}.student.local`,
          passwordHash: await require('bcryptjs').hash('password123', 12), // Mot de passe par défaut
          role: 'STUDENT',
          status: 'active',
          firstName: studentData.firstName,
          lastName: studentData.lastName
        }
      });

      // Créer l'élève
      const student = await tx.student.create({
        data: {
          ...studentData,
          userId: user.id
        },
        include: {
          class: true,
          user: {
            select: {
              email: true,
              status: true
            }
          }
        }
      });

      return student;
    });

    logger.info(`Student created: ${result.firstName} ${result.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Élève créé avec succès',
      data: result
    });

  } catch (error) {
    logger.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'élève'
    });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Récupérer un élève par ID
 *     tags: [Students]
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
 *         description: Détails de l'élève
 *       404:
 *         description: Élève non trouvé
 */
router.get('/:id', requirePermission('student:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        class: true,
        parent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            email: true,
            status: true,
            lastLoginAt: true
          }
        },
        grades: {
          include: {
            subject: true,
            teacher: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        absences: {
          orderBy: { date: 'desc' },
          take: 10
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    logger.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'élève'
    });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Mettre à jour un élève
 *     tags: [Students]
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
 *         description: Élève mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('student:update'),
  body('firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('birthDate').optional().isISO8601().withMessage('Date de naissance invalide'),
  body('gender').optional().isIn(['M', 'F']).withMessage('Le genre doit être M ou F')
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

    // Vérifier si l'élève existe dans cette école
    const existingStudent = await prisma.student.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    // Vérifier l'unicité du numéro Educmaster si modifié
    if (updateData.educmasterNumber && updateData.educmasterNumber !== existingStudent.educmasterNumber) {
      const duplicateStudent = await prisma.student.findFirst({
        where: {
          schoolId: req.user.schoolId,
          educmasterNumber: updateData.educmasterNumber,
          id: { not: id }
        }
      });

      if (duplicateStudent) {
        return res.status(400).json({
          success: false,
          message: 'Ce numéro Educmaster est déjà utilisé'
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'utilisateur si nécessaire
      if (updateData.firstName || updateData.lastName || updateData.email) {
        await tx.user.update({
          where: { id: existingStudent.userId },
          data: {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email
          }
        });
      }

      // Mettre à jour l'élève
      const student = await tx.student.update({
        where: { id },
        data: updateData,
        include: {
          class: true,
          user: {
            select: {
              email: true,
              status: true
            }
          }
        }
      });

      return student;
    });

    logger.info(`Student updated: ${result.firstName} ${result.lastName} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Élève mis à jour avec succès',
      data: result
    });

  } catch (error) {
    logger.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'élève'
    });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Supprimer un élève
 *     tags: [Students]
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
 *         description: Élève supprimé avec succès
 */
router.delete('/:id', requirePermission('student:delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    await prisma.$transaction(async (tx) => {
      // Supprimer l'élève (cascade supprimera les relations)
      await tx.student.delete({
        where: { id }
      });

      // Supprimer l'utilisateur associé
      await tx.user.delete({
        where: { id: student.userId }
      });
    });

    logger.info(`Student deleted: ${student.firstName} ${student.lastName} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Élève supprimé avec succès'
    });

  } catch (error) {
    logger.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'élève'
    });
  }
});

/**
 * @swagger
 * /api/students/{id}/transfer:
 *   post:
 *     summary: Demander le transfert d'un élève
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toClassId
 *             properties:
 *               toClassId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Demande de transfert créée
 */
router.post('/:id/transfer', [
  requirePermission('student:update'),
  body('toClassId').isUUID().withMessage('ID de classe de destination requis'),
  body('reason').optional().isString()
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
    const { toClassId, reason } = req.body;

    const student = await prisma.student.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: { class: true }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    if (!student.classId) {
      return res.status(400).json({
        success: false,
        message: 'L\'élève n\'est assigné à aucune classe'
      });
    }

    // Vérifier que la classe de destination existe
    const toClass = await prisma.class.findFirst({
      where: {
        id: toClassId,
        schoolId: req.user.schoolId
      }
    });

    if (!toClass) {
      return res.status(400).json({
        success: false,
        message: 'Classe de destination non trouvée'
      });
    }

    if (student.classId === toClassId) {
      return res.status(400).json({
        success: false,
        message: 'L\'élève est déjà dans cette classe'
      });
    }

    const transferRequest = await prisma.transferRequest.create({
      data: {
        studentId: id,
        fromClassId: student.classId,
        toClassId,
        reason,
        status: 'PENDING'
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        fromClass: {
          select: {
            name: true
          }
        },
        toClass: {
          select: {
            name: true
          }
        }
      }
    });

    logger.info(`Transfer request created for student ${student.firstName} ${student.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Demande de transfert créée avec succès',
      data: transferRequest
    });

  } catch (error) {
    logger.error('Create transfer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la demande de transfert'
    });
  }
});

module.exports = router;