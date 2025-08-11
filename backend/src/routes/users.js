const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', requirePermission('user:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      schoolId: req.user.schoolId
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          lastLoginAt: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              educmasterNumber: true,
              class: {
                select: {
                  name: true,
                  grade: true
                }
              }
            }
          },
          teacher: {
            select: {
              id: true,
              employeeId: true,
              class: {
                select: {
                  name: true,
                  grade: true
                }
              }
            }
          },
          parent: {
            select: {
              id: true,
              children: {
                select: {
                  firstName: true,
                  lastName: true,
                  class: {
                    select: {
                      name: true
                    }
                  }
                }
              }
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
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [SCHOOL_ADMIN, DIRECTOR, SECRETARY, ACCOUNTANT, TEACHER, STUDENT, PARENT]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
router.post('/', [
  requirePermission('user:create'),
  body('email').isEmail().withMessage('Email invalide'),
  body('role').isIn(['SCHOOL_ADMIN', 'DIRECTOR', 'SECRETARY', 'ACCOUNTANT', 'TEACHER', 'STUDENT', 'PARENT'])
    .withMessage('Rôle invalide'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('password').optional().isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
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

    const userData = req.body;
    userData.schoolId = req.user.schoolId;

    // Vérifier l'unicité de l'email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Générer un mot de passe par défaut si non fourni
    const password = userData.password || 'password123';
    userData.passwordHash = await bcrypt.hash(password, 12);
    delete userData.password;

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true
      }
    });

    logger.info(`User created: ${user.email} (${user.role}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });

  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
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
 *         description: Détails de l'utilisateur
 */
router.get('/:id', requirePermission('user:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        student: {
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
            }
          }
        },
        teacher: {
          include: {
            class: true,
            schedules: {
              include: {
                subject: true,
                class: true
              }
            }
          }
        },
        parent: {
          include: {
            children: {
              include: {
                class: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('user:update'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('password').optional().isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
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

    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier l'unicité de l'email si modifié
    if (updateData.email && updateData.email !== existingUser.email) {
      const duplicateUser = await prisma.user.findUnique({
        where: { email: updateData.email }
      });

      if (duplicateUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }
    }

    // Hasher le nouveau mot de passe si fourni
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 12);
      delete updateData.password;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        lastLoginAt: true,
        updatedAt: true
      }
    });

    logger.info(`User updated: ${updatedUser.email} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser
    });

  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        lastLoginAt: true,
        school: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            plan: true,
            trialEndsAt: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

module.exports = router;