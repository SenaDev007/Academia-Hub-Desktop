const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Récupérer la liste des matières
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [MATERNELLE, PRIMAIRE, SECONDAIRE]
 *       - in: query
 *         name: group
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des matières
 */
router.get('/', requirePermission('subject:read'), async (req, res) => {
  try {
    const { level, group, search } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (level) {
      where.level = level;
    }

    if (group) {
      where.group = group;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    logger.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des matières'
    });
  }
});

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Créer une nouvelle matière
 *     tags: [Subjects]
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
 *               - code
 *               - level
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [MATERNELLE, PRIMAIRE, SECONDAIRE]
 *               group:
 *                 type: string
 *               domain:
 *                 type: string
 *               coefficient:
 *                 type: number
 *                 description: Coefficient pour le calcul des moyennes
 *     responses:
 *       201:
 *         description: Matière créée avec succès
 */
router.post('/', [
  requirePermission('subject:create'),
  body('name').notEmpty().withMessage('Le nom de la matière est requis'),
  body('code').notEmpty().withMessage('Le code de la matière est requis'),
  body('level').isIn(['MATERNELLE', 'PRIMAIRE', 'SECONDAIRE'])
    .withMessage('Niveau invalide'),
  body('group').optional().isString().withMessage('Groupe invalide'),
  body('domain').optional().isString().withMessage('Domaine invalide'),
  body('coefficient').optional().isFloat({ min: 0.1 }).withMessage('Coefficient invalide')
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

    const subjectData = req.body;
    subjectData.schoolId = req.user.schoolId;

    // Définir le coefficient par défaut selon le niveau
    if (subjectData.level === 'MATERNELLE') {
      subjectData.coefficient = 0; // Pas de coefficient pour la maternelle
    } else if (subjectData.level === 'PRIMAIRE') {
      subjectData.coefficient = 1; // Coefficient par défaut (pas utilisé dans les calculs)
    } else if (subjectData.level === 'SECONDAIRE' && !subjectData.coefficient) {
      subjectData.coefficient = 1; // Coefficient par défaut pour le secondaire
    }

    // Vérifier l'unicité du code
    const existingSubject = await prisma.subject.findFirst({
      where: {
        schoolId: req.user.schoolId,
        code: subjectData.code
      }
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Une matière avec ce code existe déjà'
      });
    }

    const subject = await prisma.subject.create({
      data: subjectData
    });

    logger.info(`Subject created: ${subject.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Matière créée avec succès',
      data: subject
    });

  } catch (error) {
    logger.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la matière'
    });
  }
});

/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Mettre à jour une matière
 *     tags: [Subjects]
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
 *         description: Matière mise à jour avec succès
 */
router.put('/:id', [
  requirePermission('subject:update'),
  body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('code').optional().notEmpty().withMessage('Le code ne peut pas être vide'),
  body('coefficient').optional().isFloat({ min: 0.1 }).withMessage('Coefficient invalide')
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

    const existingSubject = await prisma.subject.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Vérifier l'unicité du code si modifié
    if (updateData.code && updateData.code !== existingSubject.code) {
      const duplicateSubject = await prisma.subject.findFirst({
        where: {
          schoolId: req.user.schoolId,
          code: updateData.code,
          id: { not: id }
        }
      });

      if (duplicateSubject) {
        return res.status(400).json({
          success: false,
          message: 'Une matière avec ce code existe déjà'
        });
      }
    }

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: updateData
    });

    logger.info(`Subject updated: ${updatedSubject.name} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Matière mise à jour avec succès',
      data: updatedSubject
    });

  } catch (error) {
    logger.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la matière'
    });
  }
});

/**
 * @swagger
 * /api/subjects/groups:
 *   get:
 *     summary: Récupérer les groupes de matières par niveau
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [MATERNELLE, PRIMAIRE, SECONDAIRE]
 *     responses:
 *       200:
 *         description: Groupes de matières
 */
router.get('/groups', requirePermission('subject:read'), async (req, res) => {
  try {
    const { level } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (level) {
      where.level = level;
    }

    const subjects = await prisma.subject.findMany({
      where,
      select: {
        group: true,
        domain: true,
        level: true
      },
      distinct: ['group', 'level']
    });

    // Organiser par niveau et groupe
    const groupedSubjects = {};
    subjects.forEach(subject => {
      if (!groupedSubjects[subject.level]) {
        groupedSubjects[subject.level] = {};
      }
      if (!groupedSubjects[subject.level][subject.group]) {
        groupedSubjects[subject.level][subject.group] = {
          group: subject.group,
          domain: subject.domain,
          subjects: []
        };
      }
    });

    // Ajouter les matières à chaque groupe
    const allSubjects = await prisma.subject.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { group: 'asc' },
        { name: 'asc' }
      ]
    });

    allSubjects.forEach(subject => {
      if (groupedSubjects[subject.level] && groupedSubjects[subject.level][subject.group]) {
        groupedSubjects[subject.level][subject.group].subjects.push(subject);
      }
    });

    res.json({
      success: true,
      data: groupedSubjects
    });

  } catch (error) {
    logger.error('Get subject groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des groupes de matières'
    });
  }
});

module.exports = router;