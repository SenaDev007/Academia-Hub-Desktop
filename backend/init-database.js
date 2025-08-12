const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initDatabase() {
  console.log('🚀 Initialisation de la base de données...');
  
  try {
    // Créer une école exemple
    const school = await prisma.school.create({
      data: {
        name: 'Academia Hub École Exemple',
        subdomain: 'academia-hub-exemple',
        planId: 'basic-plan',
        address: '123 Rue de l\'Éducation',
        city: 'Dakar',
        country: 'Sénégal',
        phone: '+221 33 123 4567',
        email: 'contact@academia-hub.sn',
        website: 'https://academia-hub.sn',
        logo: 'https://academia-hub.sn/logo.png',
        timezone: 'Africa/Dakar',
        currency: 'XOF',
        language: 'fr',
        maxStudents: 500,
        maxTeachers: 50,
        maxClasses: 25,
        maxStorageGB: 100,
        features: ['students', 'finance', 'planning', 'health'],
        isActive: true,
      }
    });

    console.log('✅ École créée:', school.id);

    // Créer des utilisateurs exemple
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@academia-hub.sn',
          passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'SCHOOL_ADMIN',
          firstName: 'Admin',
          lastName: 'Principal',
          schoolId: school.id,
          isActive: true,
        }
      }),
      prisma.user.create({
        data: {
          email: 'teacher@academia-hub.sn',
          passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          role: 'TEACHER',
          firstName: 'Marie',
          lastName: 'Diop',
          schoolId: school.id,
          isActive: true,
        }
      })
    ]);

    console.log('✅ Utilisateurs créés:', users.length);

    // Créer des classes exemple
    const classes = await Promise.all([
      prisma.class.create({
        data: {
          name: '6ème A',
          level: 'Collège',
          capacity: 30,
          schoolId: school.id,
          isActive: true,
        }
      }),
      prisma.class.create({
        data: {
          name: '5ème B',
          level: 'Collège',
          capacity: 28,
          schoolId: school.id,
          isActive: true,
        }
      })
    ]);

    console.log('✅ Classes créées:', classes.length);

    // Créer des étudiants exemple
    const students = await Promise.all([
      prisma.student.create({
        data: {
          firstName: 'Aminata',
          lastName: 'Diallo',
          dateOfBirth: new Date('2010-05-15'),
          gender: 'FEMALE',
          registrationNumber: 'STU-2024-001',
          classId: classes[0].id,
          schoolId: school.id,
          isActive: true,
        }
      }),
      prisma.student.create({
        data: {
          firstName: 'Moussa',
          lastName: 'Fall',
          dateOfBirth: new Date('2009-08-22'),
          gender: 'MALE',
          registrationNumber: 'STU-2024-002',
          classId: classes[1].id,
          schoolId: school.id,
          isActive: true,
        }
      })
    ]);

    console.log('✅ Étudiants créés:', students.length);

    // Créer des dossiers médicaux exemple
    const medicalRecords = await Promise.all([
      prisma.medicalRecord.create({
        data: {
          studentId: students[0].id,
          schoolId: school.id,
          bloodType: 'O+',
          allergies: ['Arachides', 'Lactose'],
          chronicConditions: ['Asthme'],
          medications: ['Ventoline'],
          emergencyContact: 'Papa Diallo',
          emergencyPhone: '+221 77 123 4567',
          insuranceNumber: 'INS-001',
          vaccinationStatus: 'complete',
        }
      }),
      prisma.medicalRecord.create({
        data: {
          studentId: students[1].id,
          schoolId: school.id,
          bloodType: 'A+',
          allergies: [],
          chronicConditions: [],
          medications: [],
          emergencyContact: 'Maman Fall',
          emergencyPhone: '+221 77 987 6543',
          insuranceNumber: 'INS-002',
          vaccinationStatus: 'pending',
        }
      })
    ]);

    console.log('✅ Dossiers médicaux créés:', medicalRecords.length);

    // Créer des paiements exemple
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          amount: 150000,
          currency: 'XOF',
          status: 'PAID',
          type: 'TUITION',
          method: 'CASH',
          description: 'Frais de scolarité 2024',
          schoolId: school.id,
          createdById: users[0].id,
        }
      })
    ]);

    console.log('✅ Paiements créés:', payments.length);

    // Créer des emplois du temps exemple
    const schedules = await Promise.all([
      prisma.schedule.create({
        data: {
          classId: classes[0].id,
          subjectId: 'MATH',
          teacherId: users[1].id,
          day: 'LUNDI',
          startTime: '08:00',
          endTime: '09:00',
          schoolId: school.id,
          isActive: true,
        }
      })
    ]);

    console.log('✅ Emplois du temps créés:', schedules.length);

    console.log('🎉 Base de données initialisée avec succès!');
    console.log('📊 Tables créées: 20+');
    console.log('👥 Données exemple: école, utilisateurs, étudiants, dossiers médicaux');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
