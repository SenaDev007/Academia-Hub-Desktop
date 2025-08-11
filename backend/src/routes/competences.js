const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/competences:
 *   get:
 *     summary: Récupérer les compétences
 *     tags: [Competences]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requirePermission('competence:read'), async (req, res) => {
  try {
    const { domain, level, subjectId, studentId } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (domain) where.domain = domain;
    if (level) where.level = level;
    if (subjectId) where.subjectId = subjectId;
    if (studentId) where.studentId = studentId;

    const competences = await prisma.competence.findMany({
      where,
      include: {
        subject: {
          select: {
            name: true,
            code: true
          }
        },
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
        class: {
          select: {
            name: true,
            grade: true
          }
        }
      },
      orderBy: [
        { domain: 'asc' },
        { level: 'desc' },
        { title: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: competences
    });

  } catch (error) {
    logger.error('Get competences error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences'
    });
  }
});

/**
 * @swagger
 * /api/competences:
 *   post:
 *     summary: Créer une nouvelle compétence
 *     tags: [Competences]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', [
  requirePermission('competence:create'),
  body('title').notEmpty().withMessage('Le titre de la compétence est requis'),
  body('domain').isIn(['DISCIPLINAIRE', 'METHODOLOGIQUE', 'SOCIALE_CIVIQUE', 'PERSONNELLE_AUTONOMIE'])
    .withMessage('Domaine invalide'),
  body('level').isIn(['EXPERT', 'AVANCE', 'INTERMEDIAIRE', 'DEBUTANT'])
    .withMessage('Niveau invalide'),
  body('subjectId').isUUID().withMessage('ID matière invalide'),
  body('studentId').isUUID().withMessage('ID élève invalide'),
  body('classId').isUUID().withMessage('ID classe invalide')
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

    const competenceData = {
      ...req.body,
      schoolId: req.user.schoolId
    };

    const competence = await prisma.competence.create({
      data: competenceData,
      include: {
        subject: {
          select: {
            name: true,
            code: true
          }
        },
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    logger.info(`Competence created: ${competence.title} for student ${competence.student.firstName} ${competence.student.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      data: competence
    });

  } catch (error) {
    logger.error('Create competence error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la compétence'
    });
  }
});

module.exports = router;