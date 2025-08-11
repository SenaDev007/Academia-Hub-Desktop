/**
 * Utilitaires spécifiques au système éducatif béninois
 */

/**
 * Structure des niveaux d'éducation au Bénin
 */
const BENIN_EDUCATION_LEVELS = {
  MATERNELLE: {
    grades: ['PS', 'MS', 'GS'],
    evaluationType: 'QUALITATIVE',
    domains: [
      'Développement du bien-être',
      'Développement physique et moteur',
      'Développement cognitif et intellectuel',
      'Développement émotionnel',
      'Développement social et socio-affectif'
    ]
  },
  PRIMAIRE: {
    grades: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    evaluationType: 'NUMERIC',
    evaluationTypes: ['EM1', 'EM2', 'EC'],
    groups: [
      'Langue et littérature',
      'Sciences',
      'Sciences sociales',
      'Arts',
      'Sport',
      'Entrepreneuriat'
    ]
  },
  SECONDAIRE_1ER_CYCLE: {
    grades: ['6ème', '5ème', '4ème', '3ème'],
    evaluationType: 'NUMERIC',
    evaluationTypes: ['IE1', 'IE2', 'DS1', 'DS2'],
    useCoefficients: false,
    groups: [
      'Langue et littérature',
      'Sciences',
      'Sciences sociales',
      'Arts',
      'Sport',
      'Entrepreneuriat'
    ]
  },
  SECONDAIRE_2ND_CYCLE: {
    grades: ['2nde', '1ère', 'Terminale'],
    evaluationType: 'NUMERIC',
    evaluationTypes: ['IE1', 'IE2', 'DS1', 'DS2'],
    useCoefficients: true,
    groups: [
      'Langue et littérature',
      'Sciences',
      'Sciences sociales',
      'Arts',
      'Sport',
      'Entrepreneuriat'
    ]
  }
};

/**
 * Matières par niveau selon le système béninois
 */
const BENIN_SUBJECTS = {
  MATERNELLE: {
    'Développement du bien-être': [
      { name: 'Education pour la santé', code: 'EPS_MAT' },
      { name: 'Education à des réflexions de santé', code: 'ERS_MAT' }
    ],
    'Développement physique et moteur': [
      { name: 'Education du mouvement', code: 'EDM_MAT' },
      { name: 'Gestuelle', code: 'GEST_MAT' },
      { name: 'Rythmique', code: 'RYTH_MAT' }
    ],
    'Développement cognitif et intellectuel': [
      { name: 'Observation', code: 'OBS_MAT' },
      { name: 'Education sensorielle', code: 'ESENS_MAT' },
      { name: 'Pré-lecture', code: 'PRELE_MAT' },
      { name: 'Pré-écriture', code: 'PREEC_MAT' },
      { name: 'Pré-mathématique', code: 'PREMATH_MAT' }
    ],
    'Développement émotionnel': [
      { name: 'Expression plastique', code: 'EXPLA_MAT' },
      { name: 'Expression émotionnelle', code: 'EXEMO_MAT' }
    ],
    'Développement social et socio-affectif': [
      { name: 'Langage', code: 'LANG_MAT' },
      { name: 'Conte', code: 'CONTE_MAT' },
      { name: 'Comptine', code: 'COMPT_MAT' },
      { name: 'Poésie', code: 'POES_MAT' },
      { name: 'Chant', code: 'CHANT_MAT' }
    ]
  },
  PRIMAIRE: {
    'Langue et littérature': [
      { name: 'Communication orale', code: 'COMOR_PRIM', coefficient: 1 },
      { name: 'Expression écrite', code: 'EXPEC_PRIM', coefficient: 1 },
      { name: 'Lecture', code: 'LECT_PRIM', coefficient: 1 },
      { name: 'Dictée', code: 'DICT_PRIM', coefficient: 1 },
      { name: 'Anglais', code: 'ANG_PRIM', coefficient: 1 }
    ],
    'Sciences': [
      { name: 'Mathématiques', code: 'MATH_PRIM', coefficient: 1 },
      { name: 'Education Scientifique et Technologique', code: 'EST_PRIM', coefficient: 1 }
    ],
    'Sciences sociales': [
      { name: 'Education Sociale', code: 'ESOC_PRIM', coefficient: 1 }
    ],
    'Arts': [
      { name: 'EA (Dessin/Couture)', code: 'EADC_PRIM', coefficient: 1 },
      { name: 'EA (Poésie/Chant/Conte)', code: 'EAPCC_PRIM', coefficient: 1 }
    ],
    'Sport': [
      { name: 'Education Physique et Sportive', code: 'EPS_PRIM', coefficient: 1 }
    ],
    'Entrepreneuriat': [
      { name: 'Entrepreneuriat', code: 'ENTR_PRIM', coefficient: 1 }
    ]
  },
  SECONDAIRE: {
    'Langue et littérature': [
      { name: 'Anglais', code: 'ANG_SEC', coefficient: 2 },
      { name: 'Communication Ecrite', code: 'COMEC_SEC', coefficient: 3 },
      { name: 'Lecture', code: 'LECT_SEC', coefficient: 2 },
      { name: 'Français', code: 'FR_SEC', coefficient: 4 },
      { name: 'Allemand', code: 'ALL_SEC', coefficient: 2 },
      { name: 'Espagnole', code: 'ESP_SEC', coefficient: 2 }
    ],
    'Sciences': [
      { name: 'Mathématiques', code: 'MATH_SEC', coefficient: 4 },
      { name: 'Physique Chimie et Technologie', code: 'PCT_SEC', coefficient: 3 },
      { name: 'Science de la Vie et de la Terre', code: 'SVT_SEC', coefficient: 2 }
    ],
    'Sciences sociales': [
      { name: 'Histoire & Géographie', code: 'HG_SEC', coefficient: 3 },
      { name: 'Philosophie', code: 'PHILO_SEC', coefficient: 2 }
    ],
    'Sport': [
      { name: 'Education Physique et Sportive', code: 'EPS_SEC', coefficient: 1 }
    ],
    'Entrepreneuriat': [
      { name: 'Entrepreneuriat', code: 'ENTR_SEC', coefficient: 1 }
    ]
  }
};

/**
 * Obtenir la structure éducative pour un niveau donné
 */
function getEducationStructure(level) {
  return BENIN_EDUCATION_LEVELS[level] || null;
}

/**
 * Obtenir les matières pour un niveau et un groupe donnés
 */
function getSubjectsByLevelAndGroup(level, group) {
  const subjects = BENIN_SUBJECTS[level];
  if (!subjects) return [];
  
  return subjects[group] || [];
}

/**
 * Obtenir tous les groupes pour un niveau donné
 */
function getGroupsByLevel(level) {
  const structure = BENIN_EDUCATION_LEVELS[level];
  if (!structure) return [];
  
  if (level === 'MATERNELLE') {
    return structure.domains;
  } else {
    return structure.groups;
  }
}

/**
 * Valider un type d'évaluation pour un niveau donné
 */
function validateEvaluationType(level, evaluationType) {
  const structure = BENIN_EDUCATION_LEVELS[level];
  if (!structure) return false;
  
  if (level === 'MATERNELLE') {
    return ['OBSERVATION_CONTINUE', 'BILAN_TRIMESTRE', 'BILAN_ANNUEL'].includes(evaluationType);
  }
  
  return structure.evaluationTypes.includes(evaluationType);
}

/**
 * Déterminer si les coefficients sont utilisés pour un niveau
 */
function useCoefficients(level) {
  const structure = BENIN_EDUCATION_LEVELS[level];
  return structure?.useCoefficients || false;
}

/**
 * Obtenir le type d'évaluation pour un niveau
 */
function getEvaluationType(level) {
  const structure = BENIN_EDUCATION_LEVELS[level];
  return structure?.evaluationType || 'NUMERIC';
}

/**
 * Créer les matières par défaut pour une école selon le système béninois
 */
async function createDefaultSubjects(schoolId, prisma) {
  const createdSubjects = [];
  
  for (const [level, groups] of Object.entries(BENIN_SUBJECTS)) {
    for (const [group, subjects] of Object.entries(groups)) {
      for (const subject of subjects) {
        try {
          const createdSubject = await prisma.subject.create({
            data: {
              name: subject.name,
              code: subject.code,
              level,
              group,
              coefficient: subject.coefficient || (level === 'MATERNELLE' ? 0 : 1),
              schoolId
            }
          });
          createdSubjects.push(createdSubject);
        } catch (error) {
          // Ignorer les erreurs de duplication
          if (error.code !== 'P2002') {
            throw error;
          }
        }
      }
    }
  }
  
  return createdSubjects;
}

/**
 * Obtenir les compétences par domaine pour l'APC (Approche Par Compétences)
 */
const COMPETENCES_APC = {
  DISCIPLINAIRE: {
    description: 'Maîtrise des connaissances et savoir-faire disciplinaires',
    levels: {
      EXPERT: 'Maîtrise parfaite avec capacité d\'innovation et de transfert',
      AVANCE: 'Bonne maîtrise avec application autonome',
      INTERMEDIAIRE: 'Maîtrise partielle avec aide ponctuelle',
      DEBUTANT: 'Maîtrise insuffisante nécessitant un accompagnement'
    }
  },
  METHODOLOGIQUE: {
    description: 'Maîtrise des méthodes de travail et d\'apprentissage',
    levels: {
      EXPERT: 'Organisation autonome et méthodes efficaces',
      AVANCE: 'Bonne organisation avec méthodes appropriées',
      INTERMEDIAIRE: 'Organisation avec aide et méthodes basiques',
      DEBUTANT: 'Désorganisation et méthodes inadaptées'
    }
  },
  SOCIALE_CIVIQUE: {
    description: 'Capacité d\'intégration sociale et civique',
    levels: {
      EXPERT: 'Leadership positif et engagement citoyen exemplaire',
      AVANCE: 'Collaboration active et respect des règles',
      INTERMEDIAIRE: 'Collaboration occasionnelle et respect partiel',
      DEBUTANT: 'Difficultés d\'intégration et non-respect des règles'
    }
  },
  PERSONNELLE_AUTONOMIE: {
    description: 'Développement de l\'autonomie et de la responsabilité personnelle',
    levels: {
      EXPERT: 'Autonomie complète avec prise d\'initiative',
      AVANCE: 'Bonne autonomie avec responsabilité partielle',
      INTERMEDIAIRE: 'Autonomie en développement avec dépendance partielle',
      DEBUTANT: 'Manque d\'autonomie et de responsabilité'
    }
  }
};

/**
 * Obtenir la description d'une compétence
 */
function getCompetenceDescription(domain, level) {
  const competence = COMPETENCES_APC[domain];
  if (!competence) return null;
  
  return {
    domain: competence.description,
    level: competence.levels[level] || 'Niveau non défini'
  };
}

module.exports = {
  BENIN_EDUCATION_LEVELS,
  BENIN_SUBJECTS,
  COMPETENCES_APC,
  getEducationStructure,
  getSubjectsByLevelAndGroup,
  getGroupsByLevel,
  validateEvaluationType,
  useCoefficients,
  getEvaluationType,
  createDefaultSubjects,
  getCompetenceDescription
};