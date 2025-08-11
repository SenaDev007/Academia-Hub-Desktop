const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/finance/dashboard:
 *   get:
 *     summary: Tableau de bord financier
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.get('/dashboard', requirePermission('finance:read'), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const [
      totalRevenue,
      monthlyRevenue,
      totalExpenses,
      monthlyExpenses,
      pendingPayments,
      overduePayments,
      recentPayments,
      recentExpenses
    ] = await Promise.all([
      // Revenus totaux
      prisma.payment.aggregate({
        where: {
          schoolId,
          status: 'PAID',
          type: { in: ['TUITION', 'FEE'] }
        },
        _sum: { amount: true }
      }),
      // Revenus du mois
      prisma.payment.aggregate({
        where: {
          schoolId,
          status: 'PAID',
          type: { in: ['TUITION', 'FEE'] },
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true }
      }),
      // Dépenses totales
      prisma.expense.aggregate({
        where: { schoolId },
        _sum: { amount: true }
      }),
      // Dépenses du mois
      prisma.expense.aggregate({
        where: {
          schoolId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true }
      }),
      // Paiements en attente
      prisma.payment.count({
        where: {
          schoolId,
          status: 'PENDING'
        }
      }),
      // Paiements en retard
      prisma.payment.count({
        where: {
          schoolId,
          status: 'PENDING',
          dueDate: {
            lt: new Date()
          }
        }
      }),
      // Paiements récents
      prisma.payment.findMany({
        where: {
          schoolId,
          status: 'PAID'
        },
        include: {
          student: {
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
        },
        orderBy: { date: 'desc' },
        take: 5
      }),
      // Dépenses récentes
      prisma.expense.findMany({
        where: { schoolId },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { date: 'desc' },
        take: 5
      })
    ]);

    const dashboard = {
      overview: {
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        netIncome: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        pendingPayments,
        overduePayments
      },
      recent: {
        payments: recentPayments,
        expenses: recentExpenses
      }
    };

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Finance dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau de bord financier'
    });
  }
});

/**
 * @swagger
 * /api/finance/invoices:
 *   post:
 *     summary: Créer une nouvelle facture
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.post('/invoices', [
  requirePermission('finance:create'),
  body('studentId').isUUID().withMessage('ID élève invalide'),
  body('academicYear').notEmpty().withMessage('Année académique requise'),
  body('dueDate').isISO8601().withMessage('Date d\'échéance invalide'),
  body('items').isArray().withMessage('Les éléments de facture sont requis')
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

    const { studentId, academicYear, dueDate, items, notes } = req.body;

    // Vérifier que l'élève appartient à l'école
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId: req.user.schoolId
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé dans cette école'
      });
    }

    // Calculer le total
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.18; // TVA 18%
    const total = subtotal + tax;

    // Générer le numéro de facture
    const invoiceCount = await prisma.invoice.count({
      where: { schoolId: req.user.schoolId }
    });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        studentId,
        schoolId: req.user.schoolId,
        academicYear,
        dueDate: new Date(dueDate),
        subtotal,
        tax,
        total,
        notes,
        items: {
          create: items.map(item => ({
            feeTypeId: item.feeTypeId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            class: {
              select: {
                name: true
              }
            }
          }
        },
        items: {
          include: {
            feeType: true
          }
        }
      }
    });

    logger.info(`Invoice created: ${invoice.invoiceNumber} for student ${invoice.student.firstName} ${invoice.student.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès',
      data: invoice
    });

  } catch (error) {
    logger.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la facture'
    });
  }
});

/**
 * @swagger
 * /api/finance/payments:
 *   post:
 *     summary: Enregistrer un paiement
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 */
router.post('/payments', [
  requirePermission('finance:create'),
  body('amount').isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('method').isIn(['CASH', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'CHEQUE', 'OTHER'])
    .withMessage('Méthode de paiement invalide'),
  body('type').isIn(['TUITION', 'FEE', 'EXPENSE', 'SALARY', 'OTHER'])
    .withMessage('Type de paiement invalide')
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

    const paymentData = {
      ...req.body,
      schoolId: req.user.schoolId,
      createdById: req.user.id,
      currency: 'XOF'
    };

    const payment = await prisma.payment.create({
      data: paymentData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            class: {
              select: {
                name: true
              }
            }
          }
        },
        invoice: true
      }
    });

    logger.info(`Payment recorded: ${payment.amount} XOF by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Paiement enregistré avec succès',
      data: payment
    });

  } catch (error) {
    logger.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du paiement'
    });
  }
});

module.exports = router;