const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Récupérer toutes les écoles (Super Admin uniquement)
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des écoles
 *       403:
 *         description: Permission insuffisante
 */
router.get('/', requirePermission('school:read'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    // Si ce n'est pas un super admin, limiter à son école
    if (req.user.role !== 'SUPER_ADMIN') {
      where.id = req.user.schoolId;
    }

    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        include: {
          plan: true,
          _count: {
            select: {
              users: true,
              students: true,
              teachers: true,
              classes: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.school.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        schools,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des écoles'
    });
  }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Récupérer une école par ID
 *     tags: [Schools]
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
 *         description: Détails de l'école
 *       404:
 *         description: École non trouvée
 */
router.get('/:id', requirePermission('school:read'), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier l'accès à l'école
    if (req.user.role !== 'SUPER_ADMIN' && id !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette école'
      });
    }

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            students: true,
            teachers: true,
            classes: true,
            subjects: true
          }
        }
      }
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'École non trouvée'
      });
    }

    res.json({
      success: true,
      data: school
    });

  } catch (error) {
    logger.error('Get school error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'école'
    });
  }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   put:
 *     summary: Mettre à jour une école
 *     tags: [Schools]
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
 *             properties:
 *               name:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               trimester:
 *                 type: integer
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: École mise à jour avec succès
 */
router.put('/:id', [
  requirePermission('school:update'),
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('academicYear').optional().matches(/^\d{4}-\d{4}$/).withMessage('Format d\'année académique invalide'),
  body('trimester').optional().isInt({ min: 1, max: 3 }).withMessage('Le trimestre doit être 1, 2 ou 3')
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

    // Vérifier l'accès à l'école
    if (req.user.role !== 'SUPER_ADMIN' && id !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette école'
      });
    }

    const school = await prisma.school.update({
      where: { id },
      data: updateData,
      include: {
        plan: true
      }
    });

    logger.info(`School updated: ${school.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'École mise à jour avec succès',
      data: school
    });

  } catch (error) {
    logger.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'école'
    });
  }
});

/**
 * @swagger
 * /api/schools/{id}/stats:
 *   get:
 *     summary: Récupérer les statistiques d'une école
 *     tags: [Schools]
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
 *         description: Statistiques de l'école
 */
router.get('/:id/stats', requirePermission('school:read'), async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier l'accès à l'école
    if (req.user.role !== 'SUPER_ADMIN' && id !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette école'
      });
    }

    const stats = await prisma.$transaction(async (tx) => {
      const [
        totalUsers,
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        activeStudents,
        recentGrades
      ] = await Promise.all([
        tx.user.count({ where: { schoolId: id } }),
        tx.student.count({ where: { schoolId: id } }),
        tx.teacher.count({ where: { schoolId: id } }),
        tx.class.count({ where: { schoolId: id, isActive: true } }),
        tx.subject.count({ where: { schoolId: id } }),
        tx.student.count({ where: { schoolId: id, status: 'active' } }),
        tx.grade.count({
          where: {
            student: { schoolId: id },
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
            }
          }
        })
      ]);

      return {
        users: {
          total: totalUsers,
          students: totalStudents,
          teachers: totalTeachers,
          active: activeStudents
        },
        academic: {
          classes: totalClasses,
          subjects: totalSubjects,
          recentGrades
        }
      };
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Get school stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;