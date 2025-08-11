const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requirePermission } = require('../middleware/permissions');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Récupérer les données du tableau de bord
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données du tableau de bord
 */
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const userRole = req.user.role;

    // Données communes à tous les rôles
    const baseStats = await prisma.$transaction(async (tx) => {
      const [
        totalStudents,
        totalTeachers,
        totalClasses,
        activeClasses,
        recentGrades,
        todayAbsences
      ] = await Promise.all([
        tx.student.count({ where: { schoolId, status: 'active' } }),
        tx.teacher.count({ where: { schoolId, status: 'active' } }),
        tx.class.count({ where: { schoolId } }),
        tx.class.count({ where: { schoolId, isActive: true } }),
        tx.grade.count({
          where: {
            student: { schoolId },
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
            }
          }
        }),
        tx.absence.count({
          where: {
            student: { schoolId },
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        })
      ]);

      return {
        students: totalStudents,
        teachers: totalTeachers,
        classes: totalClasses,
        activeClasses,
        recentGrades,
        todayAbsences
      };
    });

    // Données spécifiques selon le rôle
    let roleSpecificData = {};

    switch (userRole) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
        // Statistiques complètes pour les administrateurs
        roleSpecificData = await getAdminDashboard(schoolId);
        break;

      case 'TEACHER':
        // Données spécifiques aux enseignants
        roleSpecificData = await getTeacherDashboard(req.user.teacher?.id, schoolId);
        break;

      case 'STUDENT':
        // Données spécifiques aux élèves
        roleSpecificData = await getStudentDashboard(req.user.student?.id);
        break;

      case 'PARENT':
        // Données pour les parents
        roleSpecificData = await getParentDashboard(req.user.parent?.id);
        break;

      default:
        roleSpecificData = {};
    }

    const dashboardData = {
      overview: baseStats,
      ...roleSpecificData,
      user: {
        role: userRole,
        schoolName: req.user.school.name
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du tableau de bord'
    });
  }
});

// Fonctions utilitaires pour chaque type de dashboard

async function getAdminDashboard(schoolId) {
  const [
    studentsThisMonth,
    teachersThisMonth,
    classesThisMonth,
    gradesThisWeek,
    upcomingExams,
    recentNotifications
  ] = await Promise.all([
    prisma.student.count({
      where: {
        schoolId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.teacher.count({
      where: {
        schoolId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.class.count({
      where: {
        schoolId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.grade.count({
      where: {
        student: { schoolId },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.examSession.findMany({
      where: {
        schoolId,
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: 'PENDING'
      },
      include: {
        subject: true,
        class: true,
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { date: 'asc' },
      take: 5
    }),
    prisma.notification.findMany({
      where: {
        schoolId,
        status: { in: ['PENDING', 'SENT'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  return {
    monthly: {
      students: studentsThisMonth,
      teachers: teachersThisMonth,
      classes: classesThisMonth
    },
    weekly: {
      grades: gradesThisWeek
    },
    upcoming: {
      exams: upcomingExams
    },
    notifications: recentNotifications
  };
}

async function getTeacherDashboard(teacherId, schoolId) {
  if (!teacherId) return {};

  const [
    myClasses,
    myScheduleToday,
    myRecentGrades,
    pendingCahierJournals,
    upcomingExams
  ] = await Promise.all([
    prisma.class.findMany({
      where: {
        OR: [
          { teacherId },
          {
            schedules: {
              some: { teacherId }
            }
          }
        ]
      },
      include: {
        _count: {
          select: { students: true }
        }
      }
    }),
    prisma.schedule.findMany({
      where: {
        teacherId,
        day: getDayName(new Date()),
        isActive: true
      },
      include: {
        subject: true,
        class: true,
        room: true
      },
      orderBy: { startTime: 'asc' }
    }),
    prisma.grade.findMany({
      where: {
        teacherId: req.user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        subject: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.cahierJournal.count({
      where: {
        teacherId,
        status: { in: ['PLANIFIED', 'IN_PROGRESS'] }
      }
    }),
    prisma.examSession.findMany({
      where: {
        teacherId,
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        subject: true,
        class: true
      },
      orderBy: { date: 'asc' }
    })
  ]);

  return {
    classes: myClasses,
    todaySchedule: myScheduleToday,
    recentGrades: myRecentGrades,
    pendingJournals: pendingCahierJournals,
    upcomingExams
  };
}

async function getStudentDashboard(studentId) {
  if (!studentId) return {};

  const [
    myGrades,
    mySchedule,
    myAbsences,
    upcomingExams
  ] = await Promise.all([
    prisma.grade.findMany({
      where: { studentId },
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
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.schedule.findMany({
      where: {
        class: {
          students: {
            some: { id: studentId }
          }
        },
        day: getDayName(new Date()),
        isActive: true
      },
      include: {
        subject: true,
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        room: true
      },
      orderBy: { startTime: 'asc' }
    }),
    prisma.absence.count({
      where: {
        studentId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.examSession.findMany({
      where: {
        class: {
          students: {
            some: { id: studentId }
          }
        },
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        subject: true,
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })
  ]);

  return {
    recentGrades: myGrades,
    todaySchedule: mySchedule,
    monthlyAbsences: myAbsences,
    upcomingExams
  };
}

async function getParentDashboard(parentId) {
  if (!parentId) return {};

  // Récupérer les enfants du parent
  const children = await prisma.student.findMany({
    where: { parentId },
    include: {
      class: true,
      grades: {
        include: {
          subject: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      absences: {
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }
    }
  });

  return {
    children: children.map(child => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      class: child.class,
      recentGrades: child.grades,
      monthlyAbsences: child.absences.length
    }))
  };
}

// Fonction utilitaire pour obtenir le nom du jour
function getDayName(date) {
  const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  return days[date.getDay()];
}

module.exports = router;