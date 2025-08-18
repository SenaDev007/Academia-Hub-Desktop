import React, { useState } from 'react';
import { apiService } from '../services/api';
import { formatRang } from '../utils/formatters';
import { NotificationPanel } from './NotificationPanel';
import { GraduationCap, Download, Printer as Print, Eye, Users, Award, Calendar, CheckCircle, RefreshCw, FileText, Send } from 'lucide-react';

export function BulletinsNotes() {
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedTrimester, setSelectedTrimester] = useState('T1');
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [selectedPeriodType, setSelectedPeriodType] = useState('trimestre');
  const [selectedEvaluation, setSelectedEvaluation] = useState('EM1');
  const [selectedScope, setSelectedScope] = useState('eleve');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('primaire');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<any>(null);

  const classes = ['CM2-A', 'CM2-B', '6ème A', '6ème B', '3ème C', 'Terminale C'];
  
  // Fonction pour obtenir les élèves selon la classe sélectionnée
  const getStudentsByClass = (className) => {
    const allStudents = {
      'CM2-A': [
    { 
      id: '1', 
      nom: 'ADJOVI', 
      prenom: 'Marie', 
      numeroEducmaster: 'EDU2024001',
      sexe: 'F',
      parent: {
        nom: 'ADJOVI Paul',
        email: 'paul.adjovi@email.com',
        telephone: '+229 97 12 34 56',
        whatsapp: '+229 97 12 34 56'
      }
    },
    { 
      id: '2', 
      nom: 'BASSENE', 
      prenom: 'Jean', 
      numeroEducmaster: 'EDU2024002',
      sexe: 'M',
      parent: {
        nom: 'BASSENE Marie',
        email: 'marie.bassene@email.com',
        telephone: '+229 96 87 65 43',
        whatsapp: '+229 96 87 65 43'
      }
    },
    { 
      id: '3', 
      nom: 'HOUEDE', 
      prenom: 'Sophie', 
      numeroEducmaster: 'EDU2024003',
      sexe: 'F',
      parent: {
        nom: 'HOUEDE Jean',
        email: 'jean.houede@email.com',
        telephone: '+229 95 11 22 33',
        whatsapp: '+229 95 11 22 33'
      }
    }
      ],
      'CM2-B': [
        { 
          id: '4', 
          nom: 'SANTOS', 
          prenom: 'Lisa', 
          numeroEducmaster: 'EDU2024004',
          sexe: 'F',
          parent: {
            nom: 'SANTOS Paul',
            email: 'paul.santos@email.com',
            telephone: '+229 94 55 66 77',
            whatsapp: '+229 94 55 66 77'
          }
        }
      ],
      '6ème A': [
        { 
          id: '5', 
          nom: 'KONE',
          prenom: 'Abdoul',
          numeroEducmaster: 'EDU2024005',
          sexe: 'M',
          parent: {
            nom: 'KONE Fatou',
            email: 'fatou.kone@email.com',
            telephone: '+229 93 44 55 66',
            whatsapp: '+229 93 44 55 66'
          }
        }
      ]
    };
    return allStudents[className] || allStudents['CM2-A'];
  };

  const students = getStudentsByClass(selectedClass);

  // Données du bulletin simulé
  const bulletinData = {
    etablissement: 'École Primaire Publique Saint-Jean',
    anneeScolaire: '2023-2024',
    eleve: {
      nom: 'ADJOVI',
      prenom: 'Marie',
      numeroEducmaster: 'EDU2024001',
      sexe: 'F',
      dateNaissance: '2012-03-15',
      lieuNaissance: 'Cotonou',
      classe: 'CM2-A',
      effectif: 25,
      rang: 2
    },
    trimestre: '1er Trimestre',
    // Données pour maternelle
    domainesMaternelle: [
      {
        domaine: 'Domaine 1 - Développement du bien-être (santé et environnement)',
        activites: [
          { nom: 'Éducation pour la santé', evaluation: 'TS', observations: 'Très bonne hygiène personnelle' },
          { nom: 'Éducation à des réflexions de santé', evaluation: 'S', observations: 'Comprend les règles de base' }
        ]
      },
      {
        domaine: 'Domaine 2 - Développement du bien-être physique et du développement moteur (Expression corporelle)',
        activites: [
          { nom: 'Éducation du mouvement', evaluation: 'TS', observations: 'Excellente motricité globale' },
          { nom: 'Gestuelle', evaluation: 'TS', observations: 'Coordination parfaite' },
          { nom: 'Rythmique', evaluation: 'S', observations: 'Suit bien les rythmes simples' }
        ]
      },
      {
        domaine: 'Domaine 3 - Développement de la réflexion des aptitudes cognitives et intellectuelles (Santé des Pré-apprentissages)',
        activites: [
          { nom: 'Observation', evaluation: 'TS', observations: 'Très attentive aux détails' },
          { nom: 'Éducation sensorielle', evaluation: 'TS', observations: 'Excellente discrimination sensorielle' },
          { nom: 'Pré-lecture', evaluation: 'S', observations: 'Reconnaît quelques lettres' },
          { nom: 'Pré-écriture', evaluation: 'S', observations: 'Bonne tenue du crayon' },
          { nom: 'Pré-mathématique', evaluation: 'TS', observations: 'Compte jusqu\'à 10 facilement' }
        ]
      },
      {
        domaine: 'Domaine 4 - Développement des sentiments et des émotions (Santé émotionnelle)',
        activites: [
          { nom: 'Expression plastique', evaluation: 'TS', observations: 'Très créative dans ses dessins' },
          { nom: 'Expression émotionnelle', evaluation: 'S', observations: 'Exprime bien ses sentiments' }
        ]
      },
      {
        domaine: 'Domaine 5 - Développement des relations et de l\'interaction sociale et socio-affective',
        activites: [
          { nom: 'Langage', evaluation: 'TS', observations: 'S\'exprime clairement' },
          { nom: 'Conte', evaluation: 'S', observations: 'Écoute attentivement les histoires' },
          { nom: 'Comptine', evaluation: 'TS', observations: 'Mémorise facilement' },
          { nom: 'Poésie', evaluation: 'S', observations: 'Récite avec expression' },
          { nom: 'Chant', evaluation: 'TS', observations: 'Très bonne voix et rythme' }
        ]
      }
    ],
    // Données pour primaire - Évaluation par compétences
    competencesPrimaire: [
      {
        domaine: 'Français',
        competences: [
          { nom: 'Communication orale', note: 15.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Expression écrite', note: 14.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'S' },
          { nom: 'Lecture', note: 16.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Dictée', note: 13.5, maitrise: 'Non', seuil: 'Oui', appreciation: 'S' }
        ]
      },
      {
        domaine: 'Mathématiques',
        competences: [
          { nom: 'Calcul et opérations', note: 16.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Géométrie et mesures', note: 15.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Résolution de problèmes', note: 14.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'S' }
        ]
      },
      {
        domaine: 'EST (Éveil Scientifique et Technologique)',
        competences: [
          { nom: 'Observation et expérimentation', note: 15.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Sciences de la vie et de la terre', note: 14.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'S' }
        ]
      },
      {
        domaine: 'ES (Éveil Social)',
        competences: [
          { nom: 'Histoire et géographie', note: 13.5, maitrise: 'Non', seuil: 'Oui', appreciation: 'S' },
          { nom: 'Éducation civique et morale', note: 16.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' }
        ]
      },
      {
        domaine: 'EA (Éducation Artistique)',
        competences: [
          { nom: 'Dessin/Coloriage', note: 15.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Poésie/Chant/Conte', note: 14.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'S' }
        ]
      },
      {
        domaine: 'Langue nationale 1/Anglais',
        competences: [
          { nom: 'Expression orale', note: 12.0, maitrise: 'Non', seuil: 'Oui', appreciation: 'PS' },
          { nom: 'Compréhension', note: 13.0, maitrise: 'Non', seuil: 'Oui', appreciation: 'S' }
        ]
      },
      {
        domaine: 'EPS (Éducation Physique et Sportive)',
        competences: [
          { nom: 'Activités physiques', note: 17.0, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' },
          { nom: 'Jeux collectifs', note: 16.5, maitrise: 'Oui', seuil: 'Oui', appreciation: 'TS' }
        ]
      }
    ],
    // Données pour autres niveaux (secondaire)
    notes: selectedLevel === 'primaire' ? [] : [
      {
        matiere: 'Mathématiques',
        EM1: 15.5,
        EM2: 16.0,
        EC: 14.5,
        moyenne: 15.33,
        appreciation: 'Très Bien',
        observations: 'Excellent niveau en calcul et géométrie'
      },
      {
        matiere: 'Français',
        EM1: 13.0,
        EM2: 14.5,
        EC: 15.0,
        moyenne: 14.17,
        appreciation: 'Bien',
        observations: 'Progrès en expression écrite'
      },
      {
        matiere: 'Sciences et Technologie',
        EM1: 16.5,
        EM2: 15.0,
        EC: 17.0,
        moyenne: 16.17,
        appreciation: 'Très Bien',
        observations: 'Très bon esprit scientifique'
      },
      {
        matiere: 'Histoire-Géographie',
        EM1: 12.0,
        EM2: 13.5,
        EC: 14.0,
        moyenne: 13.17,
        appreciation: 'Assez Bien',
        observations: 'Peut mieux faire en géographie'
      },
      {
        matiere: 'Éducation Civique et Morale',
        EM1: 16.0,
        EM2: 15.5,
        EC: 16.5,
        moyenne: 16.00,
        appreciation: 'Très Bien',
        observations: 'Excellent comportement citoyen'
      },
      {
        matiere: 'Anglais',
        EM1: 14.0,
        EM2: 15.5,
        EC: 13.0,
        moyenne: 14.17,
        appreciation: 'Bien',
        observations: 'Bonne compréhension orale'
      },
      {
        matiere: 'Éducation Physique et Sportive',
        EM1: 17.0,
        EM2: 16.5,
        EC: 18.0,
        moyenne: 17.17,
        appreciation: 'Excellent',
        observations: 'Très sportive, esprit d\'équipe'
      },
      {
        matiere: 'Arts Plastiques',
        EM1: 15.0,
        EM2: 16.0,
        EC: 15.5,
        moyenne: 15.50,
        appreciation: 'Très Bien',
        observations: 'Créative et appliquée'
      }
    ],
    moyenneGenerale: 15.21,
    appreciation: 'Très Bien 😊',
    // Statistiques primaire
    statistiquesPrimaire: {
      moyenneObtenue: 15.21,
      plusForteMoyenne: 18.75,
      plusFaibleMoyenne: 8.45,
      seuilReussite: 10.0,
      nombreMatieres: 7,
      competencesAtteintes: 18,
      competencesMaximales: 22,
      seuilGlobalAtteint: true
    },
    assiduité: {
      joursClasse: 60,
      joursPresence: 58,
      absences: 2,
      retards: 1
    },
    observations: 'Élève sérieuse et travailleuse. Continue sur cette excellente voie.',
    recommandations: 'Persévère pour atteindre l\'excellence. Peut viser les félicitations au prochain trimestre.',
    visa: {
      professeur: 'Mme TOSSA Marie',
      directeur: 'M. AKPOVI Jean',
      date: '2024-01-20'
    }
  };

  const getAppreciationSymbol = (appreciation: string) => {
    switch (appreciation) {
      case 'TS': return { emoji: '😊', color: 'text-green-600', bg: 'bg-green-50' };
      case 'S': return { emoji: '😐', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'PS': return { emoji: '😟', color: 'text-red-600', bg: 'bg-red-50' };
      default: return { emoji: '⚪', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const handleSendNotifications = () => {
    setShowNotificationModal(true);
  };

  const handleConfirmSendNotifications = async () => {
    setIsSendingNotifications(true);
    // Simulation d'envoi des notifications
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSendingNotifications(false);
    setShowNotificationModal(false);
    alert('Notifications envoyées avec succès à tous les parents !');
  };
  const getAppreciationColor = (moyenne: number) => {
    if (moyenne >= 18) return 'text-green-700 bg-green-50';
    if (moyenne >= 16) return 'text-green-600 bg-green-50';
    if (moyenne >= 14) return 'text-blue-600 bg-blue-50';
    if (moyenne >= 12) return 'text-yellow-600 bg-yellow-50';
    if (moyenne >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getEvaluationIcon = (evaluation: string) => {
    if (evaluation === 'TS') return '😊';
    if (evaluation === 'S') return '😐';
    return '😟';
  };

  const getAppreciationEmoji = (moyenne: number) => {
    if (moyenne >= 18) return '🌟';
    if (moyenne >= 16) return '😊';
    if (moyenne >= 14) return '👍';
    if (moyenne >= 12) return '😐';
    if (moyenne >= 10) return '⚠️';
    if (moyenne >= 8) return '❌';
    return '🚫';
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    // Simulation de génération PDF
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulation de téléchargement
    const pdfContent = `BULLETIN DE NOTES - ${bulletinData.trimestre}

ÉLÈVE: ${bulletinData.eleve.nom} ${bulletinData.eleve.prenom} (${bulletinData.eleve.sexe})
CLASSE: ${bulletinData.eleve.classe}
N° EDUCMASTER: ${bulletinData.eleve.numeroEducmaster}

NOTES PAR MATIÈRE:
${bulletinData.notes.map(note => 
  `${note.matiere}: ${note.moyenne.toFixed(2)}/20 - ${note.appreciation}`
).join('\n')}

MOYENNE GÉNÉRALE: ${bulletinData.moyenneGenerale.toFixed(2)}/20
RANG: ${formatRang(bulletinData.eleve.rang, bulletinData.eleve.sexe)}/${bulletinData.eleve.effectif}

OBSERVATIONS: ${bulletinData.observations}
RECOMMANDATIONS: ${bulletinData.recommandations}`;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bulletin_${bulletinData.eleve.nom}_${bulletinData.trimestre}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    
    try {
      const response = await apiService.genererBulletins({
        classe_id: 1, // À adapter selon la classe sélectionnée
        trimestre_id: 1, // À adapter selon le trimestre sélectionné
        type_bulletin: selectedPeriodType === 'evaluation' ? 'Evaluation' : 
                      selectedPeriodType === 'trimestre' ? 'Trimestre' : 'Annuel'
      });
      
      alert(`${response.nb_bulletins} bulletins générés avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la génération des bulletins:', error);
      alert('Erreur lors de la génération des bulletins');
    }
    
    setIsGenerating(false);
  };

  const handleDownloadZip = () => {
    alert('Téléchargement du fichier ZIP contenant tous les bulletins...');
  };

  const handleViewTableau = () => {
    // Redirection vers les tableaux d'honneur
    alert('Redirection vers les tableaux d\'honneur...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-7 w-7 mr-3 text-blue-600" />
            Génération des Bulletins de Notes
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={handlePreview}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </button>
            <button 
              onClick={handleSendNotifications}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Notifier Parents
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Génération...' : 'Télécharger PDF'}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Print className="h-4 w-4 mr-2" />
              Imprimer
            </button>
            <button 
              onClick={() => setShowNotifications(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </button>
          </div>
        </div>

        {/* Modal de notification aux parents */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications aux Parents d'Élèves
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Envoi des bulletins par email et notifications SMS/WhatsApp
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Liste des parents */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Contacts Parents ({students.length})</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {students.map(student => (
                        <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.nom} {student.prenom}
                              </p>
                              <p className="text-sm text-gray-600">
                                Parent: {student.parent.nom}
                              </p>
                              <p className="text-xs text-gray-500">
                                📧 {student.parent.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                📱 {student.parent.whatsapp}
                              </p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aperçu du message */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Aperçu du Message SMS/WhatsApp</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm">
                        <p className="font-semibold text-green-800 mb-2">📚 Academia Hub - Bulletin T1</p>
                        <p className="text-green-700">
                          Cher(e) Parent, voici les résultats de Marie ADJOVI:
                        </p>
                        <p className="text-green-700 mt-1">
                          • Moyenne: 15.21/20 (Très Bien 😊)
                        </p>
                        <p className="text-green-700">
                          • Rang: 2ème/25
                        </p>
                        <p className="text-green-700">
                          • Observation: Élève sérieuse et travailleuse
                        </p>
                        <p className="text-green-700 mt-2">
                          Bulletin complet envoyé par email. 📧
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Options d'envoi</h5>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-blue-800">Email avec bulletin PDF</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-blue-800">SMS de notification</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-blue-800">Message WhatsApp</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmSendNotifications}
                  disabled={isSendingNotifications}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSendingNotifications ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                      Envoi en cours...
                    </>
                  ) : (
                    `Envoyer à ${students.length} parents`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de Période</label>
            <select
              value={selectedPeriodType}
              onChange={(e) => setSelectedPeriodType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="evaluation">Évaluation</option>
              <option value="trimestre">Trimestre</option>
              <option value="annuel">Annuel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedPeriodType === 'evaluation' ? 'Évaluation' : 'Trimestre'}
            </label>
            {selectedPeriodType === 'evaluation' ? (
              <select
                value={selectedEvaluation}
                onChange={(e) => setSelectedEvaluation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EM1">EM1</option>
                <option value="EM2">EM2</option>
                <option value="EC">EC</option>
              </select>
            ) : (
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="T1">1er Trimestre</option>
              <option value="T2">2ème Trimestre</option>
              <option value="T3">3ème Trimestre</option>
            </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portée</label>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="eleve">Par Élève</option>
              <option value="classe">Par Classe</option>
              <option value="toutes">Toutes les Classes</option>
            </select>
          </div>

          {selectedScope === 'eleve' && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Élève</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.nom} {student.prenom}
                </option>
              ))}
            </select>
            </div>
          )}

          <div className="flex items-end">
            <button 
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Génération...' : `Générer ${
                selectedScope === 'eleve' ? '1 Bulletin' :
                selectedScope === 'classe' ? 'Classe' :
                'Toutes Classes'
              }`}
            </button>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">25</p>
              <p className="text-sm text-gray-600">Bulletins à générer</p>
            </div>
          </div>
          <button 
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Génération en cours...' : 'Générer Tous'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Bulletins générés</p>
            </div>
          </div>
          <button 
            onClick={handleDownloadZip}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Télécharger ZIP
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-600">Élèves d'honneur</p>
            </div>
          </div>
          <button 
            onClick={handleViewTableau}
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voir Tableau
          </button>
        </div>
      </div>

      {/* Aperçu du bulletin */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* En-tête du bulletin */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">RÉPUBLIQUE DU BÉNIN</h2>
            <p className="text-blue-200 mb-4">Ministère de l'Enseignement Primaire et Secondaire</p>
            <h3 className="text-xl font-semibold">{bulletinData.etablissement}</h3>
            <p className="text-blue-200">Année Scolaire {bulletinData.anneeScolaire}</p>
          </div>
        </div>

        {/* Titre du bulletin */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-center text-gray-900">
            {selectedLevel === 'maternelle' ? 
              `BULLETIN D'ÉVALUATION - ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}` :
             selectedLevel === 'primaire' ?
              `ÉVALUATION CERTIFICATIVE N° ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}` :
              `BULLETIN DE NOTES - ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}`
            }
          </h3>
          {selectedLevel === 'primaire' && (
            <p className="text-center text-gray-600 mt-2">
              Mois de ........................... Étape: .......
            </p>
          )}
        </div>

        <div className="p-6">
          {/* Informations élève */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Informations Élève</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nom et Prénoms:</span> {bulletinData.eleve.nom} {bulletinData.eleve.prenom}</p>
                <p><span className="font-medium">N° Educmaster:</span> {bulletinData.eleve.numeroEducmaster}</p>
                <p><span className="font-medium">Date de naissance:</span> {new Date(bulletinData.eleve.dateNaissance).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Lieu de naissance:</span> {bulletinData.eleve.lieuNaissance}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">Classe et Résultats</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Classe:</span> {bulletinData.eleve.classe}</p>
                <p><span className="font-medium">Effectif:</span> {bulletinData.eleve.effectif} élèves</p>
                <p><span className="font-medium">Rang:</span> {formatRang(bulletinData.eleve.rang, bulletinData.eleve.sexe)}</p>
                {selectedLevel === 'primaire' && <p><span className="font-medium">Moyenne obtenue:</span> 
                  <span className={`ml-2 px-2 py-1 rounded font-bold ${getAppreciationColor(bulletinData.moyenneGenerale)}`}>
                    {bulletinData.moyenneGenerale.toFixed(2)}/20
                  </span>
                </p>}
                {selectedLevel !== 'maternelle' && selectedLevel !== 'primaire' && <p><span className="font-medium">Moyenne générale:</span> 
                  <span className={`ml-2 px-2 py-1 rounded font-bold ${getAppreciationColor(bulletinData.moyenneGenerale)}`}>
                    {bulletinData.moyenneGenerale.toFixed(2)}/20
                  </span>
                </p>}
              </div>
            </div>
          </div>

          {/* Tableau des compétences - Primaire */}
          {selectedLevel === 'primaire' && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                I- CONNAISSANCE ET HABILETÉS
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-gray-400">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-400 px-3 py-2 text-left text-sm font-bold text-gray-900">
                        Champs de formation
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center text-sm font-bold text-gray-900">
                        Note<br/>min.
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center text-sm font-bold text-gray-900">
                        Maîtrise<br/>minimale<br/>CM/18
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center text-sm font-bold text-gray-900">
                        Total<br/>sur<br/>20
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center text-sm font-bold text-gray-900">
                        Seuil de<br/>réussite
                      </th>
                      <th className="border border-gray-400 px-2 py-2 text-center text-sm font-bold text-gray-900">
                        Appréciation
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-3 py-1 text-center text-xs text-gray-700" colSpan="2"></th>
                      <th className="border border-gray-400 px-2 py-1 text-center text-xs text-gray-700">
                        Oui | Non
                      </th>
                      <th className="border border-gray-400 px-2 py-1 text-center text-xs text-gray-700">
                        CP/02
                      </th>
                      <th className="border border-gray-400 px-2 py-1 text-center text-xs text-gray-700">
                        Oui | Non
                      </th>
                      <th className="border border-gray-400 px-2 py-1 text-center text-xs text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletinData.competencesPrimaire.map((domaine, index) => (
                      <React.Fragment key={index}>
                        {/* En-tête du domaine */}
                        <tr className="bg-blue-50">
                          <td className="border border-gray-400 px-3 py-2 font-bold text-gray-900" colSpan="6">
                            {domaine.domaine}
                          </td>
                        </tr>
                        {/* Compétences du domaine */}
                        {domaine.competences.map((competence, compIndex) => (
                          <tr key={compIndex} className={compIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-400 px-4 py-2 text-sm text-gray-900">
                              • {competence.nom}
                            </td>
                            <td className="border border-gray-400 px-2 py-2 text-center text-sm text-gray-700">
                              {competence.note.toFixed(1)}
                            </td>
                            <td className="border border-gray-400 px-2 py-2 text-center">
                              <div className="flex justify-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  competence.maitrise === 'Oui' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {competence.maitrise}
                                </span>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-2 py-2 text-center text-sm font-semibold text-gray-900">
                              {competence.note.toFixed(1)}/20
                            </td>
                            <td className="border border-gray-400 px-2 py-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                competence.seuil === 'Oui' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {competence.seuil}
                              </span>
                            </td>
                            <td className="border border-gray-400 px-2 py-2 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                                  getAppreciationSymbol(competence.appreciation).bg
                                } ${getAppreciationSymbol(competence.appreciation).color}`}>
                                  {getAppreciationSymbol(competence.appreciation).emoji}
                                </span>
                                <span className="text-xs font-medium">{competence.appreciation}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                    {/* Total général */}
                    <tr className="bg-blue-100 font-bold">
                      <td className="border border-gray-400 px-3 py-3 text-gray-900">
                        TOTAL GÉNÉRAL
                      </td>
                      <td className="border border-gray-400 px-2 py-3 text-center text-gray-900">
                        -
                      </td>
                      <td className="border border-gray-400 px-2 py-3 text-center text-gray-900">
                        -
                      </td>
                      <td className="border border-gray-400 px-2 py-3 text-center text-lg font-bold text-blue-700">
                        {bulletinData.statistiquesPrimaire.moyenneObtenue.toFixed(2)}/20
                      </td>
                      <td className="border border-gray-400 px-2 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-sm font-bold ${
                          bulletinData.statistiquesPrimaire.seuilGlobalAtteint ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bulletinData.statistiquesPrimaire.seuilGlobalAtteint ? 'OUI' : 'NON'}
                        </span>
                      </td>
                      <td className="border border-gray-400 px-2 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-2xl">
                            {bulletinData.statistiquesPrimaire.moyenneObtenue >= 16 ? '😊' :
                             bulletinData.statistiquesPrimaire.moyenneObtenue >= 12 ? '😐' : '😟'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statistiques détaillées */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-3">Statistiques de Performance</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Moyenne obtenue par l'élève:</span> 
                      <span className="ml-2 font-bold text-blue-700">{bulletinData.statistiquesPrimaire.moyenneObtenue.toFixed(2)}/20</span>
                    </p>
                    <p><span className="font-medium">Plus forte moyenne de la classe:</span> 
                      <span className="ml-2 font-bold text-green-700">{bulletinData.statistiquesPrimaire.plusForteMoyenne.toFixed(2)}/20</span>
                    </p>
                    <p><span className="font-medium">Plus faible moyenne de la classe:</span> 
                      <span className="ml-2 font-bold text-red-700">{bulletinData.statistiquesPrimaire.plusFaibleMoyenne.toFixed(2)}/20</span>
                    </p>
                    <p><span className="font-medium">Seuil de réussite globale fixé à:</span> 
                      <span className="ml-2 font-bold text-gray-700">{bulletinData.statistiquesPrimaire.seuilReussite.toFixed(1)}/20</span>
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-3">Bilan des Compétences</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nombre de matières évaluées:</span> 
                      <span className="ml-2 font-bold text-green-700">{bulletinData.statistiquesPrimaire.nombreMatieres}</span>
                    </p>
                    <p><span className="font-medium">Compétences maximales + minimales atteinte:</span> 
                      <span className="ml-2 font-bold text-green-700">
                        {bulletinData.statistiquesPrimaire.competencesAtteintes}/{bulletinData.statistiquesPrimaire.competencesMaximales}
                      </span>
                    </p>
                    <p><span className="font-medium">Seuil de réussite globale atteint:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                        bulletinData.statistiquesPrimaire.seuilGlobalAtteint ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bulletinData.statistiquesPrimaire.seuilGlobalAtteint ? 'OUI ✓' : 'NON ✗'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Symboles d'appréciation par matière */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-900 mb-3">SYMBOLE MÉRITE PAR L'ÉLÈVE</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bulletinData.competencesPrimaire.map((domaine, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm font-medium text-gray-900">{domaine.domaine.split(' ')[0]}</span>
                      <div className="flex space-x-1">
                        {['TS', 'S', 'PS'].map(symbol => {
                          const isActive = domaine.competences.some(c => c.appreciation === symbol);
                          const symbolData = getAppreciationSymbol(symbol);
                          return (
                            <span key={symbol} className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 ${
                              isActive ? `${symbolData.bg} ${symbolData.color} border-current` : 'bg-gray-100 text-gray-400 border-gray-300'
                            }`}>
                              {symbolData.emoji}
                            </span>
                          );
                        })}
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded border-2 border-gray-300 bg-white text-xs">
                          ⚪
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Attitudes */}
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-3">II- ATTITUDES</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-purple-800">Assiduité:</span>
                    <span className="ml-2 text-gray-700">Très régulière, présence constante aux cours</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Discipline:</span>
                    <span className="ml-2 text-gray-700">Comportement exemplaire, respecte les règles</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Défauts majeurs identifiés chez l'élève:</span>
                    <span className="ml-2 text-gray-700">Aucun défaut majeur observé</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Qualités remarquables:</span>
                    <span className="ml-2 text-gray-700">Élève studieuse, participative et solidaire avec ses camarades</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tableau des évaluations - Maternelle */}
          {selectedLevel === 'maternelle' && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Évaluation par Domaines d'Apprentissage
              </h4>
              <div className="space-y-6">
                {bulletinData.domainesMaternelle.map((domaine, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-3 border-b border-gray-300">
                      <h5 className="font-semibold text-blue-900 text-sm">{domaine.domaine}</h5>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">
                              Activités
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900">
                              Résultats
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">
                              Observations
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {domaine.activites.map((activite, actIndex) => (
                            <tr key={actIndex} className={actIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                • {activite.nom}
                              </td>
                              <td className="border border-gray-300 px-3 py-3 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                    activite.evaluation === 'TS' ? 'bg-green-100 text-green-800' :
                                    activite.evaluation === 'S' ? 'bg-blue-100 text-blue-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {activite.evaluation}
                                  </span>
                                  <span className="text-lg">{getEvaluationIcon(activite.evaluation)}</span>
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                                {activite.observations}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Légende pour la maternelle */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-900 mb-3">Légende d'Évaluation</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold text-xs">TS</span>
                    <span className="text-green-800">😊 Très Satisfaisant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">S</span>
                    <span className="text-blue-800">😐 Satisfaisant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-bold text-xs">PS</span>
                    <span className="text-orange-800">😟 Peu Satisfaisant</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-yellow-800">
                  <strong>NB:</strong> L'évaluation est faite sur la base de l'observation permanente de l'enfant. 
                  Ce dernier est évalué par rapport à lui-même, pas par rapport à ses camarades de classe.
                </div>
              </div>
            </div>
          )}

          {/* Tableau des notes - Autres niveaux */}
          {selectedLevel !== 'maternelle' && selectedLevel !== 'primaire' && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-600" />
              Détail des Notes par Matière
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Matières
                    </th>
                    <th className="border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-900">
                      EM1
                    </th>
                    <th className="border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-900">
                      EM2
                    </th>
                    <th className="border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-900">
                      EC
                    </th>
                    <th className="border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-900">
                      Moyenne
                    </th>
                    <th className="border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-900">
                      Appréciation
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Observations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bulletinData.notes.map((note, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
                        {note.matiere}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm text-gray-700">
                        {note.EM1.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm text-gray-700">
                        {note.EM2.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm text-gray-700">
                        {note.EC.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${getAppreciationColor(note.moyenne)}`}>
                          {note.moyenne.toFixed(2)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center text-sm">
                        <span className="flex items-center justify-center space-x-1">
                          <span>{getAppreciationEmoji(note.moyenne)}</span>
                          <span>{note.appreciation}</span>
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        {note.observations}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50">
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-900">
                      MOYENNE GÉNÉRALE:
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center">
                      <span className={`px-3 py-2 rounded-lg text-lg font-bold ${getAppreciationColor(bulletinData.moyenneGenerale)}`}>
                        {bulletinData.moyenneGenerale.toFixed(2)}/20
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-center">
                      <span className="flex items-center justify-center space-x-2 text-lg">
                        <span>{getAppreciationEmoji(bulletinData.moyenneGenerale)}</span>
                        <span className="font-semibold">{bulletinData.appreciation}</span>
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
                      Rang: {formatRang(bulletinData.eleve.rang, bulletinData.eleve.sexe)}/{bulletinData.eleve.effectif}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          )}

          {/* Assiduité et observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Assiduité
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Jours de classe:</span> {bulletinData.assiduité.joursClasse}</p>
                <p><span className="font-medium">Jours de présence:</span> {bulletinData.assiduité.joursPresence}</p>
                <p><span className="font-medium">Absences:</span> {bulletinData.assiduité.absences}</p>
                <p><span className="font-medium">Retards:</span> {bulletinData.assiduité.retards}</p>
                <p><span className="font-medium">Taux de présence:</span> 
                  <span className="ml-2 font-bold text-yellow-700">
                    {((bulletinData.assiduité.joursPresence / bulletinData.assiduité.joursClasse) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">Observations et Recommandations</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-purple-800">Observations:</span>
                  <p className="mt-1 text-gray-700">{bulletinData.observations}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Recommandations:</span>
                  <p className="mt-1 text-gray-700">{bulletinData.recommandations}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="bg-white border-2 border-gray-400 p-4 rounded">
                <h6 className="text-sm font-bold text-gray-900 mb-2">ANALYSE DES RÉSULTATS ET RECOMMANDATIONS</h6>
                <div className="text-left space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-800">Enseignant(e)</p>
                    <div className="border-b border-gray-300 h-8 flex items-end">
                      <p className="text-xs text-gray-600">Signature du titulaire de la classe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white border-2 border-gray-400 p-4 rounded">
                <div className="text-left space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-800">Parent</p>
                    <div className="border-b border-gray-300 h-8 flex items-end">
                      <p className="text-xs text-gray-600">Signature et nom du parent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-2">VISA du/de la Directeur/trice</p>
                <div className="border-b border-gray-300 pb-2 mb-2 h-12"></div>
                <p className="text-xs text-gray-500">Signature et cachet</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            Bulletin généré le {new Date().toLocaleDateString('fr-FR')} - Academia Hub Module Examens
          </div>
        </div>
      </div>

      {/* Modal d'aperçu */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Aperçu du Bulletin - {bulletinData.eleve.nom} {bulletinData.eleve.prenom} 
                  {selectedLevel === 'maternelle' && (
                    <span className="text-sm text-gray-600 block mt-1">
                      Évaluation par observation - Système Maternelle
                    </span>
                  )}
                  {selectedLevel === 'primaire' && (
                    <span className="text-sm text-gray-600 block mt-1">
                      Évaluation par compétences - Système Primaire
                    </span>
                  )}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <Print className="h-4 w-4 mr-1" />
                    Imprimer
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Contenu du bulletin en aperçu */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">RÉPUBLIQUE DU BÉNIN</h2>
                <p className="text-gray-600">Ministère de l'Enseignement Primaire et Secondaire</p>
                <h3 className="text-lg font-semibold mt-4">{bulletinData.etablissement}</h3>
                <p className="text-gray-600">Année Scolaire {bulletinData.anneeScolaire}</p>
                <h4 className="text-lg font-bold mt-4">
                  {selectedLevel === 'maternelle' ? 
                    `BULLETIN D'ÉVALUATION - ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}` :
                   selectedLevel === 'primaire' ?
                    `ÉVALUATION CERTIFICATIVE N° ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}` :
                    `BULLETIN DE NOTES - ${selectedPeriodType === 'evaluation' ? selectedEvaluation : bulletinData.trimestre}`
                  }
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p><strong>Nom et Prénoms:</strong> {bulletinData.eleve.nom} {bulletinData.eleve.prenom}</p>
                  <p><strong>N° Educmaster:</strong> {bulletinData.eleve.numeroEducmaster}</p>
                  <p><strong>Classe:</strong> {bulletinData.eleve.classe}</p>
                </div>
                <div>
                  <p><strong>Effectif:</strong> {bulletinData.eleve.effectif} élèves</p>
                  <p><strong>Rang:</strong> {formatRang(bulletinData.eleve.rang, bulletinData.eleve.sexe)}</p>
                  {selectedLevel === 'primaire' && (
                    <p><strong>Moyenne obtenue:</strong> {bulletinData.moyenneGenerale.toFixed(2)}/20</p>
                  )}
                  {selectedLevel !== 'maternelle' && selectedLevel !== 'primaire' && (
                    <p><strong>Moyenne générale:</strong> {bulletinData.moyenneGenerale.toFixed(2)}/20</p>
                  )}
                </div>
              </div>

              {/* Tableau pour maternelle */}
              {selectedLevel === 'maternelle' ? (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">Évaluation par Domaines</h5>
                  {bulletinData.domainesMaternelle.slice(0, 2).map((domaine, index) => (
                    <div key={index} className="mb-4">
                      <h6 className="text-sm font-medium text-gray-800 mb-2">{domaine.domaine}</h6>
                      <div className="grid grid-cols-1 gap-2">
                        {domaine.activites.map((activite, actIndex) => (
                          <div key={actIndex} className="flex justify-between items-center text-xs border-b pb-1">
                            <span>{activite.nom}</span>
                            <span className={`px-2 py-1 rounded font-bold ${
                              activite.evaluation === 'TS' ? 'bg-green-100 text-green-800' :
                              activite.evaluation === 'S' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {activite.evaluation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-600 mt-4">
                    <strong>Légende:</strong> TS = Très Satisfaisant, S = Satisfaisant, PS = Peu Satisfaisant
                  </div>
                </div>
              ) : selectedLevel === 'primaire' ? (
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">I- CONNAISSANCE ET HABILETÉS</h5>
                  {bulletinData.competencesPrimaire.slice(0, 3).map((domaine, index) => (
                    <div key={index} className="mb-4">
                      <h6 className="text-sm font-medium text-gray-800 mb-2">{domaine.domaine}</h6>
                      <div className="grid grid-cols-1 gap-2">
                        {domaine.competences.map((competence, compIndex) => (
                          <div key={compIndex} className="flex justify-between items-center text-xs border-b pb-1">
                            <span>• {competence.nom}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{competence.note.toFixed(1)}/20</span>
                              <span className={`px-1 py-0.5 rounded font-bold ${
                                getAppreciationSymbol(competence.appreciation).bg
                              } ${getAppreciationSymbol(competence.appreciation).color}`}>
                                {getAppreciationSymbol(competence.appreciation).emoji} {competence.appreciation}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-600 mt-4">
                    <strong>Moyenne obtenue:</strong> {bulletinData.statistiquesPrimaire.moyenneObtenue.toFixed(2)}/20<br/>
                    <strong>Seuil global atteint:</strong> {bulletinData.statistiquesPrimaire.seuilGlobalAtteint ? 'OUI' : 'NON'}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto mb-6">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-2 py-2 text-left">Matières</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">EM1</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">EM2</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">EC</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Moyenne</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletinData.notes.map((note, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-2">{note.matiere}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{note.EM1.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{note.EM2.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{note.EC.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center font-semibold">{note.moyenne.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{note.appreciation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

              <div className="text-center text-sm text-gray-600">
                <p>Bulletin généré le {new Date().toLocaleDateString('fr-FR')}</p>
                <p>Academia Hub - Module Examens</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de notifications */}
      {showNotifications && (
        <NotificationPanel
          onClose={() => {
            setShowNotifications(false);
            setSelectedBulletin(null);
          }}
          context={{
            type: 'bulletin',
            data: selectedBulletin
          }}
        />
      )}
    </div>
  );
}