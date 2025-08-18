import React, { useState } from 'react';
import { formatRang } from '../utils/formatters';
import { apiService } from '../services/api';
import { 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  Download,
  Eye,
  RefreshCw,
  Printer as Print,
  BarChart3
} from 'lucide-react';

export function ConseilsClasse() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedLevel, setSelectedLevel] = useState('primaire');
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedTrimester, setSelectedTrimester] = useState('T1');
  const [showPVModal, setShowPVModal] = useState(false);
  const [isGeneratingPV, setIsGeneratingPV] = useState(false);
  const [showGenerateMoyennesModal, setShowGenerateMoyennesModal] = useState(false);
  const [selectedPeriodType, setSelectedPeriodType] = useState('evaluation');
  const [selectedEvaluation, setSelectedEvaluation] = useState('EM1');
  const [showMoyennesTable, setShowMoyennesTable] = useState(false);
  const [moyennesData, setMoyennesData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const anneesScolaires = ['2024-2025', '2023-2024', '2022-2023'];
  const niveauxScolaires = [
    { id: 'maternelle', label: 'Maternelle' },
    { id: 'primaire', label: 'Primaire' },
    { id: '1er_cycle', label: '1er Cycle Secondaire' },
    { id: '2nd_cycle', label: '2nd Cycle Secondaire' }
  ];
  
  const classesByLevel = {
    'maternelle': ['Petite Section', 'Moyenne Section', 'Grande Section'],
    'primaire': ['CP', 'CE1', 'CE2', 'CM1', 'CM2-A', 'CM2-B'],
    '1er_cycle': ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '3ème A'],
    '2nd_cycle': ['2nde A', '2nde C', '1ère A1', '1ère C', 'Terminale A1', 'Terminale C']
  };
  
  const trimestresByYear = {
    '2024-2025': ['T1', 'T2', 'T3'],
    '2023-2024': ['T1', 'T2', 'T3'],
    '2022-2023': ['T1', 'T2', 'T3']
  };

  // Données simulées pour le conseil de classe
  const conseilData = {
    classe: 'CM2-A',
    trimestre: 'T1',
    date: '2024-01-15',
    effectif: 25,
    presents: 23,
    absents: 2,
    moyenneClasse: 12.85,
    tauxReussite: 76.0,
    decisions: {
      admis: 19,
      avertissement: 3,
      redoublement: 1,
      exclusion: 0
    },
    eleves: [
      {
        id: 1,
        nom: 'ADJOVI Marie',
        numeroEducmaster: 'EDU2024001',
        moyenneGenerale: 15.75,
        moyennesMatières: {
          'Mathématiques': 16.2,
          'Français': 15.8,
          'Sciences': 16.1,
          'Histoire-Géo': 14.9,
          'Anglais': 15.5
        },
        assiduité: 'Excellent',
        comportement: 'Très Bien',
        decision: 'Félicitations',
        observations: 'Élève brillante, continue sur cette voie.',
        recommandations: 'Maintenir le niveau d\'excellence.'
      },
      {
        id: 2,
        nom: 'BASSENE Jean',
        numeroEducmaster: 'EDU2024002',
        moyenneGenerale: 9.45,
        moyennesMatières: {
          'Mathématiques': 8.5,
          'Français': 10.2,
          'Sciences': 9.8,
          'Histoire-Géo': 9.7,
          'Anglais': 8.9
        },
        assiduité: 'Moyen',
        comportement: 'Correct',
        decision: 'Avertissement',
        observations: 'Difficultés en mathématiques et anglais.',
        recommandations: 'Soutien scolaire nécessaire, plus de travail personnel.'
      },
      {
        id: 3,
        nom: 'HOUEDE Sophie',
        numeroEducmaster: 'EDU2024003',
        moyenneGenerale: 17.25,
        moyennesMatières: {
          'Mathématiques': 18.1,
          'Français': 17.2,
          'Sciences': 17.8,
          'Histoire-Géo': 16.5,
          'Anglais': 16.9
        },
        assiduité: 'Excellent',
        comportement: 'Excellent',
        decision: 'Félicitations',
        observations: 'Élève exceptionnelle, leader de la classe.',
        recommandations: 'Encourager vers l\'excellence, possibilité de saut de classe.'
      }
    ]
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Félicitations':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Encouragements':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Avertissement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Blâme':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Exclusion':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAppreciationColor = (moyenne: number) => {
    if (moyenne >= 16) return 'text-green-600';
    if (moyenne >= 14) return 'text-blue-600';
    if (moyenne >= 12) return 'text-yellow-600';
    if (moyenne >= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleViewPV = () => {
    setShowPVModal(true);
  };

  const handleDownloadPV = async () => {
    setIsGeneratingPV(true);
    // Simulation de génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Création d'un contenu de PV simulé
    const pvContent = `PROCÈS-VERBAL DU CONSEIL DE CLASSE

Classe: ${selectedClass}
Trimestre: ${selectedTrimester}
Date: ${new Date().toLocaleDateString('fr-FR')}

STATISTIQUES:
- Effectif: ${conseilData.effectif}
- Moyenne classe: ${conseilData.moyenneClasse}
- Taux de réussite: ${conseilData.tauxReussite}%

DÉCISIONS:
${conseilData.eleves.map(eleve => 
  `${eleve.nom}: ${eleve.moyenneGenerale.toFixed(2)}/20 - ${eleve.decision}`
).join('\n')}

Le Directeur: M. AKPOVI Jean`;
    
    const blob = new Blob([pvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PV_Conseil_${selectedClass}_${selectedTrimester}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsGeneratingPV(false);
  };

  const handleGenerateMoyennes = async () => {
    setIsGenerating(true);
    
    try {
      await apiService.genererMoyennes({
        classe_id: 1, // À adapter selon la classe sélectionnée
        trimestre_id: 1, // À adapter selon le trimestre sélectionné
        type_moyenne: selectedPeriodType === 'evaluation' ? 'Evaluation' : 
                     selectedPeriodType === 'trimestre' ? 'Trimestre' : 'Annuelle',
        evaluation_id: selectedPeriodType === 'evaluation' ? 1 : undefined
      });
      
      // Récupérer les moyennes générées
      const moyennesResponse = await apiService.getMoyennes({
        classe_id: 1,
        trimestre_id: 1,
        type_moyenne: selectedPeriodType === 'evaluation' ? 'Evaluation' : 
                     selectedPeriodType === 'trimestre' ? 'Trimestre' : 'Annuelle'
      });
      
      const mockData = {
        type: selectedPeriodType,
        period: selectedPeriodType === 'evaluation' ? selectedEvaluation : selectedTrimester,
        eleves: moyennesResponse.data.map(moyenne => ({
          id: moyenne.eleve_id,
          nom: moyenne.nom,
          prenom: moyenne.prenom,
          numeroEducmaster: moyenne.numero_educmaster,
          moyenneCalculee: moyenne.moyenne.toFixed(2)
        }))
      };
      
      setMoyennesData(mockData);
      setShowGenerateMoyennesModal(false);
      setShowMoyennesTable(true);
    } catch (error) {
      console.error('Erreur lors de la génération des moyennes:', error);
      alert('Erreur lors de la génération des moyennes');
    }
    
    setIsGenerating(false);
  };

  const getAvailableClasses = () => {
    return classesByLevel[selectedLevel as keyof typeof classesByLevel] || classesByLevel.primaire;
  };

  const getAvailableTrimestres = () => {
    return trimestresByYear[selectedYear as keyof typeof trimestresByYear] || ['T1', 'T2', 'T3'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-7 w-7 mr-3 text-blue-600" />
            Conseils de Classe
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowGenerateMoyennesModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Générer
            </button>
            <button 
              onClick={handleViewPV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              PV Conseil
            </button>
            <button 
              onClick={handleDownloadPV}
              disabled={isGeneratingPV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGeneratingPV ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGeneratingPV ? 'Génération...' : 'Télécharger PV'}
            </button>
          </div>
        </div>

        {/* Modal Génération des Moyennes */}
        {showGenerateMoyennesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Générer les Moyennes Automatiquement
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Calcul des moyennes par évaluation, trimestre et année
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Paramètres de Génération</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Type de Période</label>
                        <select
                          value={selectedPeriodType}
                          onChange={(e) => setSelectedPeriodType(e.target.value)}
                          className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="evaluation">Par Évaluation</option>
                          <option value="trimestre">Par Trimestre</option>
                          <option value="annuel">Annuel</option>
                        </select>
                      </div>
                      
                      {selectedPeriodType === 'evaluation' && (
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Évaluation</label>
                          <select
                            value={selectedEvaluation}
                            onChange={(e) => setSelectedEvaluation(e.target.value)}
                            className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            {selectedLevel === 'primaire' ? (
                              <>
                                <option value="EM1">EM1</option>
                                <option value="EM2">EM2</option>
                                <option value="EC">EC</option>
                              </>
                            ) : (
                              <>
                                <option value="IE1">IE1</option>
                                <option value="IE2">IE2</option>
                                <option value="DS1">DS1</option>
                                <option value="DS2">DS2</option>
                              </>
                            )}
                          </select>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Année:</strong> {selectedYear}</p>
                        <p><strong>Niveau:</strong> {niveauxScolaires.find(n => n.id === selectedLevel)?.label}</p>
                        <p><strong>Classe:</strong> {selectedClass}</p>
                      </div>
                      <div>
                        <p><strong>Période:</strong> {selectedPeriodType === 'evaluation' ? selectedEvaluation : selectedTrimester}</p>
                        <p><strong>Type de calcul:</strong> Selon système béninois</p>
                        <p><strong>Coefficients:</strong> {selectedLevel === '2nd_cycle' ? 'Avec' : 'Sans'}</p>
                      </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Opérations à effectuer</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Calcul des moyennes par évaluation selon le niveau scolaire</li>
                      <li>• {selectedLevel === 'maternelle' ? 'Évaluation qualitative (TS/S/PS)' : 
                           selectedLevel === 'primaire' ? 'EM1, EM2, EC (sans coefficient)' :
                           selectedLevel === '1er_cycle' ? 'IE1, IE2, DS1, DS2 (sans coefficient)' :
                           'IE1, IE2, DS1, DS2 (avec coefficients par série)'}</li>
                      <li>• Calcul des moyennes trimestrielles par matière</li>
                      <li>• Calcul des moyennes générales par élève</li>
                      <li>• Attribution des rangs et appréciations</li>
                      <li>• Génération des statistiques de classe</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Formules de Calcul</h4>
                    <div className="text-sm text-green-800">
                      {selectedLevel === 'primaire' && (
                        <div>
                          <p><strong>Primaire:</strong></p>
                          <p>• Moyenne EM = (EM1 + EM2) / 2</p>
                          <p>• Moyenne Trimestre = (Moyenne EM + EC) / 2</p>
                        </div>
                      )}
                      {selectedLevel === '1er_cycle' && (
                        <div>
                          <p><strong>1er Cycle:</strong></p>
                          <p>• Moyenne IE = (IE1 + IE2) / 2</p>
                          <p>• Moyenne Matière = (Moyenne IE + DS1 + DS2) / 3</p>
                        </div>
                      )}
                      {selectedLevel === '2nd_cycle' && (
                        <div>
                          <p><strong>2nd Cycle:</strong></p>
                          <p>• Moyenne IE = (IE1 + IE2) / 2</p>
                          <p>• Moyenne Matière = ((Moyenne IE + DS1 + DS2) / 3) × Coefficient</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowGenerateMoyennesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerateMoyennes}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                      Génération en cours...
                    </>
                  ) : (
                    `Générer ${selectedPeriodType === 'evaluation' ? 'par Évaluation' : selectedPeriodType === 'trimestre' ? 'par Trimestre' : 'Annuel'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal PV Conseil */}
        {showPVModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Procès-Verbal du Conseil de Classe
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <Print className="h-4 w-4 mr-1" />
                      Imprimer
                    </button>
                    <button
                      onClick={() => setShowPVModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">RÉPUBLIQUE DU BÉNIN</h2>
                  <p className="text-gray-600">Ministère de l'Enseignement Primaire et Secondaire</p>
                  <h3 className="text-lg font-semibold mt-4">PROCÈS-VERBAL DU CONSEIL DE CLASSE</h3>
                  <p className="text-gray-600">{selectedClass} - {selectedTrimester}</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Composition du Conseil</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Directeur: M. AKPOVI Jean</li>
                      <li>• Professeur Principal: Mme TOSSA Marie</li>
                      <li>• Représentant Parents: M. DOSSOU Paul</li>
                      <li>• Délégué Élèves: AGBODJI Sophie</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Statistiques de Classe</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Effectif: {conseilData.effectif} élèves</li>
                      <li>• Moyenne classe: {conseilData.moyenneClasse}/20</li>
                      <li>• Taux de réussite: {conseilData.tauxReussite}%</li>
                      <li>• Élèves en difficulté: {conseilData.decisions.avertissement}</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Décisions du Conseil</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-3 py-2 text-left">Élève</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Moyenne</th>
                          <th className="border border-gray-300 px-3 py-2 text-center">Décision</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Observations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conseilData.eleves.map((eleve, index) => (
                          <tr key={eleve.id}>
                            <td className="border border-gray-300 px-3 py-2">{eleve.nom}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{eleve.moyenneGenerale.toFixed(2)}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{eleve.decision}</td>
                            <td className="border border-gray-300 px-3 py-2">{eleve.observations}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600 border-t pt-4">
                  <p>Le Directeur</p>
                  <p className="mt-8">M. AKPOVI Jean</p>
                  <p className="text-xs mt-2">Signature et cachet</p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Table des moyennes générées */}
      {showMoyennesTable && moyennesData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Moyennes Générées - {moyennesData.type === 'evaluation' ? moyennesData.period : 
                                   moyennesData.type === 'trimestre' ? `Trimestre ${moyennesData.period}` : 
                                   'Année Complète'}
              </h3>
              <button
                onClick={() => setShowMoyennesTable(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Élève</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">N° Educmaster</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Moyenne Calculée</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Appréciation</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Rang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moyennesData.eleves.map((eleve, index) => {
                  const moyenne = parseFloat(eleve.moyenneCalculee);
                  const appreciation = getAppreciationColor(moyenne);
                  const rang = formatRang(index + 1, eleve.nom.includes('Marie') || eleve.nom.includes('Sophie') ? 'F' : 'M');
                  
                  return (
                    <tr key={eleve.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{eleve.nom}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-700">{eleve.numeroEducmaster}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${appreciation}`}>
                          {eleve.moyenneCalculee}/20
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-700">
                        {moyenne >= 16 ? 'Très Bien' : moyenne >= 14 ? 'Bien' : moyenne >= 12 ? 'Assez Bien' : moyenne >= 10 ? 'Passable' : 'Insuffisant'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rang}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Année Scolaire</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {anneesScolaires.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trimestre</label>
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {getAvailableTrimestres().map(trimestre => (
                <option key={trimestre} value={trimestre}>
                  {trimestre === 'T1' ? '1er Trimestre' : 
                   trimestre === 'T2' ? '2ème Trimestre' : 
                   '3ème Trimestre'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau Scolaire</label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedClass(getAvailableClasses()[0]);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {niveauxScolaires.map(niveau => (
                <option key={niveau.id} value={niveau.id}>{niveau.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {getAvailableClasses().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Statistiques du conseil */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{conseilData.effectif}</p>
              <p className="text-sm text-gray-600">Effectif Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{conseilData.presents}</p>
              <p className="text-sm text-gray-600">Élèves Évalués</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{conseilData.moyenneClasse}</p>
              <p className="text-sm text-gray-600">Moyenne Classe</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold text-sm">{conseilData.tauxReussite}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{conseilData.tauxReussite}%</p>
              <p className="text-sm text-gray-600">Taux de Réussite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des décisions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Répartition des Décisions du Conseil
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-semibold">Félicitations</p>
                <p className="text-2xl font-bold text-green-700">{conseilData.decisions.admis}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-semibold">Avertissements</p>
                <p className="text-2xl font-bold text-yellow-700">{conseilData.decisions.avertissement}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-semibold">À surveiller</p>
                <p className="text-2xl font-bold text-orange-700">{conseilData.decisions.redoublement}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-semibold">Difficultés</p>
                <p className="text-2xl font-bold text-red-700">{conseilData.decisions.exclusion}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des élèves et décisions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Décisions du Conseil de Classe - {selectedClass} - {selectedTrimester}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Date du conseil: {new Date(conseilData.date).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Élève</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Moy. Générale</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Moyennes par Matière</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Assiduité</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Comportement</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Décision</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conseilData.eleves.map((eleve, index) => (
                <tr key={eleve.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                          {eleve.nom.split(' ')[1]?.charAt(0)}{eleve.nom.split(' ')[0]?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{eleve.nom}</div>
                        <div className="text-xs text-gray-500">{eleve.numeroEducmaster}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`text-lg font-bold ${getAppreciationColor(eleve.moyenneGenerale)}`}>
                      {eleve.moyenneGenerale.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      {Object.entries(eleve.moyennesMatières).map(([matiere, moyenne]) => (
                        <div key={matiere} className="text-center">
                          <div className="text-gray-600 truncate" title={matiere}>
                            {matiere.split(' ')[0].substring(0, 4)}
                          </div>
                          <div className={`font-semibold ${getAppreciationColor(moyenne)}`}>
                            {moyenne.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      eleve.assiduité === 'Excellent' ? 'bg-green-100 text-green-800' :
                      eleve.assiduité === 'Bon' ? 'bg-blue-100 text-blue-800' :
                      eleve.assiduité === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {eleve.assiduité}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      eleve.comportement === 'Excellent' ? 'bg-green-100 text-green-800' :
                      eleve.comportement === 'Très Bien' ? 'bg-blue-100 text-blue-800' :
                      eleve.comportement === 'Correct' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {eleve.comportement}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDecisionColor(eleve.decision)}`}>
                      {eleve.decision}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{eleve.observations}</div>
                      <div className="text-xs text-gray-600 italic">{eleve.recommandations}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pied de page avec signature */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Présents au Conseil</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Directeur: M. AKPOVI Jean</p>
                <p>• Professeur Principal: Mme TOSSA Marie</p>
                <p>• Représentant Parents: M. DOSSOU Paul</p>
                <p>• Délégué Élèves: AGBODJI Sophie</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Résumé Statistique</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Moyenne classe: {conseilData.moyenneClasse}/20</p>
                <p>• Taux de réussite: {conseilData.tauxReussite}%</p>
                <p>• Élèves en difficulté: {conseilData.decisions.avertissement + conseilData.decisions.redoublement}</p>
                <p>• Élèves excellents: {conseilData.decisions.admis}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Validation</h4>
              <div className="text-sm text-gray-600 space-y-3">
                <p>Date: {new Date(conseilData.date).toLocaleDateString('fr-FR')}</p>
                <div className="border-t border-gray-300 pt-2">
                  <p className="font-medium">Le Directeur</p>
                  <p className="text-xs text-gray-500">Signature et cachet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
