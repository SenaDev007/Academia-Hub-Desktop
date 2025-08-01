import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
