/**
 * Utilitaires de calcul des moyennes selon le système éducatif béninois
 */

/**
 * Calcul de moyenne d'une évaluation au primaire (EM1, EM2 ou EC)
 * @param {Array} notesMatieres - Liste des notes de toutes les matières pour cette évaluation
 * @returns {number|null} - Moyenne calculée ou null si pas de notes valides
 */
function calculerMoyenneEvaluationPrimaire(notesMatieres) {
  if (!notesMatieres || notesMatieres.length === 0) {
    return null;
  }
  
  const notesValides = notesMatieres.filter(n => n !== null && n !== undefined && !isNaN(n));
  if (notesValides.length === 0) {
    return null;
  }
    
  return Math.round((notesValides.reduce((sum, note) => sum + note, 0) / notesValides.length) * 100) / 100;
}

/**
 * Calcul de moyenne trimestrielle au primaire
 * @param {number} moyenneEm1 - Moyenne de l'évaluation mensuelle 1
 * @param {number} moyenneEm2 - Moyenne de l'évaluation mensuelle 2
 * @param {number} moyenneEc - Moyenne de l'évaluation certificative
 * @returns {number|null} - Moyenne trimestrielle ou null
 */
function calculerMoyenneTrimestriellePrimaire(moyenneEm1, moyenneEm2, moyenneEc) {
  if ([moyenneEm1, moyenneEm2, moyenneEc].some(m => m === null || m === undefined || isNaN(m))) {
    return null;
  }
  
  const moyenneEmTrimestre = (moyenneEm1 + moyenneEm2) / 2;
  const moyenneTrimestrielle = (moyenneEmTrimestre + moyenneEc) / 2;
  return Math.round(moyenneTrimestrielle * 100) / 100;
}

/**
 * Calcul de moyenne annuelle au primaire
 * @param {Array} moyennesEmAnnee - Liste des 6 moyennes EM de l'année
 * @param {Array} moyennesEcAnnee - Liste des 3 moyennes EC de l'année
 * @returns {number|null} - Moyenne annuelle ou null
 */
function calculerMoyenneAnnuellePrimaire(moyennesEmAnnee, moyennesEcAnnee) {
  if (!moyennesEmAnnee || !moyennesEcAnnee || moyennesEmAnnee.length === 0 || moyennesEcAnnee.length === 0) {
    return null;
  }
  
  // Moyenne de toutes les évaluations mensuelles de l'année
  const emValides = moyennesEmAnnee.filter(m => m !== null && m !== undefined && !isNaN(m));
  if (emValides.length === 0) {
    return null;
  }
  const moyenneToutesEm = emValides.reduce((sum, m) => sum + m, 0) / emValides.length;
  
  // Moyenne de toutes les évaluations certificatives de l'année
  const ecValides = moyennesEcAnnee.filter(m => m !== null && m !== undefined && !isNaN(m));
  if (ecValides.length === 0) {
    return null;
  }
  const moyenneToutesEc = ecValides.reduce((sum, m) => sum + m, 0) / ecValides.length;
  
  // Moyenne annuelle
  const moyenneAnnuelle = (moyenneToutesEm + moyenneToutesEc) / 2;
  return Math.round(moyenneAnnuelle * 100) / 100;
}

/**
 * Calcul de moyenne d'une matière au 1er cycle secondaire
 * @param {number} ie1 - Interrogation écrite 1
 * @param {number} ie2 - Interrogation écrite 2
 * @param {number} ds1 - Devoir surveillé 1
 * @param {number} ds2 - Devoir surveillé 2
 * @returns {number|null} - Moyenne de la matière ou null
 */
function calculerMoyenneMatiere1erCycle(ie1, ie2, ds1, ds2) {
  const evaluations = [ie1, ie2, ds1, ds2];
  if (evaluations.some(e => e === null || e === undefined || isNaN(e))) {
    return null;
  }
  
  const moyenneIe = (ie1 + ie2) / 2;
  const sommeDs = ds1 + ds2;
  const moyenneMatiere = (moyenneIe + sommeDs) / 3;
  
  return Math.round(moyenneMatiere * 100) / 100;
}

/**
 * Calcul de moyenne trimestrielle au 1er cycle secondaire (sans coefficient)
 * @param {Array} moyennesMatieres - Liste des moyennes des matières
 * @returns {number|null} - Moyenne trimestrielle ou null
 */
function calculerMoyenneTrimestre1erCycle(moyennesMatieres) {
  if (!moyennesMatieres || moyennesMatieres.length === 0) {
    return null;
  }
  
  const moyennesValides = moyennesMatieres.filter(m => m !== null && m !== undefined && !isNaN(m));
  if (moyennesValides.length === 0) {
    return null;
  }
    
  return Math.round((moyennesValides.reduce((sum, m) => sum + m, 0) / moyennesValides.length) * 100) / 100;
}

/**
 * Calcul de moyenne d'une matière au 2nd cycle secondaire avec coefficient
 * @param {number} ie1 - Interrogation écrite 1
 * @param {number} ie2 - Interrogation écrite 2
 * @param {number} ds1 - Devoir surveillé 1
 * @param {number} ds2 - Devoir surveillé 2
 * @param {number} coefficient - Coefficient de la matière
 * @returns {number|null} - Moyenne pondérée de la matière ou null
 */
function calculerMoyenneMatiere2ndCycle(ie1, ie2, ds1, ds2, coefficient) {
  const evaluations = [ie1, ie2, ds1, ds2];
  if (evaluations.some(e => e === null || e === undefined || isNaN(e)) || !coefficient || isNaN(coefficient)) {
    return null;
  }
  
  const moyenneIe = (ie1 + ie2) / 2;
  const sommeDs = ds1 + ds2;
  const moyenneBase = (moyenneIe + sommeDs) / 3;
  const moyennePonderee = moyenneBase * coefficient;
  
  return Math.round(moyennePonderee * 100) / 100;
}

/**
 * Calcul de moyenne trimestrielle au 2nd cycle secondaire (avec coefficients)
 * @param {Array} moyennesMatieresPoiderees - Moyennes déjà multipliées par leurs coefficients
 * @param {Array} coefficients - Liste des coefficients correspondants
 * @returns {number|null} - Moyenne trimestrielle pondérée ou null
 */
function calculerMoyenneTrimestre2ndCycle(moyennesMatieresPoiderees, coefficients) {
  if (!moyennesMatieresPoiderees || !coefficients || moyennesMatieresPoiderees.length === 0 || coefficients.length === 0) {
    return null;
  }
  
  // Filtrer les données valides
  const donneesValides = moyennesMatieresPoiderees
    .map((m, index) => ({ moyenne: m, coeff: coefficients[index] }))
    .filter(d => d.moyenne !== null && d.moyenne !== undefined && !isNaN(d.moyenne) && 
                 d.coeff !== null && d.coeff !== undefined && !isNaN(d.coeff));
  
  if (donneesValides.length === 0) {
    return null;
  }
  
  const sommeMoyennesPonderees = donneesValides.reduce((sum, d) => sum + d.moyenne, 0);
  const sommeCoefficients = donneesValides.reduce((sum, d) => sum + d.coeff, 0);
  
  return Math.round((sommeMoyennesPonderees / sommeCoefficients) * 100) / 100;
}

/**
 * Calcul de moyenne annuelle au secondaire (1er et 2nd cycle)
 * @param {number} moyenneT1 - Moyenne du trimestre 1
 * @param {number} moyenneT2 - Moyenne du trimestre 2
 * @param {number} moyenneT3 - Moyenne du trimestre 3
 * @returns {number|null} - Moyenne annuelle ou null
 */
function calculerMoyenneAnnuelleSecondaire(moyenneT1, moyenneT2, moyenneT3) {
  const moyennes = [moyenneT1, moyenneT2, moyenneT3];
  const moyennesValides = moyennes.filter(m => m !== null && m !== undefined && !isNaN(m));
  
  if (moyennesValides.length === 0) {
    return null;
  }
    
  return Math.round((moyennesValides.reduce((sum, m) => sum + m, 0) / moyennesValides.length) * 100) / 100;
}

/**
 * Attribution de mention avec emoji selon la moyenne
 * @param {number} moyenne - Moyenne calculée
 * @returns {Object} - Objet contenant mention, emoji, observation et recommandation
 */
function attribuerMentionEtEmoji(moyenne) {
  if (moyenne >= 18) {
    return {
      mention: "Excellent",
      emoji: "🌟",
      observation: "Travail exceptionnel, continue ainsi !",
      recommandation: "Maintiens ce niveau d'excellence."
    };
  } else if (moyenne >= 16) {
    return {
      mention: "Très Bien",
      emoji: "😊", 
      observation: "Très bon travail, résultats satisfaisants.",
      recommandation: "Persévère pour atteindre l'excellence."
    };
  } else if (moyenne >= 14) {
    return {
      mention: "Bien",
      emoji: "👍",
      observation: "Bon travail, efforts appréciables.",
      recommandation: "Continue tes efforts pour progresser."
    };
  } else if (moyenne >= 12) {
    return {
      mention: "Assez Bien",
      emoji: "😐",
      observation: "Travail correct mais peut mieux faire.",
      recommandation: "Redouble d'efforts dans tes révisions."
    };
  } else if (moyenne >= 10) {
    return {
      mention: "Passable",
      emoji: "⚠️",
      observation: "Résultats justes, des lacunes à combler.",
      recommandation: "Travaille davantage et demande de l'aide."
    };
  } else if (moyenne >= 8) {
    return {
      mention: "Insuffisant",
      emoji: "❌",
      observation: "Résultats faibles, difficultés observées.",
      recommandation: "Besoin de soutien et de travail personnel."
    };
  } else {
    return {
      mention: "Très Insuffisant",
      emoji: "🚫",
      observation: "Grandes difficultés, besoins d'accompagnement.",
      recommandation: "Suivi individualisé nécessaire, soutien parental requis."
    };
  }
}

/**
 * Évaluation qualitative pour la maternelle
 * @param {string} code - Code d'évaluation (TS, S, PS)
 * @returns {Object} - Objet contenant description, emoji, observation et recommandation
 */
function evaluerCompetenceMaternelle(code) {
  switch (code) {
    case 'TS':
      return {
        description: "Très Satisfaisant",
        emoji: "🌟",
        observation: "Compétence maîtrisée",
        recommandation: "Continue à développer tes compétences"
      };
    case 'S':
      return {
        description: "Satisfaisant",
        emoji: "👍",
        observation: "Compétence en cours d'acquisition",
        recommandation: "Persévère dans tes efforts"
      };
    case 'PS':
      return {
        description: "Peu Satisfaisant",
        emoji: "⚠️",
        observation: "Compétence non acquise",
        recommandation: "Besoin d'accompagnement supplémentaire"
      };
    default:
      return {
        description: "Non évalué",
        emoji: "❓",
        observation: "Évaluation en attente",
        recommandation: "Évaluation à effectuer"
      };
  }
}

/**
 * Validation d'une note
 * @param {number} note - Note à valider
 * @returns {boolean} - True si la note est valide
 */
function validerNote(note) {
  return note !== null && note !== undefined && !isNaN(note) && note >= 0 && note <= 20;
}

/**
 * Validation d'un code d'évaluation maternelle
 * @param {string} code - Code à valider
 * @returns {boolean} - True si le code est valide
 */
function validerCodeMaternelle(code) {
  return ['TS', 'S', 'PS'].includes(code);
}

/**
 * Déterminer le niveau d'éducation selon la classe
 * @param {string} grade - Niveau de classe (6ème, 5ème, etc.)
 * @returns {string} - Niveau d'éducation
 */
function determinerNiveauEducation(grade) {
  const gradeUpper = grade.toUpperCase();
  
  if (['PS', 'MS', 'GS'].includes(gradeUpper)) {
    return 'MATERNELLE';
  }
  
  if (['CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(gradeUpper)) {
    return 'PRIMAIRE';
  }
  
  if (['6ÈME', '6EME', '5ÈME', '5EME', '4ÈME', '4EME', '3ÈME', '3EME'].includes(gradeUpper)) {
    return 'SECONDAIRE_1ER_CYCLE';
  }
  
  if (['2NDE', 'SECONDE', '1ÈRE', '1ERE', 'PREMIÈRE', 'PREMIERE', 'TERMINALE', 'TERM'].includes(gradeUpper)) {
    return 'SECONDAIRE_2ND_CYCLE';
  }
  
  return 'SECONDAIRE_1ER_CYCLE'; // Par défaut
}

/**
 * Déterminer le groupe de matière selon le niveau
 * @param {string} subjectName - Nom de la matière
 * @param {string} level - Niveau d'éducation
 * @returns {string} - Groupe de la matière
 */
function determinerGroupeMatiere(subjectName, level) {
  const subject = subjectName.toLowerCase();
  
  if (level === 'MATERNELLE') {
    if (subject.includes('santé') || subject.includes('environnement')) {
      return 'Développement du bien-être';
    }
    if (subject.includes('mouvement') || subject.includes('gestuelle') || subject.includes('rythmique')) {
      return 'Développement physique et moteur';
    }
    if (subject.includes('observation') || subject.includes('sensorielle') || subject.includes('pré-')) {
      return 'Développement cognitif et intellectuel';
    }
    if (subject.includes('plastique') || subject.includes('émotionnelle')) {
      return 'Développement émotionnel';
    }
    if (subject.includes('langage') || subject.includes('conte') || subject.includes('comptine') || subject.includes('poésie') || subject.includes('chant')) {
      return 'Développement social et socio-affectif';
    }
  }
  
  if (level === 'PRIMAIRE' || level === 'SECONDAIRE') {
    if (subject.includes('français') || subject.includes('communication') || subject.includes('lecture') || subject.includes('dictée') || subject.includes('anglais') || subject.includes('allemand') || subject.includes('espagnol')) {
      return 'Langue et littérature';
    }
    if (subject.includes('mathématiques') || subject.includes('physique') || subject.includes('chimie') || subject.includes('science') || subject.includes('technologie')) {
      return 'Sciences';
    }
    if (subject.includes('histoire') || subject.includes('géographie') || subject.includes('sociale') || subject.includes('philosophie')) {
      return 'Sciences sociales';
    }
    if (subject.includes('dessin') || subject.includes('couture') || subject.includes('plastique') || subject.includes('poésie') || subject.includes('chant') || subject.includes('conte')) {
      return 'Arts';
    }
    if (subject.includes('physique') && subject.includes('sportive') || subject.includes('eps')) {
      return 'Sport';
    }
    if (subject.includes('entrepreneuriat')) {
      return 'Entrepreneuriat';
    }
  }
  
  return 'Autres'; // Par défaut
}

/**
 * Calculer la moyenne selon le type d'évaluation et le niveau
 * @param {Array} notes - Liste des notes
 * @param {string} typeEvaluation - Type d'évaluation (EM1, EM2, EC, IE1, IE2, DS1, DS2)
 * @param {string} niveau - Niveau d'éducation
 * @param {Array} coefficients - Coefficients des matières (pour 2nd cycle uniquement)
 * @returns {number|null} - Moyenne calculée
 */
function calculerMoyenneSelonNiveau(notes, typeEvaluation, niveau, coefficients = []) {
  if (!notes || notes.length === 0) {
    return null;
  }

  switch (niveau) {
    case 'MATERNELLE':
      // Pas de calcul numérique pour la maternelle
      return null;
      
    case 'PRIMAIRE':
      return calculerMoyenneEvaluationPrimaire(notes);
      
    case 'SECONDAIRE_1ER_CYCLE':
      return calculerMoyenneEvaluationPrimaire(notes); // Même calcul que le primaire
      
    case 'SECONDAIRE_2ND_CYCLE':
      if (coefficients.length === notes.length) {
        // Calcul avec coefficients
        const notesValides = notes
          .map((note, index) => ({ note, coeff: coefficients[index] }))
          .filter(d => d.note !== null && d.note !== undefined && !isNaN(d.note) && 
                       d.coeff !== null && d.coeff !== undefined && !isNaN(d.coeff));
        
        if (notesValides.length === 0) {
          return null;
        }
        
        const sommePonderee = notesValides.reduce((sum, d) => sum + (d.note * d.coeff), 0);
        const sommeCoefficients = notesValides.reduce((sum, d) => sum + d.coeff, 0);
        
        return Math.round((sommePonderee / sommeCoefficients) * 100) / 100;
      } else {
        // Calcul simple si pas de coefficients
        return calculerMoyenneEvaluationPrimaire(notes);
      }
      
    default:
      return calculerMoyenneEvaluationPrimaire(notes);
  }
}

/**
 * Obtenir les types d'évaluation selon le niveau
 * @param {string} niveau - Niveau d'éducation
 * @returns {Array} - Liste des types d'évaluation
 */
function obtenirTypesEvaluation(niveau) {
  switch (niveau) {
    case 'MATERNELLE':
      return ['OBSERVATION_CONTINUE', 'BILAN_TRIMESTRE', 'BILAN_ANNUEL'];
      
    case 'PRIMAIRE':
      return ['EM1', 'EM2', 'EC'];
      
    case 'SECONDAIRE_1ER_CYCLE':
    case 'SECONDAIRE_2ND_CYCLE':
      return ['IE1', 'IE2', 'DS1', 'DS2'];
      
    default:
      return ['EM1', 'EM2', 'EC'];
  }
}

/**
 * Vérifier si un coefficient est requis pour le niveau
 * @param {string} niveau - Niveau d'éducation
 * @returns {boolean} - True si coefficient requis
 */
function coefficientRequis(niveau) {
  return niveau === 'SECONDAIRE_2ND_CYCLE';
}

module.exports = {
  calculerMoyenneEvaluationPrimaire,
  calculerMoyenneTrimestriellePrimaire,
  calculerMoyenneAnnuellePrimaire,
  calculerMoyenneMatiere1erCycle,
  calculerMoyenneTrimestre1erCycle,
  calculerMoyenneMatiere2ndCycle,
  calculerMoyenneTrimestre2ndCycle,
  calculerMoyenneAnnuelleSecondaire,
  attribuerMentionEtEmoji,
  evaluerCompetenceMaternelle,
  validerNote,
  validerCodeMaternelle,
  determinerNiveauEducation,
  determinerGroupeMatiere,
  calculerMoyenneSelonNiveau,
  obtenirTypesEvaluation,
  coefficientRequis
};