const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');
const { 
  calculerMoyenneSelonNiveau, 
  attribuerMentionEtEmoji, 
  evaluerCompetenceMaternelle,
  validerNote,
  validerCodeMaternelle,
  determinerNiveauEducation,
  obtenirTypesEvaluation,
  coefficientRequis
} = require('../utils/gradeCalculations');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Créer une nouvelle note
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - subjectId
 *               - trimester
 *               - academicYear
 *               - type
 *               - coefficient
 *               - score
 *             properties:
 *               studentId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               trimester:
 *                 type: string
 *               academicYear:
 *                 type: string
 *               type:
 *                 type: string
 *               coefficient:
 *                 type: number
 *               score:
 *                 type: number
 *               qualitativeScore:
 *                 type: string
 *                 description: Pour la maternelle (TS, S, PS)
 *     responses:
 *       201:
 *         description: Note créée avec succès
 */
router.post('/', [
  requirePermission('grade:create'),
  body('studentId').isUUID().withMessage('ID élève invalide'),
  body('subjectId').isUUID().withMessage('ID matière invalide'),
  body('trimester').isIn(['T1', 'T2', 'T3']).withMessage('Trimestre invalide'),
  body('academicYear').matches(/^\d{4}-\d{4}$/).withMessage('Année académique invalide'),
  body('type').notEmpty().withMessage('Type de note requis'),
  body('coefficient').isFloat({ min: 0.1 }).withMessage('Coefficient invalide'),
  body('score').optional().isFloat({ min: 0, max: 20 }).withMessage('Note invalide (0-20)'),
  body('qualitativeScore').optional().isIn(['TS', 'S', 'PS']).withMessage('Code qualitatif invalide (TS, S, PS)')
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

    const gradeData = req.body;
    gradeData.teacherId = req.user.id;

    // Validation selon le type d'évaluation
    if (gradeData.qualitativeScore && gradeData.score) {
      return res.status(400).json({
        success: false,
        message: 'Une note ne peut pas avoir à la fois un score numérique et qualitatif'
      });
    }

    if (!gradeData.qualitativeScore && !gradeData.score) {
      return res.status(400).json({
        success: false,
        message: 'Une note doit avoir soit un score numérique soit un score qualitatif'
      });
    }

    // Vérifier que l'élève appartient à l'école
    const student = await prisma.student.findFirst({
      where: {
        id: gradeData.studentId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé dans cette école'
      });
    }

    // Vérifier que la matière appartient à l'école
    const subject = await prisma.subject.findFirst({
      where: {
        id: gradeData.subjectId,
        schoolId: req.user.schoolId
      }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée dans cette école'
      });
    }

    // Déterminer le niveau d'éducation et valider le type d'évaluation
    const niveau = determinerNiveauEducation(student.class?.grade || '');
    const typesValides = obtenirTypesEvaluation(niveau);
    
    // Validation spécifique selon le niveau
    if (niveau === 'MATERNELLE') {
      if (!gradeData.qualitativeScore) {
        return res.status(400).json({
          success: false,
          message: 'L\'évaluation en maternelle doit être qualitative (TS, S, PS)'
        });
      }
      if (!validerCodeMaternelle(gradeData.qualitativeScore)) {
        return res.status(400).json({
          success: false,
          message: 'Code d\'évaluation invalide pour la maternelle'
        });
      }
    } else {
      if (!gradeData.score) {
        return res.status(400).json({
          success: false,
          message: 'Une note numérique est requise pour ce niveau'
        });
      }
      if (!validerNote(gradeData.score)) {
        return res.status(400).json({
          success: false,
          message: 'Note invalide (doit être entre 0 et 20)'
        });
      }
    }

    const grade = await prisma.grade.create({
      data: gradeData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
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
      }
    });

    // Ajouter l'évaluation qualitative si applicable
    let evaluation = null;
    if (niveau === 'MATERNELLE' && gradeData.qualitativeScore) {
      evaluation = evaluerCompetenceMaternelle(gradeData.qualitativeScore);
    } else if (gradeData.score) {
      evaluation = attribuerMentionEtEmoji(gradeData.score);
    }

    logger.info(`Grade created: ${grade.score}/20 for student ${grade.student.firstName} ${grade.student.lastName} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Note créée avec succès',
      data: {
        ...grade,
        evaluation
      }
    });

  } catch (error) {
    logger.error('Create grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la note'
    });
  }
});

/**
 * @swagger
 * /api/grades/student/{studentId}:
 *   get:
 *     summary: Récupérer les notes d'un élève
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *       - in: query
 *         name: academicYear
 *         schema:
 *           type: string
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes de l'élève
 */
router.get('/student/:studentId', requirePermission('grade:read'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { trimester, academicYear, subjectId } = req.query;

    // Vérifier que l'élève appartient à l'école
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId: req.user.schoolId
      },
      include: {
        class: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé dans cette école'
      });
    }

    const where = {
      studentId
    };

    if (trimester) where.trimester = trimester;
    if (academicYear) where.academicYear = academicYear;
    if (subjectId) where.subjectId = subjectId;

    const grades = await prisma.grade.findMany({
      where,
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
      orderBy: [
        { academicYear: 'desc' },
        { trimester: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculer les moyennes par matière et trimestre
    const gradesBySubjectAndTrimester = {};
    
    grades.forEach(grade => {
      const key = `${grade.subjectId}-${grade.trimester}`;
      if (!gradesBySubjectAndTrimester[key]) {
        gradesBySubjectAndTrimester[key] = {
          subject: grade.subject,
          trimester: grade.trimester,
          grades: [],
          average: 0
        };
      }
      gradesBySubjectAndTrimester[key].grades.push(grade);
    });

    // Calculer les moyennes
    Object.values(gradesBySubjectAndTrimester).forEach(subjectGrades => {
      const totalWeightedScore = subjectGrades.grades.reduce((sum, grade) => {
        return sum + (grade.score * grade.coefficient);
      }, 0);
      
      const totalCoefficient = subjectGrades.grades.reduce((sum, grade) => {
        return sum + grade.coefficient;
      }, 0);

      subjectGrades.average = totalCoefficient > 0 ? (totalWeightedScore / totalCoefficient) : 0;
    });

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          class: student.class
        },
        grades,
        averages: Object.values(gradesBySubjectAndTrimester)
      }
    });

  } catch (error) {
    logger.error('Get student grades error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes'
    });
  }
});

/**
 * @swagger
 * /api/grades/class/{classId}:
 *   get:
 *     summary: Récupérer les notes d'une classe
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes de la classe
 */
router.get('/class/:classId', requirePermission('grade:read'), async (req, res) => {
  try {
    const { classId } = req.params;
    const { trimester, academicYear, subjectId } = req.query;

    // Vérifier que la classe appartient à l'école
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId: req.user.schoolId
      }
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée dans cette école'
      });
    }

    const where = {
      student: {
        classId
      }
    };

    if (trimester) where.trimester = trimester;
    if (academicYear) where.academicYear = academicYear;
    if (subjectId) where.subjectId = subjectId;

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
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
      orderBy: [
        { student: { lastName: 'asc' } },
        { student: { firstName: 'asc' } },
        { createdAt: 'desc' }
      ]
    });

    // Organiser les notes par élève
    const gradesByStudent = {};
    
    grades.forEach(grade => {
      if (!gradesByStudent[grade.studentId]) {
        gradesByStudent[grade.studentId] = {
          student: grade.student,
          grades: [],
          averages: {}
        };
      }
      gradesByStudent[grade.studentId].grades.push(grade);
    });

    // Calculer les moyennes par élève et par matière
    Object.values(gradesByStudent).forEach(studentData => {
      const gradesBySubject = {};
      
      studentData.grades.forEach(grade => {
        if (!gradesBySubject[grade.subjectId]) {
          gradesBySubject[grade.subjectId] = {
            subject: grade.subject,
            grades: [],
            average: 0
          };
        }
        gradesBySubject[grade.subjectId].grades.push(grade);
      });

      // Calculer moyennes par matière
      Object.values(gradesBySubject).forEach(subjectGrades => {
        const totalWeightedScore = subjectGrades.grades.reduce((sum, grade) => {
          return sum + (grade.score * grade.coefficient);
        }, 0);
        
        const totalCoefficient = subjectGrades.grades.reduce((sum, grade) => {
          return sum + grade.coefficient;
        }, 0);

        subjectGrades.average = totalCoefficient > 0 ? (totalWeightedScore / totalCoefficient) : 0;
      });

      studentData.averages = gradesBySubject;
    });

    res.json({
      success: true,
      data: {
        class: {
          id: classData.id,
          name: classData.name,
          grade: classData.grade,
          section: classData.section
        },
        students: Object.values(gradesByStudent)
      }
    });

  } catch (error) {
    logger.error('Get class grades error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes de la classe'
    });
  }
});

/**
 * @swagger
 * /api/grades/{id}:
 *   put:
 *     summary: Mettre à jour une note
 *     tags: [Grades]
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
 *         description: Note mise à jour avec succès
 */
router.put('/:id', [
  requirePermission('grade:update'),
  body('score').optional().isFloat({ min: 0, max: 20 }).withMessage('Note invalide (0-20)'),
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

    // Vérifier que la note existe et appartient à l'école
    const existingGrade = await prisma.grade.findFirst({
      where: {
        id,
        student: {
          schoolId: req.user.schoolId
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!existingGrade) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    // Créer un historique de la modification
    await prisma.gradeHistory.create({
      data: {
        gradeId: id,
        oldValue: existingGrade.score,
        newValue: updateData.score || existingGrade.score,
        changedBy: req.user.id,
        reason: updateData.reason || 'Modification de note'
      }
    });

    const updatedGrade = await prisma.grade.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
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
      }
    });

    logger.info(`Grade updated: ${updatedGrade.score}/20 for student ${updatedGrade.student.firstName} ${updatedGrade.student.lastName} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Note mise à jour avec succès',
      data: updatedGrade
    });

  } catch (error) {
    logger.error('Update grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la note'
    });
  }
});

/**
 * @swagger
 * /api/grades/{id}:
 *   delete:
 *     summary: Supprimer une note
 *     tags: [Grades]
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
 *         description: Note supprimée avec succès
 */
router.delete('/:id', requirePermission('grade:delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await prisma.grade.findFirst({
      where: {
        id,
        student: {
          schoolId: req.user.schoolId
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    await prisma.grade.delete({
      where: { id }
    });

    logger.info(`Grade deleted: ${grade.score}/20 for student ${grade.student.firstName} ${grade.student.lastName} by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Note supprimée avec succès'
    });

  } catch (error) {
    logger.error('Delete grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la note'
    });
  }
});

module.exports = router;