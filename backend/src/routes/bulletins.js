const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');
const { 
  calculerMoyenneSelonNiveau, 
  attribuerMentionEtEmoji,
  determinerNiveauEducation 
} = require('../utils/gradeCalculations');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/bulletins/generate:
 *   post:
 *     summary: Générer un bulletin de notes
 *     tags: [Bulletins]
 *     security:
 *       - bearerAuth: []
 */
router.post('/generate', [
  requirePermission('bulletin:create'),
  body('studentId').isUUID().withMessage('ID élève invalide'),
  body('trimester').isIn(['T1', 'T2', 'T3']).withMessage('Trimestre invalide'),
  body('academicYear').matches(/^\d{4}-\d{4}$/).withMessage('Année académique invalide')
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

    const { studentId, trimester, academicYear } = req.body;

    // Récupérer l'élève avec sa classe
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId: req.user.schoolId
      },
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
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }

    // Récupérer toutes les notes de l'élève pour le trimestre
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        trimester,
        academicYear
      },
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
      }
    });

    // Organiser les notes par matière
    const gradesBySubject = {};
    grades.forEach(grade => {
      if (!gradesBySubject[grade.subjectId]) {
        gradesBySubject[grade.subjectId] = {
          subject: grade.subject,
          grades: [],
          average: 0,
          coefficient: grade.subject.coefficient || 1
        };
      }
      gradesBySubject[grade.subjectId].grades.push(grade);
    });

    // Calculer les moyennes par matière
    Object.values(gradesBySubject).forEach(subjectData => {
      const niveau = determinerNiveauEducation(student.class?.grade || '');
      const notes = subjectData.grades.map(g => g.score);
      const coefficients = subjectData.grades.map(g => g.coefficient || 1);
      
      subjectData.average = calculerMoyenneSelonNiveau(notes, 'TRIMESTRE', niveau, coefficients) || 0;
      subjectData.evaluation = attribuerMentionEtEmoji(subjectData.average);
    });

    // Calculer la moyenne générale
    const moyennesMatiere = Object.values(gradesBySubject).map(s => s.average);
    const coefficientsMatiere = Object.values(gradesBySubject).map(s => s.coefficient);
    const moyenneGenerale = calculerMoyenneSelonNiveau(
      moyennesMatiere, 
      'TRIMESTRE', 
      determinerNiveauEducation(student.class?.grade || ''),
      coefficientsMatiere
    ) || 0;

    // Créer ou mettre à jour le bulletin
    const bulletin = await prisma.schoolReport.upsert({
      where: {
        studentId_trimester_year_classId_schoolId: {
          studentId,
          trimester,
          year: academicYear,
          classId: student.classId,
          schoolId: req.user.schoolId
        }
      },
      update: {
        updatedAt: new Date()
      },
      create: {
        studentId,
        trimester,
        year: academicYear,
        classId: student.classId,
        schoolId: req.user.schoolId,
        level: determinerNiveauEducation(student.class?.grade || '')
      }
    });

    // Créer ou mettre à jour la moyenne de l'élève
    await prisma.studentAverage.upsert({
      where: {
        studentId_trimester_year_classId_schoolId: {
          studentId,
          trimester,
          year: academicYear,
          classId: student.classId,
          schoolId: req.user.schoolId
        }
      },
      update: {
        average: moyenneGenerale,
        updatedAt: new Date()
      },
      create: {
        studentId,
        trimester,
        year: academicYear,
        classId: student.classId,
        schoolId: req.user.schoolId,
        level: determinerNiveauEducation(student.class?.grade || ''),
        average: moyenneGenerale,
        rank: 1, // À calculer selon le classement
        rankExAequo: false
      }
    });

    const bulletinData = {
      bulletin,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        class: student.class,
        parent: student.parent
      },
      period: {
        trimester,
        academicYear
      },
      subjects: Object.values(gradesBySubject),
      summary: {
        moyenneGenerale,
        evaluation: attribuerMentionEtEmoji(moyenneGenerale),
        totalSubjects: Object.keys(gradesBySubject).length,
        totalGrades: grades.length
      }
    };

    logger.info(`Bulletin generated for student ${student.firstName} ${student.lastName} (${trimester} ${academicYear}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Bulletin généré avec succès',
      data: bulletinData
    });

  } catch (error) {
    logger.error('Generate bulletin error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du bulletin'
    });
  }
});

module.exports = router;