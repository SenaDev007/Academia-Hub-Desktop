const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Récupérer la liste des rapports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, FINAL, ARCHIVED]
 *     responses:
 *       200:
 *         description: Liste des rapports
 */
router.get('/', requirePermission('report:read'), async (req, res) => {
  try {
    const { type, status, format } = req.query;

    const where = {
      schoolId: req.user.schoolId
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (format) where.format = format;

    const reports = await prisma.report.findMany({
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
      data: reports
    });

  } catch (error) {
    logger.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rapports'
    });
  }
});

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Créer un nouveau rapport
 *     tags: [Reports]
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
 *               - format
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               format:
 *                 type: string
 *                 enum: [PDF, DOCX, XLSX, CSV]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, FINAL, ARCHIVED]
 *                 default: DRAFT
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 */
router.post('/', [
  requirePermission('report:create'),
  body('type').notEmpty().withMessage('Le type de rapport est requis'),
  body('title').notEmpty().withMessage('Le titre du rapport est requis'),
  body('content').notEmpty().withMessage('Le contenu du rapport est requis'),
  body('format').isIn(['PDF', 'DOCX', 'XLSX', 'CSV'])
    .withMessage('Format de rapport invalide'),
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

    const reportData = req.body;
    reportData.schoolId = req.user.schoolId;

    const report = await prisma.report.create({
      data: reportData
    });

    logger.info(`Report created: ${report.title} (${report.type}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Rapport créé avec succès',
      data: report
    });

  } catch (error) {
    logger.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du rapport'
    });
  }
});

/**
 * @swagger
 * /api/reports/academic-performance:
 *   get:
 *     summary: Générer un rapport de performance académique
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *           enum: [T1, T2, T3]
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rapport de performance académique
 */
router.get('/academic-performance', requirePermission('report:read'), async (req, res) => {
  try {
    const { classId, trimester, academicYear } = req.query;

    // Construire les conditions de filtrage
    const gradeWhere = {
      student: {
        schoolId: req.user.schoolId
      }
    };

    if (classId) {
      gradeWhere.student.classId = classId;
    }

    if (trimester) {
      gradeWhere.trimester = trimester;
    }

    if (academicYear) {
      gradeWhere.academicYear = academicYear;
    }

    // Récupérer les données de performance
    const [grades, classes, subjects] = await Promise.all([
      prisma.grade.findMany({
        where: gradeWhere,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              class: {
                select: {
                  name: true,
                  grade: true,
                  section: true
                }
              }
            }
          },
          subject: {
            select: {
              name: true,
              code: true,
              coefficient: true
            }
          }
        }
      }),
      prisma.class.findMany({
        where: {
          schoolId: req.user.schoolId,
          ...(classId && { id: classId })
        },
        include: {
          _count: {
            select: { students: true }
          }
        }
      }),
      prisma.subject.findMany({
        where: {
          schoolId: req.user.schoolId
        }
      })
    ]);

    // Calculer les statistiques
    const statistics = {
      totalGrades: grades.length,
      averageScore: grades.length > 0 ? grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length : 0,
      bySubject: {},
      byClass: {},
      distribution: {
        excellent: 0,
        tresBien: 0,
        bien: 0,
        assezBien: 0,
        passable: 0,
        insuffisant: 0,
        tresInsuffisant: 0
      }
    };

    // Analyser par matière
    subjects.forEach(subject => {
      const subjectGrades = grades.filter(g => g.subjectId === subject.id);
      if (subjectGrades.length > 0) {
        statistics.bySubject[subject.name] = {
          totalGrades: subjectGrades.length,
          average: subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length,
          coefficient: subject.coefficient
        };
      }
    });

    // Analyser par classe
    classes.forEach(cls => {
      const classGrades = grades.filter(g => g.student.class?.name === cls.name);
      if (classGrades.length > 0) {
        statistics.byClass[cls.name] = {
          totalGrades: classGrades.length,
          average: classGrades.reduce((sum, g) => sum + g.score, 0) / classGrades.length,
          studentCount: cls._count.students
        };
      }
    });

    // Distribution des notes
    grades.forEach(grade => {
      if (grade.score >= 18) statistics.distribution.excellent++;
      else if (grade.score >= 16) statistics.distribution.tresBien++;
      else if (grade.score >= 14) statistics.distribution.bien++;
      else if (grade.score >= 12) statistics.distribution.assezBien++;
      else if (grade.score >= 10) statistics.distribution.passable++;
      else if (grade.score >= 8) statistics.distribution.insuffisant++;
      else statistics.distribution.tresInsuffisant++;
    });

    const reportData = {
      title: 'Rapport de Performance Académique',
      type: 'ACADEMIC_PERFORMANCE',
      period: {
        trimester,
        academicYear,
        classId
      },
      statistics,
      generatedAt: new Date(),
      generatedBy: req.user.id
    };

    res.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    logger.error('Generate academic performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport de performance'
    });
  }
});

/**
 * @swagger
 * /api/reports/attendance:
 *   get:
 *     summary: Générer un rapport d'assiduité
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Rapport d'assiduité
 */
router.get('/attendance', requirePermission('report:read'), async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    const absenceWhere = {
      student: {
        schoolId: req.user.schoolId
      }
    };

    if (classId) {
      absenceWhere.classId = classId;
    }

    if (startDate && endDate) {
      absenceWhere.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [absences, students] = await Promise.all([
      prisma.absence.findMany({
        where: absenceWhere,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              class: {
                select: {
                  name: true,
                  grade: true,
                  section: true
                }
              }
            }
          },
          class: {
            select: {
              name: true,
              grade: true,
              section: true
            }
          }
        }
      }),
      prisma.student.findMany({
        where: {
          schoolId: req.user.schoolId,
          ...(classId && { classId })
        },
        include: {
          class: {
            select: {
              name: true,
              grade: true,
              section: true
            }
          }
        }
      })
    ]);

    // Calculer les statistiques d'assiduité
    const statistics = {
      totalAbsences: absences.length,
      totalStudents: students.length,
      byType: {
        JUSTIFIED: absences.filter(a => a.type === 'JUSTIFIED').length,
        UNJUSTIFIED: absences.filter(a => a.type === 'UNJUSTIFIED').length,
        ABSENT: absences.filter(a => a.type === 'ABSENT').length,
        EXCUSED: absences.filter(a => a.type === 'EXCUSED').length
      },
      byStudent: {},
      byClass: {}
    };

    // Analyser par élève
    students.forEach(student => {
      const studentAbsences = absences.filter(a => a.studentId === student.id);
      statistics.byStudent[`${student.firstName} ${student.lastName}`] = {
        totalAbsences: studentAbsences.length,
        justified: studentAbsences.filter(a => a.type === 'JUSTIFIED').length,
        unjustified: studentAbsences.filter(a => a.type === 'UNJUSTIFIED').length,
        class: student.class?.name || 'Non assigné'
      };
    });

    // Analyser par classe
    const classesList = [...new Set(students.map(s => s.class?.name).filter(Boolean))];
    classesList.forEach(className => {
      const classAbsences = absences.filter(a => a.class.name === className);
      const classStudents = students.filter(s => s.class?.name === className);
      
      statistics.byClass[className] = {
        totalAbsences: classAbsences.length,
        studentCount: classStudents.length,
        averageAbsencesPerStudent: classStudents.length > 0 ? classAbsences.length / classStudents.length : 0
      };
    });

    const reportData = {
      title: 'Rapport d\'Assiduité',
      type: 'ATTENDANCE',
      period: {
        startDate,
        endDate,
        classId
      },
      statistics,
      generatedAt: new Date(),
      generatedBy: req.user.id
    };

    res.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    logger.error('Generate attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport d\'assiduité'
    });
  }
});

/**
 * @swagger
 * /api/reports/{id}/export:
 *   post:
 *     summary: Exporter un rapport
 *     tags: [Reports]
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
  requirePermission('report:read'),
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

    const report = await prisma.report.findFirst({
      where: {
        id,
        schoolId: req.user.schoolId
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Rapport non trouvé'
      });
    }

    // Créer l'export
    const reportExport = await prisma.reportExport.create({
      data: {
        reportId: id,
        format,
        content: `Export ${format} du rapport: ${report.title}`,
        status: 'COMPLETED'
      }
    });

    logger.info(`Report export created: ${report.title} (${format}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Export créé avec succès',
      data: reportExport
    });

  } catch (error) {
    logger.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export du rapport'
    });
  }
});

module.exports = router;