const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Récupérer la liste des documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IDENTITY, MEDICAL, ACADEMIC, OTHER, CAHIER_JOURNAL, BULLETIN, TIMETABLE, REPORT]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, FINAL, ARCHIVED]
 *     responses:
 *       200:
 *         description: Liste des documents
 */
router.get('/', requirePermission('document:read'), async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        exports: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents'
    });
  }
});

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Créer un nouveau document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [IDENTITY, MEDICAL, ACADEMIC, OTHER, CAHIER_JOURNAL, BULLETIN, TIMETABLE, REPORT]
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, FINAL, ARCHIVED]
 *                 default: DRAFT
 *     responses:
 *       201:
 *         description: Document créé avec succès
 */
router.post('/', [
  requirePermission('document:create'),
  body('type').isIn(['IDENTITY', 'MEDICAL', 'ACADEMIC', 'OTHER', 'CAHIER_JOURNAL', 'BULLETIN', 'TIMETABLE', 'REPORT'])
    .withMessage('Type de document invalide'),
  body('title').notEmpty().withMessage('Le titre du document est requis'),
  body('content').notEmpty().withMessage('Le contenu du document est requis'),
  body('status').optional().isIn(['DRAFT', 'FINAL', 'ARCHIVED'])
    .withMessage('Statut invalide')
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

    const documentData = req.body;
    documentData.schoolId = req.user.schoolId;

    const document = await prisma.document.create({
      data: documentData
    });

    logger.info(`Document created: ${document.title} (${document.type}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Document créé avec succès',
      data: document
    });

  } catch (error) {
    logger.error('Create document error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du document'
    });
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Récupérer un document par ID
 *     tags: [Documents]
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
 *         description: Détails du document
 */
router.get('/:id', requirePermission('document:read'), async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      },
      include: {
        exports: {
          orderBy: { createdAt: 'desc' }
        },
        notifications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du document'
    });
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Mettre à jour un document
 *     tags: [Documents]
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
 *         description: Document mis à jour avec succès
 */
router.put('/:id', [
  requirePermission('document:update'),
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('content').optional().notEmpty().withMessage('Le contenu ne peut pas être vide'),
  body('status').optional().isIn(['DRAFT', 'FINAL', 'ARCHIVED'])
    .withMessage('Statut invalide')
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

    const existingDocument = await prisma.document.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData
    });

    logger.info(`Document updated: ${updatedDocument.title} (${id}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Document mis à jour avec succès',
      data: updatedDocument
    });

  } catch (error) {
    logger.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du document'
    });
  }
});

/**
 * @swagger
 * /api/documents/{id}/export:
 *   post:
 *     summary: Exporter un document
 *     tags: [Documents]
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
 *               - format
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [PDF, DOCX, XLSX, CSV]
 *     responses:
 *       201:
 *         description: Export créé avec succès
 */
router.post('/:id/export', [
  requirePermission('document:read'),
  body('format').isIn(['PDF', 'DOCX', 'XLSX', 'CSV'])
    .withMessage('Format d\'export invalide')
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
    const { format } = req.body;

    const document = await prisma.document.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Créer l'export (simulation - dans un vrai système, cela déclencherait un processus d'export)
    const documentExport = await prisma.documentExport.create({
      data: {
        documentId: id,
        format,
        content: `Export ${format} du document: ${document.title}`,
        status: 'COMPLETED' // En réalité, ce serait 'PENDING' puis mis à jour par un worker
      }
    });

    logger.info(`Document export created: ${document.title} (${format}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Export créé avec succès',
      data: documentExport
    });

  } catch (error) {
    logger.error('Export document error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export du document'
    });
  }
});

/**
 * @swagger
 * /api/documents/templates:
 *   get:
 *     summary: Récupérer les templates de documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des templates
 */
router.get('/templates', requirePermission('document:read'), async (req, res) => {
  try {
    const { type, status } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;
    if (status) where.status = status;

    const templates = await prisma.documentTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    logger.error('Get document templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des templates'
    });
  }
});

/**
 * @swagger
 * /api/documents/templates:
 *   post:
 *     summary: Créer un nouveau template de document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template créé avec succès
 */
router.post('/templates', [
  requirePermission('document:create'),
  body('type').notEmpty().withMessage('Le type de template est requis'),
  body('name').notEmpty().withMessage('Le nom du template est requis'),
  body('content').notEmpty().withMessage('Le contenu du template est requis')
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

    const templateData = req.body;
    templateData.schoolId = req.user.schoolId;

    const template = await prisma.documentTemplate.create({
      data: templateData
    });

    logger.info(`Document template created: ${template.name} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Template créé avec succès',
      data: template
    });

  } catch (error) {
    logger.error('Create document template error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du template'
    });
  }
});

module.exports = router;