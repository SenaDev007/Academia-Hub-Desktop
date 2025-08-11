const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');

    // 1. Créer les plans d'abonnement
    const freePlan = await prisma.plan.upsert({
      where: { name: 'Gratuit' },
      update: {},
      create: {
        name: 'Gratuit',
        description: 'Plan d\'essai gratuit de 15 jours avec fonctionnalités limitées',
        price: 0,
        duration: 15,
        features: {
          students: 50,
          teachers: 10,
          classes: 10,
          modules: ['basic', 'grades', 'schedules'],
          support: 'email'
        }
      }
    });

    const premiumPlan = await prisma.plan.upsert({
      where: { name: 'Premium' },
      update: {},
      create: {
        name: 'Premium',
        description: 'Plan premium avec toutes les fonctionnalités - 10.000 F CFA/mois',
        price: 10000,
        duration: 30,
        features: {
          students: -1, // Illimité
          teachers: -1,
          classes: -1,
          modules: ['all'],
          support: 'priority',
          backup: 'daily',
          analytics: 'advanced'
        }
      }
    });

    logger.info('✅ Plans created');

    // 2. Créer une école de démonstration
    const demoSchool = await prisma.school.upsert({
      where: { subdomain: 'demo' },
      update: {},
      create: {
        name: 'École de Démonstration Academia Hub',
        subdomain: 'demo',
        planId: premiumPlan.id,
        academicYear: '2024-2025',
        trimester: 2,
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
        settings: {
          timezone: 'Africa/Abidjan',
          currency: 'XOF',
          language: 'fr',
          gradeScale: '0-20',
          schoolHours: {
            start: '08:00',
            end: '17:00'
          }
        }
      }
    });

    logger.info('✅ Demo school created');

    // 3. Créer un super administrateur
    const superAdminPassword = await bcrypt.hash('admin123', 12);
    const superAdmin = await prisma.user.upsert({
      where: { email: 'admin@academiahub.com' },
      update: {},
      create: {
        schoolId: demoSchool.id,
        email: 'admin@academiahub.com',
        passwordHash: superAdminPassword,
        role: 'SUPER_ADMIN',
        status: 'active',
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+225 07 00 00 00 00'
      }
    });

    // 4. Créer un administrateur d'école
    const schoolAdminPassword = await bcrypt.hash('school123', 12);
    const schoolAdmin = await prisma.user.upsert({
      where: { email: 'directeur@demo.academiahub.com' },
      update: {},
      create: {
        schoolId: demoSchool.id,
        email: 'directeur@demo.academiahub.com',
        passwordHash: schoolAdminPassword,
        role: 'SCHOOL_ADMIN',
        status: 'active',
        firstName: 'Jean',
        lastName: 'Directeur',
        phone: '+225 07 00 00 00 01'
      }
    });

    logger.info('✅ Admin users created');

    // 5. Créer l'année académique
    const academicYear = await prisma.academicYear.upsert({
      where: {
        schoolId_name: {
          schoolId: demoSchool.id,
          name: '2024-2025'
        }
      },
      update: {},
      create: {
        schoolId: demoSchool.id,
        name: '2024-2025',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-07-31'),
        trimester: 2,
        isCurrent: true
      }
    });

    // 6. Créer des matières
    const subjects = [
      { name: 'Mathématiques', code: 'MATH', coefficient: 4, level: 'Secondaire' },
      { name: 'Français', code: 'FR', coefficient: 4, level: 'Secondaire' },
      { name: 'Anglais', code: 'ANG', coefficient: 3, level: 'Secondaire' },
      { name: 'Histoire-Géographie', code: 'HG', coefficient: 3, level: 'Secondaire' },
      { name: 'Sciences Physiques', code: 'SP', coefficient: 3, level: 'Secondaire' },
      { name: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 2, level: 'Secondaire' },
      { name: 'Éducation Physique et Sportive', code: 'EPS', coefficient: 1, level: 'Secondaire' }
    ];

    const subjectPromises = subjects.map(subject =>
      prisma.subject.upsert({
        where: {
          schoolId_code: {
            schoolId: demoSchool.id,
            code: subject.code
          }
        },
        update: {},
        create: {
          ...subject,
          schoolId: demoSchool.id
        }
      })
    );

    const createdSubjects = await Promise.all(subjectPromises);
    logger.info('✅ Subjects created');

    // 7. Créer des salles
    const rooms = [
      { name: 'Salle A101', capacity: 30, type: 'SALLE' },
      { name: 'Salle A102', capacity: 25, type: 'SALLE' },
      { name: 'Laboratoire Sciences', capacity: 20, type: 'LABO' },
      { name: 'Bibliothèque', capacity: 50, type: 'BIBLIOTHEQUE' },
      { name: 'Salle Informatique', capacity: 24, type: 'SALLE' }
    ];

    const roomPromises = rooms.map(room =>
      prisma.room.upsert({
        where: {
          schoolId_name: {
            schoolId: demoSchool.id,
            name: room.name
          }
        },
        update: {},
        create: {
          ...room,
          schoolId: demoSchool.id
        }
      })
    );

    const createdRooms = await Promise.all(roomPromises);
    logger.info('✅ Rooms created');

    // 8. Créer des enseignants
    const teacherPassword = await bcrypt.hash('teacher123', 12);
    
    const teachersData = [
      { firstName: 'Marie', lastName: 'Kouamé', email: 'marie.kouame@demo.academiahub.com', employeeId: 'T001', salary: 150000 },
      { firstName: 'Paul', lastName: 'Diabaté', email: 'paul.diabate@demo.academiahub.com', employeeId: 'T002', salary: 140000 },
      { firstName: 'Fatou', lastName: 'Traoré', email: 'fatou.traore@demo.academiahub.com', employeeId: 'T003', salary: 135000 },
      { firstName: 'Ibrahim', lastName: 'Koné', email: 'ibrahim.kone@demo.academiahub.com', employeeId: 'T004', salary: 145000 }
    ];

    const teachers = [];
    for (const teacherData of teachersData) {
      const user = await prisma.user.create({
        data: {
          schoolId: demoSchool.id,
          email: teacherData.email,
          passwordHash: teacherPassword,
          role: 'TEACHER',
          status: 'active',
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          phone: `+225 07 ${Math.floor(Math.random() * 90000000) + 10000000}`
        }
      });

      const teacher = await prisma.teacher.create({
        data: {
          schoolId: demoSchool.id,
          userId: user.id,
          employeeId: teacherData.employeeId,
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          email: teacherData.email,
          salary: teacherData.salary,
          hireDate: new Date('2024-09-01')
        }
      });

      teachers.push(teacher);
    }

    logger.info('✅ Teachers created');

    // 9. Créer des classes
    const classes = [
      { name: '6ème A', grade: '6ème', section: 'A', capacity: 35, teacherId: teachers[0].id },
      { name: '5ème B', grade: '5ème', section: 'B', capacity: 32, teacherId: teachers[1].id },
      { name: '4ème A', grade: '4ème', section: 'A', capacity: 30, teacherId: teachers[2].id },
      { name: '3ème C', grade: '3ème', section: 'C', capacity: 28, teacherId: teachers[3].id }
    ];

    const createdClasses = [];
    for (const classData of classes) {
      const createdClass = await prisma.class.create({
        data: {
          ...classData,
          schoolId: demoSchool.id,
          academicYear: '2024-2025'
        }
      });
      createdClasses.push(createdClass);
    }

    logger.info('✅ Classes created');

    // 10. Créer des élèves
    const studentPassword = await bcrypt.hash('student123', 12);
    
    const studentsData = [
      { firstName: 'Aya', lastName: 'Kouassi', gender: 'F', birthDate: new Date('2011-03-15'), classId: createdClasses[0].id },
      { firstName: 'Kofi', lastName: 'Asante', gender: 'M', birthDate: new Date('2010-07-22'), classId: createdClasses[1].id },
      { firstName: 'Aminata', lastName: 'Sow', gender: 'F', birthDate: new Date('2009-11-08'), classId: createdClasses[2].id },
      { firstName: 'Moussa', lastName: 'Dramé', gender: 'M', birthDate: new Date('2008-12-03'), classId: createdClasses[3].id },
      { firstName: 'Adjoa', lastName: 'Mensah', gender: 'F', birthDate: new Date('2011-05-18'), classId: createdClasses[0].id },
      { firstName: 'Kwame', lastName: 'Osei', gender: 'M', birthDate: new Date('2010-09-12'), classId: createdClasses[1].id }
    ];

    const students = [];
    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      
      const user = await prisma.user.create({
        data: {
          schoolId: demoSchool.id,
          email: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}@student.demo.academiahub.com`,
          passwordHash: studentPassword,
          role: 'STUDENT',
          status: 'active',
          firstName: studentData.firstName,
          lastName: studentData.lastName
        }
      });

      const student = await prisma.student.create({
        data: {
          schoolId: demoSchool.id,
          userId: user.id,
          educmasterNumber: `ED${String(i + 1).padStart(4, '0')}`,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: user.email,
          birthDate: studentData.birthDate,
          gender: studentData.gender,
          classId: studentData.classId,
          emergencyContactName: `Parent de ${studentData.firstName}`,
          emergencyContactPhone: `+225 07 ${Math.floor(Math.random() * 90000000) + 10000000}`,
          emergencyContactRelationship: 'Parent'
        }
      });

      students.push(student);
    }

    logger.info('✅ Students created');

    // 11. Créer quelques notes de démonstration
    const grades = [];
    for (const student of students) {
      for (let i = 0; i < 3; i++) { // 3 matières par élève
        const subject = createdSubjects[i % createdSubjects.length];
        const teacher = teachers[i % teachers.length];
        
        await prisma.grade.create({
          data: {
            studentId: student.id,
            subjectId: subject.id,
            teacherId: teacher.userId,
            trimester: 'T2',
            academicYear: '2024-2025',
            type: 'DS1',
            coefficient: 1,
            score: Math.floor(Math.random() * 15) + 5 // Notes entre 5 et 20
          }
        });
      }
    }

    logger.info('✅ Sample grades created');

    // 12. Créer des échelles de notation
    const gradeScales = [
      { level: 'SECONDAIRE', minScore: 16, maxScore: 20, emoji: '🎉', description: 'Excellent', observation: 'Travail exemplaire', recommendation: 'Continuez ainsi' },
      { level: 'SECONDAIRE', minScore: 14, maxScore: 15.99, emoji: '👏', description: 'Très bien', observation: 'Très bon travail', recommendation: 'Maintenez le cap' },
      { level: 'SECONDAIRE', minScore: 12, maxScore: 13.99, emoji: '👍', description: 'Bien', observation: 'Bon travail', recommendation: 'Peut mieux faire' },
      { level: 'SECONDAIRE', minScore: 10, maxScore: 11.99, emoji: '😐', description: 'Assez bien', observation: 'Travail satisfaisant', recommendation: 'Efforts à poursuivre' },
      { level: 'SECONDAIRE', minScore: 0, maxScore: 9.99, emoji: '😟', description: 'Insuffisant', observation: 'Travail insuffisant', recommendation: 'Redoubler d\'efforts' }
    ];

    for (const scale of gradeScales) {
      await prisma.gradeScale.create({
        data: {
          ...scale,
          schoolId: demoSchool.id
        }
      });
    }

    logger.info('✅ Grade scales created');

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('📧 Super Admin: admin@academiahub.com / admin123');
    logger.info('📧 School Admin: directeur@demo.academiahub.com / school123');
    logger.info('📧 Teacher: marie.kouame@demo.academiahub.com / teacher123');
    logger.info('📧 Student: aya.kouassi@student.demo.academiahub.com / student123');

  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });