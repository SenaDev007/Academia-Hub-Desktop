const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');

const prisma = new PrismaClient();

async function seedBeninEducationData() {
  try {
    logger.info('🇧🇯 Seeding Benin education system data...');

    // Récupérer l'école de démonstration
    const demoSchool = await prisma.school.findUnique({
      where: { subdomain: 'demo' }
    });

    if (!demoSchool) {
      logger.error('Demo school not found');
      return;
    }

    // 1. Créer les matières selon le système béninois

    // MATERNELLE - Matières par domaine
    const maternelleSubjects = [
      // Domaine 1: Développement du bien-être (santé et environnement)
      { 
        name: 'Education pour la santé', 
        code: 'EPS_MAT', 
        level: 'MATERNELLE',
        group: 'Développement du bien-être',
        domain: 'Santé et environnement'
      },
      { 
        name: 'Education à des réflexions de santé', 
        code: 'ERS_MAT', 
        level: 'MATERNELLE',
        group: 'Développement du bien-être',
        domain: 'Santé et environnement'
      },

      // Domaine 2: Développement du bien-être physique et du développement moteur
      { 
        name: 'Education du mouvement', 
        code: 'EDM_MAT', 
        level: 'MATERNELLE',
        group: 'Développement physique et moteur',
        domain: 'Expression corporelle'
      },
      { 
        name: 'Gestuelle', 
        code: 'GEST_MAT', 
        level: 'MATERNELLE',
        group: 'Développement physique et moteur',
        domain: 'Expression corporelle'
      },
      { 
        name: 'Rythmique', 
        code: 'RYTH_MAT', 
        level: 'MATERNELLE',
        group: 'Développement physique et moteur',
        domain: 'Expression corporelle'
      },

      // Domaine 3: Développement de la réflexion des aptitudes cognitives et intellectuelles
      { 
        name: 'Observation', 
        code: 'OBS_MAT', 
        level: 'MATERNELLE',
        group: 'Développement cognitif et intellectuel',
        domain: 'Santé des pré-apprentissages'
      },
      { 
        name: 'Education sensorielle', 
        code: 'ESENS_MAT', 
        level: 'MATERNELLE',
        group: 'Développement cognitif et intellectuel',
        domain: 'Santé des pré-apprentissages'
      },
      { 
        name: 'Pré-lecture', 
        code: 'PRELE_MAT', 
        level: 'MATERNELLE',
        group: 'Développement cognitif et intellectuel',
        domain: 'Santé des pré-apprentissages'
      },
      { 
        name: 'Pré-écriture', 
        code: 'PREEC_MAT', 
        level: 'MATERNELLE',
        group: 'Développement cognitif et intellectuel',
        domain: 'Santé des pré-apprentissages'
      },
      { 
        name: 'Pré-mathématique', 
        code: 'PREMATH_MAT', 
        level: 'MATERNELLE',
        group: 'Développement cognitif et intellectuel',
        domain: 'Santé des pré-apprentissages'
      },

      // Domaine 4: Développement des sentiments et des émotions
      { 
        name: 'Expression plastique', 
        code: 'EXPLA_MAT', 
        level: 'MATERNELLE',
        group: 'Développement émotionnel',
        domain: 'Santé émotionnelle'
      },
      { 
        name: 'Expression émotionnelle', 
        code: 'EXEMO_MAT', 
        level: 'MATERNELLE',
        group: 'Développement émotionnel',
        domain: 'Santé émotionnelle'
      },

      // Domaine 5: Développement des relations et de l'interaction sociale
      { 
        name: 'Langage', 
        code: 'LANG_MAT', 
        level: 'MATERNELLE',
        group: 'Développement social et socio-affectif',
        domain: 'Interaction sociale'
      },
      { 
        name: 'Conte', 
        code: 'CONTE_MAT', 
        level: 'MATERNELLE',
        group: 'Développement social et socio-affectif',
        domain: 'Interaction sociale'
      },
      { 
        name: 'Comptine', 
        code: 'COMPT_MAT', 
        level: 'MATERNELLE',
        group: 'Développement social et socio-affectif',
        domain: 'Interaction sociale'
      },
      { 
        name: 'Poésie', 
        code: 'POES_MAT', 
        level: 'MATERNELLE',
        group: 'Développement social et socio-affectif',
        domain: 'Interaction sociale'
      },
      { 
        name: 'Chant', 
        code: 'CHANT_MAT', 
        level: 'MATERNELLE',
        group: 'Développement social et socio-affectif',
        domain: 'Interaction sociale'
      }
    ];

    // PRIMAIRE - Matières par groupe (sans coefficient)
    const primaireSubjects = [
      // Groupe: Langue et littérature
      { 
        name: 'Communication orale', 
        code: 'COMOR_PRIM', 
        level: 'PRIMAIRE',
        group: 'Langue et littérature',
        coefficient: 1
      },
      { 
        name: 'Expression écrite', 
        code: 'EXPEC_PRIM', 
        level: 'PRIMAIRE',
        group: 'Langue et littérature',
        coefficient: 1
      },
      { 
        name: 'Lecture', 
        code: 'LECT_PRIM', 
        level: 'PRIMAIRE',
        group: 'Langue et littérature',
        coefficient: 1
      },
      { 
        name: 'Dictée', 
        code: 'DICT_PRIM', 
        level: 'PRIMAIRE',
        group: 'Langue et littérature',
        coefficient: 1
      },
      { 
        name: 'Anglais', 
        code: 'ANG_PRIM', 
        level: 'PRIMAIRE',
        group: 'Langue et littérature',
        coefficient: 1
      },

      // Groupe: Sciences
      { 
        name: 'Mathématiques', 
        code: 'MATH_PRIM', 
        level: 'PRIMAIRE',
        group: 'Sciences',
        coefficient: 1
      },
      { 
        name: 'Education Scientifique et Technologique', 
        code: 'EST_PRIM', 
        level: 'PRIMAIRE',
        group: 'Sciences',
        coefficient: 1
      },

      // Groupe: Sciences sociales
      { 
        name: 'Education Sociale', 
        code: 'ESOC_PRIM', 
        level: 'PRIMAIRE',
        group: 'Sciences sociales',
        coefficient: 1
      },

      // Groupe: Arts
      { 
        name: 'EA (Dessin/Couture)', 
        code: 'EADC_PRIM', 
        level: 'PRIMAIRE',
        group: 'Arts',
        coefficient: 1
      },
      { 
        name: 'EA (Poésie/Chant/Conte)', 
        code: 'EAPCC_PRIM', 
        level: 'PRIMAIRE',
        group: 'Arts',
        coefficient: 1
      },

      // Groupe: Sport
      { 
        name: 'Education Physique et Sportive', 
        code: 'EPS_PRIM', 
        level: 'PRIMAIRE',
        group: 'Sport',
        coefficient: 1
      },

      // Groupe: Entrepreneuriat
      { 
        name: 'Entrepreneuriat', 
        code: 'ENTR_PRIM', 
        level: 'PRIMAIRE',
        group: 'Entrepreneuriat',
        coefficient: 1
      }
    ];

    // SECONDAIRE - Matières par groupe
    const secondaireSubjects = [
      // Groupe: Langue et littérature
      { 
        name: 'Anglais', 
        code: 'ANG_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 2
      },
      { 
        name: 'Communication Ecrite', 
        code: 'COMEC_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 3
      },
      { 
        name: 'Lecture', 
        code: 'LECT_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 2
      },
      { 
        name: 'Français', 
        code: 'FR_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 4
      },
      { 
        name: 'Allemand', 
        code: 'ALL_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 2
      },
      { 
        name: 'Espagnole', 
        code: 'ESP_SEC', 
        level: 'SECONDAIRE',
        group: 'Langue et littérature',
        coefficient: 2
      },

      // Groupe: Sciences
      { 
        name: 'Mathématiques', 
        code: 'MATH_SEC', 
        level: 'SECONDAIRE',
        group: 'Sciences',
        coefficient: 4
      },
      { 
        name: 'Physique Chimie et Technologie', 
        code: 'PCT_SEC', 
        level: 'SECONDAIRE',
        group: 'Sciences',
        coefficient: 3
      },
      { 
        name: 'Science de la Vie et de la Terre', 
        code: 'SVT_SEC', 
        level: 'SECONDAIRE',
        group: 'Sciences',
        coefficient: 2
      },

      // Groupe: Sciences sociales
      { 
        name: 'Histoire & Géographie', 
        code: 'HG_SEC', 
        level: 'SECONDAIRE',
        group: 'Sciences sociales',
        coefficient: 3
      },
      { 
        name: 'Philosophie', 
        code: 'PHILO_SEC', 
        level: 'SECONDAIRE',
        group: 'Sciences sociales',
        coefficient: 2
      },

      // Groupe: Sport
      { 
        name: 'Education Physique et Sportive', 
        code: 'EPS_SEC', 
        level: 'SECONDAIRE',
        group: 'Sport',
        coefficient: 1
      },

      // Groupe: Entrepreneuriat
      { 
        name: 'Entrepreneuriat', 
        code: 'ENTR_SEC', 
        level: 'SECONDAIRE',
        group: 'Entrepreneuriat',
        coefficient: 1
      }
    ];

    // Créer toutes les matières
    const allSubjects = [
      ...maternelleSubjects,
      ...primaireSubjects,
      ...secondaireSubjects
    ];

    for (const subject of allSubjects) {
      await prisma.subject.upsert({
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
      });
    }

    logger.info('✅ Benin education subjects created');

    // 2. Créer les échelles de notation selon le système béninois

    // Échelles pour le primaire et secondaire (notes sur 20)
    const numericGradeScales = [
      {
        level: 'PRIMAIRE',
        minScore: 18,
        maxScore: 20,
        emoji: '🌟',
        description: 'Excellent',
        observation: 'Travail exceptionnel, continue ainsi !',
        recommendation: 'Maintiens ce niveau d\'excellence.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 16,
        maxScore: 17.99,
        emoji: '😊',
        description: 'Très Bien',
        observation: 'Très bon travail, résultats satisfaisants.',
        recommendation: 'Persévère pour atteindre l\'excellence.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 14,
        maxScore: 15.99,
        emoji: '👍',
        description: 'Bien',
        observation: 'Bon travail, efforts appréciables.',
        recommendation: 'Continue tes efforts pour progresser.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 12,
        maxScore: 13.99,
        emoji: '😐',
        description: 'Assez Bien',
        observation: 'Travail correct mais peut mieux faire.',
        recommendation: 'Redouble d\'efforts dans tes révisions.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 10,
        maxScore: 11.99,
        emoji: '⚠️',
        description: 'Passable',
        observation: 'Résultats justes, des lacunes à combler.',
        recommendation: 'Travaille davantage et demande de l\'aide.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 8,
        maxScore: 9.99,
        emoji: '❌',
        description: 'Insuffisant',
        observation: 'Résultats faibles, difficultés observées.',
        recommendation: 'Besoin de soutien et de travail personnel.'
      },
      {
        level: 'PRIMAIRE',
        minScore: 0,
        maxScore: 7.99,
        emoji: '🚫',
        description: 'Très Insuffisant',
        observation: 'Grandes difficultés, besoins d\'accompagnement.',
        recommendation: 'Suivi individualisé nécessaire, soutien parental requis.'
      }
    ];

    // Échelles pour le secondaire (identiques au primaire pour les notes)
    const secondaireGradeScales = numericGradeScales.map(scale => ({
      ...scale,
      level: 'SECONDAIRE'
    }));

    // Créer les échelles de notation
    const allGradeScales = [...numericGradeScales, ...secondaireGradeScales];

    for (const scale of allGradeScales) {
      await prisma.gradeScale.create({
        data: {
          ...scale,
          schoolId: demoSchool.id
        }
      });
    }

    // Échelles spécifiques pour la maternelle (évaluation qualitative)
    const maternelleGradeScales = [
      {
        minScore: 3,
        maxScore: 3,
        emoji: '🌟',
        description: 'TS - Très Satisfaisant',
        observation: 'Compétence maîtrisée',
        recommendation: 'Continue à développer tes compétences'
      },
      {
        minScore: 2,
        maxScore: 2,
        emoji: '👍',
        description: 'S - Satisfaisant',
        observation: 'Compétence en cours d\'acquisition',
        recommendation: 'Persévère dans tes efforts'
      },
      {
        minScore: 1,
        maxScore: 1,
        emoji: '⚠️',
        description: 'PS - Peu Satisfaisant',
        observation: 'Compétence non acquise',
        recommendation: 'Besoin d\'accompagnement supplémentaire'
      }
    ];

    for (const scale of maternelleGradeScales) {
      await prisma.gradeScalePrimary.create({
        data: {
          ...scale,
          schoolId: demoSchool.id
        }
      });
    }

    logger.info('✅ Benin education grade scales created');

    // 3. Créer des compétences selon l'APC (Approche Par Compétences)
    const competences = [
      {
        domain: 'DISCIPLINAIRE',
        level: 'EXPERT',
        description: 'Maîtrise parfaite des connaissances disciplinaires',
        criteria: ['Application autonome', 'Transfert des acquis', 'Innovation']
      },
      {
        domain: 'DISCIPLINAIRE',
        level: 'AVANCE',
        description: 'Bonne maîtrise des connaissances disciplinaires',
        criteria: ['Application guidée', 'Compréhension approfondie']
      },
      {
        domain: 'DISCIPLINAIRE',
        level: 'INTERMEDIAIRE',
        description: 'Maîtrise partielle des connaissances disciplinaires',
        criteria: ['Application avec aide', 'Compréhension de base']
      },
      {
        domain: 'DISCIPLINAIRE',
        level: 'DEBUTANT',
        description: 'Maîtrise insuffisante des connaissances disciplinaires',
        criteria: ['Difficultés d\'application', 'Compréhension limitée']
      },
      {
        domain: 'METHODOLOGIQUE',
        level: 'EXPERT',
        description: 'Excellente maîtrise des méthodes de travail',
        criteria: ['Organisation autonome', 'Méthodes efficaces', 'Planification']
      },
      {
        domain: 'METHODOLOGIQUE',
        level: 'AVANCE',
        description: 'Bonne maîtrise des méthodes de travail',
        criteria: ['Organisation guidée', 'Méthodes appropriées']
      },
      {
        domain: 'METHODOLOGIQUE',
        level: 'INTERMEDIAIRE',
        description: 'Maîtrise partielle des méthodes de travail',
        criteria: ['Organisation avec aide', 'Méthodes basiques']
      },
      {
        domain: 'METHODOLOGIQUE',
        level: 'DEBUTANT',
        description: 'Maîtrise insuffisante des méthodes de travail',
        criteria: ['Désorganisation', 'Méthodes inadaptées']
      },
      {
        domain: 'SOCIALE_CIVIQUE',
        level: 'EXPERT',
        description: 'Excellente intégration sociale et civique',
        criteria: ['Leadership positif', 'Respect exemplaire', 'Engagement citoyen']
      },
      {
        domain: 'SOCIALE_CIVIQUE',
        level: 'AVANCE',
        description: 'Bonne intégration sociale et civique',
        criteria: ['Collaboration active', 'Respect des règles']
      },
      {
        domain: 'SOCIALE_CIVIQUE',
        level: 'INTERMEDIAIRE',
        description: 'Intégration sociale et civique satisfaisante',
        criteria: ['Collaboration occasionnelle', 'Respect partiel']
      },
      {
        domain: 'SOCIALE_CIVIQUE',
        level: 'DEBUTANT',
        description: 'Difficultés d\'intégration sociale et civique',
        criteria: ['Isolement', 'Non-respect des règles']
      },
      {
        domain: 'PERSONNELLE_AUTONOMIE',
        level: 'EXPERT',
        description: 'Autonomie complète et initiative personnelle',
        criteria: ['Indépendance totale', 'Prise d\'initiative', 'Responsabilité']
      },
      {
        domain: 'PERSONNELLE_AUTONOMIE',
        level: 'AVANCE',
        description: 'Bonne autonomie personnelle',
        criteria: ['Indépendance guidée', 'Responsabilité partielle']
      },
      {
        domain: 'PERSONNELLE_AUTONOMIE',
        level: 'INTERMEDIAIRE',
        description: 'Autonomie en développement',
        criteria: ['Dépendance partielle', 'Responsabilité limitée']
      },
      {
        domain: 'PERSONNELLE_AUTONOMIE',
        level: 'DEBUTANT',
        description: 'Manque d\'autonomie personnelle',
        criteria: ['Forte dépendance', 'Manque de responsabilité']
      }
    ];

    for (const competence of competences) {
      await prisma.competence.create({
        data: {
          ...competence,
          schoolId: demoSchool.id
        }
      });
    }

    logger.info('✅ Benin education competences created');

    // 4. Créer des classes selon le système béninois
    const beninClasses = [
      // Maternelle
      { name: 'Petite Section A', grade: 'PS', section: 'A', academicYear: '2024-2025', capacity: 25 },
      { name: 'Moyenne Section B', grade: 'MS', section: 'B', academicYear: '2024-2025', capacity: 25 },
      { name: 'Grande Section C', grade: 'GS', section: 'C', academicYear: '2024-2025', capacity: 25 },
      
      // Primaire
      { name: 'CP A', grade: 'CP', section: 'A', academicYear: '2024-2025', capacity: 30 },
      { name: 'CE1 B', grade: 'CE1', section: 'B', academicYear: '2024-2025', capacity: 30 },
      { name: 'CE2 A', grade: 'CE2', section: 'A', academicYear: '2024-2025', capacity: 30 },
      { name: 'CM1 B', grade: 'CM1', section: 'B', academicYear: '2024-2025', capacity: 30 },
      { name: 'CM2 A', grade: 'CM2', section: 'A', academicYear: '2024-2025', capacity: 30 },
      
      // 1er Cycle Secondaire
      { name: '6ème A', grade: '6ème', section: 'A', academicYear: '2024-2025', capacity: 35 },
      { name: '5ème B', grade: '5ème', section: 'B', academicYear: '2024-2025', capacity: 35 },
      { name: '4ème A', grade: '4ème', section: 'A', academicYear: '2024-2025', capacity: 35 },
      { name: '3ème C', grade: '3ème', section: 'C', academicYear: '2024-2025', capacity: 35 },
      
      // 2nd Cycle Secondaire
      { name: '2nde C', grade: '2nde', section: 'C', academicYear: '2024-2025', capacity: 40 },
      { name: '1ère C', grade: '1ère', section: 'C', academicYear: '2024-2025', capacity: 40 },
      { name: 'Terminale C', grade: 'Terminale', section: 'C', academicYear: '2024-2025', capacity: 40 }
    ];

    // Récupérer les enseignants existants
    const teachers = await prisma.teacher.findMany({
      where: { schoolId: demoSchool.id }
    });

    for (let i = 0; i < beninClasses.length; i++) {
      const classData = beninClasses[i];
      const teacher = teachers[i % teachers.length]; // Assigner cycliquement

      await prisma.class.upsert({
        where: {
          schoolId_name_academicYear: {
            schoolId: demoSchool.id,
            name: classData.name,
            academicYear: classData.academicYear
          }
        },
        update: {},
        create: {
          ...classData,
          schoolId: demoSchool.id,
          teacherId: teacher?.id
        }
      });
    }

    logger.info('✅ Benin education classes created');

    logger.info('🎉 Benin education system data seeding completed!');

  } catch (error) {
    logger.error('❌ Error seeding Benin education data:', error);
    throw error;
  }
}

module.exports = { seedBeninEducationData };