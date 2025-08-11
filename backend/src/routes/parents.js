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
 * /api/parents:
 *   get:
 *     summary: Récupérer la liste des parents
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requirePermission('parent:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      schoolId: req.user.schoolId
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [parents, total] = await Promise.all([
      prisma.parent.findMany({
        where,
        include: {
          user: {
            select: {
              status: true,
              lastLoginAt: true
            }
          },
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              class: {
                select: {
                  name: true,
                  grade: true
                }
              }
            }
          },
          _count: {
            select: {
              students: true
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
      prisma.parent.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        parents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get parents error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des parents'
    });
  }
});

/**
 * @swagger
 * /api/parents:
 *   post:
 *     summary: Créer un nouveau parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('parent:create'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('phone').notEmpty().withMessage('Le téléphone est requis')
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

    const parentData = req.body;

    // Vérifier l'unicité de l'email et du téléphone
    if (parentData.email) {
      const existingParent = await prisma.parent.findFirst({
        where: {
          schoolId: req.user.schoolId,
          email: parentData.email
        }
      });

      if (existingParent) {
        return res.status(400).json({
          success: false,
          message: 'Un parent avec cet email existe déjà'
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur pour le parent
      const user = await tx.user.create({
        data: {
          schoolId: req.user.schoolId,
          email: parentData.email || `${parentData.firstName.toLowerCase()}.${parentData.lastName.toLowerCase()}@${Date.now()}.parent.local`,
          passwordHash: await bcrypt.hash('parent123', 12),
          role: 'PARENT',
          status: 'active',
          firstName: parentData.firstName,
          lastName: parentData.lastName,
          phone: parentData.phone
        }
      });

      // Créer le parent
      const parent = await tx.parent.create({
        data: {
          ...parentData,
          schoolId: req.user.schoolId,
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

      return parent;
    });

    logger.info(`Parent created: ${result.firstName} ${result.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Parent créé avec succès',
      data: result
    });

  } catch (error) {
    logger.error('Create parent error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du parent'
    });
  }
});

module.exports = router;