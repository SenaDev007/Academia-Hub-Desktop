const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/payroll/batches:
 *   get:
 *     summary: Récupérer les lots de paie
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 */
router.get('/batches', requirePermission('payroll:read'), async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (status) where.status = status;

    const batches = await prisma.payrollBatch.findMany({
      where,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            payrolls: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: batches
    });

  } catch (error) {
    logger.error('Get payroll batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des lots de paie'
    });
  }
});

/**
 * @swagger
 * /api/payroll/batches:
 *   post:
 *     summary: Créer un nouveau lot de paie
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 */
router.post('/batches', [
  requirePermission('payroll:create'),
  body('name').notEmpty().withMessage('Le nom du lot est requis'),
  body('periodStart').isISO8601().withMessage('Date de début invalide'),
  body('periodEnd').isISO8601().withMessage('Date de fin invalide')
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

    const batchData = {
      ...req.body,
      schoolId: req.user.schoolId,
      createdById: req.user.id,
      totalAmount: 0,
      currency: 'XOF'
    };

    const batch = await prisma.payrollBatch.create({
      data: batchData,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    logger.info(`Payroll batch created: ${batch.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Lot de paie créé avec succès',
      data: batch
    });

  } catch (error) {
    logger.error('Create payroll batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du lot de paie'
    });
  }
});

/**
 * @swagger
 * /api/payroll/settings:
 *   get:
 *     summary: Récupérer les paramètres de paie
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 */
router.get('/settings', requirePermission('payroll:read'), async (req, res) => {
  try {
    const settings = await prisma.payrollSettings.findFirst({
      where: {
        schoolId: req.user.schoolId
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!settings) {
      // Créer des paramètres par défaut
      const defaultSettings = await prisma.payrollSettings.create({
        data: {
          schoolId: req.user.schoolId,
          currency: 'XOF',
          taxRate: 0.1,
          socialSecurityRate: 0.036,
          minimumSalary: 60000,
          overtimeRate: 1.5,
          paymentDay: 30,
          workingDays: 22,
          createdById: req.user.id
        }
      });

      return res.json({
        success: true,
        data: defaultSettings
      });
    }

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    logger.error('Get payroll settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paramètres de paie'
    });
  }
});

module.exports = router;