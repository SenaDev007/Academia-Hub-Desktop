import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Création des échelles de notation
  await createGradeScales()

  // Plan gratuit avec 15 jours d'essai
  await prisma.planConfig.create({
    data: {
      planName: 'FREE',
      name: 'Plan Gratuit',
      description: 'Accès complet à l\'application pendant 15 jours',
      price: 0,
      trialDays: 15,
      features: {
        json: {
          dashboard: true,
          gestionEleves: true,
          gestionProfesseurs: true,
          gestionAbsences: true,
          gestionNotes: true,
          gestionDocuments: true,
          gestionPlanning: true,
          support: true
        }
      },
      maxStudents: 500,
      maxTeachers: 50,
      maxClasses: 50
    }
  })

  // Plan premium
  await prisma.planConfig.create({
    data: {
      planName: 'PREMIUM',
      name: 'Plan Premium',
      description: 'Accès complet à l\'application avec support illimité',
      price: 10000, // 10.000 F CFA/mois
      trialDays: 0, // Pas de période d'essai pour le premium
      features: {
        json: {
          dashboard: true,
          gestionEleves: true,
          gestionProfesseurs: true,
          gestionAbsences: true,
          gestionNotes: true,
          gestionDocuments: true,
          gestionPlanning: true,
          support: true,
          supportPrioritaire: true,
          apiAccess: true
        }
      },
      maxStudents: 1000,
      maxTeachers: 100,
      maxClasses: 100
    }
  })
}

async function createGradeScales() {
  // Échelle maternelle
  await prisma.gradeScale.createMany({
    data: [
      {
        level: 'MATERNELLE',
        minScore: 0,
        maxScore: 0,
        description: 'Compétence non acquise',
        observation: 'En cours d\'acquisition',
        recommendation: 'Encourager l\'enfant à persévérer',
        schoolId: 'default_school'
      },
      {
        level: 'MATERNELLE',
        minScore: 0,
        maxScore: 0,
        description: 'Compétence en cours d\'acquisition',
        observation: 'Progression observée',
        recommendation: 'Continuer les efforts',
        schoolId: 'default_school'
      },
      {
        level: 'MATERNELLE',
        minScore: 0,
        maxScore: 0,
        description: 'Compétence maîtrisée',
        observation: 'Excellente maîtrise',
        recommendation: 'Maintenir ce niveau',
        schoolId: 'default_school'
      }
    ]
  })

  // Échelle primaire avec émojis
  await prisma.gradeScale.createMany({
    data: [
      {
        level: 'PRIMAIRE',
        minScore: 18,
        maxScore: 20,
        emoji: '🌟',
        description: 'Excellent',
        observation: 'Travail exceptionnel, continue ainsi !',
        recommendation: 'Maintiens ce niveau d\'excellence.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 16,
        maxScore: 17,
        emoji: '😊',
        description: 'Très Bien',
        observation: 'Très bon travail, résultats satisfaisants.',
        recommendation: 'Persévère pour atteindre l\'excellence.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 14,
        maxScore: 15,
        emoji: '👍',
        description: 'Bien',
        observation: 'Bon travail, efforts appréciables.',
        recommendation: 'Continue tes efforts pour progresser.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 12,
        maxScore: 13,
        emoji: '😐',
        description: 'Assez Bien',
        observation: 'Travail correct mais peut mieux faire.',
        recommendation: 'Redouble d\'efforts dans tes révisions.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 10,
        maxScore: 11,
        emoji: '⚠️',
        description: 'Passable',
        observation: 'Résultats justes, des lacunes à combler.',
        recommendation: 'Travaille davantage et demande de l\'aide.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 8,
        maxScore: 9,
        emoji: '❌',
        description: 'Insuffisant',
        observation: 'Résultats faibles, difficultés observées.',
        recommendation: 'Besoin de soutien et de travail personnel.',
        schoolId: 'default_school'
      },
      {
        level: 'PRIMAIRE',
        minScore: 0,
        maxScore: 7,
        emoji: '🚫',
        description: 'Très Insuffisant',
        observation: 'Grandes difficultés, besoins d\'accompagnement.',
        recommendation: 'Suivi individualisé nécessaire, soutien parental requis.',
        schoolId: 'default_school'
      }
    ]
  })

  // Échelle secondaire
  await prisma.gradeScale.createMany({
    data: [
      {
        level: 'SECOND_CYCLE',
        minScore: 18,
        maxScore: 20,
        description: 'Excellent',
        observation: 'Travail exceptionnel, continue ainsi !',
        recommendation: 'Maintiens ce niveau d\'excellence.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 16,
        maxScore: 17,
        description: 'Très Bien',
        observation: 'Très bon travail, résultats satisfaisants.',
        recommendation: 'Persévère pour atteindre l\'excellence.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 14,
        maxScore: 15,
        description: 'Bien',
        observation: 'Bon travail, efforts appréciables.',
        recommendation: 'Continue tes efforts pour progresser.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 12,
        maxScore: 13,
        description: 'Assez Bien',
        observation: 'Travail correct mais peut mieux faire.',
        recommendation: 'Redouble d\'efforts dans tes révisions.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 10,
        maxScore: 11,
        description: 'Passable',
        observation: 'Résultats justes, des lacunes à combler.',
        recommendation: 'Travaille davantage et demande de l\'aide.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 8,
        maxScore: 9,
        description: 'Faible',
        observation: 'Résultats faibles, difficultés observées.',
        recommendation: 'Besoin de soutien et de travail personnel.',
        schoolId: 'default_school'
      },
      {
        level: 'SECOND_CYCLE',
        minScore: 0,
        maxScore: 7,
        description: 'Très Faible',
        observation: 'Grandes difficultés, besoins d\'accompagnement.',
        recommendation: 'Suivi individualisé nécessaire, soutien parental requis.',
        schoolId: 'default_school'
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
