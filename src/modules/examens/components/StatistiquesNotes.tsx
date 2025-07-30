import React, { useState } from 'react';
import { apiService } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users,
  Award,
  Target,
  Download,
  Filter,
  RefreshCw,
  FileText
} from 'lucide-react';

export function StatistiquesNotes() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedLevel, setSelectedLevel] = useState('primaire');
  const [selectedClass, setSelectedClass] = useState('Toutes');
  const [selectedTrimester, setSelectedTrimester] = useState('T1');
  const [selectedSubject, setSelectedSubject] = useState('Toutes');
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const anneesScolaires = ['2024-2025', '2023-2024', '2022-2023'];
  const niveauxScolaires = [
    { id: 'maternelle', label: 'Maternelle' },
    { id: 'primaire', label: 'Primaire' },
    { id: '1er_cycle', label: '1er Cycle Secondaire' },
    { id: '2nd_cycle', label: '2nd Cycle Secondaire' }
  ];
  
  const classesByLevel = {
    'maternelle': ['Toutes', 'Petite Section', 'Moyenne Section', 'Grande Section'],
    'primaire': ['Toutes', 'CP', 'CE1', 'CE2', 'CM1', 'CM2-A', 'CM2-B'],
    '1er_cycle': ['Toutes', '6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '3ème A'],
    '2nd_cycle': ['Toutes', '2nde A', '2nde C', '1ère A1', '1ère C', 'Terminale A1', 'Terminale C']
  };
  
  const trimestresByYear = {
    '2024-2025': ['T1', 'T2', 'T3'],
    '2023-2024': ['T1', 'T2', 'T3'],
    '2022-2023': ['T1', 'T2', 'T3']
  };
  
  const subjects = ['Toutes', 'Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais'];

  // Données statistiques simulées
  const statistiques = {
    global: {
      effectifTotal: 247,
      moyenneGenerale: 12.85,
      tauxReussite: 73.2,
      meilleureMoyenne: 18.75,
      plusFaibleMoyenne: 6.25
    },
    repartitionNotes: [
      { tranche: '18-20', count: 18, percentage: 7.3, color: 'bg-green-500' },
      { tranche: '16-18', count: 32, percentage: 13.0, color: 'bg-green-400' },
      { tranche: '14-16', count: 45, percentage: 18.2, color: 'bg-blue-500' },
      { tranche: '12-14', count: 58, percentage: 23.5, color: 'bg-blue-400' },
      { tranche: '10-12', count: 28, percentage: 11.3, color: 'bg-yellow-500' },
      { tranche: '8-10', count: 35, percentage: 14.2, color: 'bg-orange-500' },
      { tranche: '0-8', count: 31, percentage: 12.5, color: 'bg-red-500' }
    ],
    evolutionTrimestre: [
      { trimestre: 'T1', moyenne: 12.85, tauxReussite: 73.2 },
      { trimestre: 'T2', moyenne: 13.12, tauxReussite: 75.8 },
      { trimestre: 'T3', moyenne: 13.45, tauxReussite: 78.1 }
    ],
    performancesParMatiere: [
      { matiere: 'Mathématiques', moyenne: 11.8, tauxReussite: 68.4, coefficient: 1 },
      { matiere: 'Français', moyenne: 13.2, tauxReussite: 76.9, coefficient: 1 },
      { matiere: 'Sciences', moyenne: 12.9, tauxReussite: 74.1, coefficient: 1 },
      { matiere: 'Histoire-Géographie', moyenne: 13.5, tauxReussite: 79.4, coefficient: 1 },
      { matiere: 'Anglais', moyenne: 12.1, tauxReussite: 70.2, coefficient: 1 }
    ],
    topEleves: [
      { rang: 1, nom: 'HOUEDE Sophie', classe: 'CM2-A', moyenne: 18.75, appreciation: 'Excellent' },
      { rang: 2, nom: 'ADJOVI Marie', classe: 'CM2-A', moyenne: 17.85, appreciation: 'Excellent' },
      { rang: 3, nom: 'KONE Abdoul', classe: '6ème A', moyenne: 17.45, appreciation: 'Très Bien' },
      { rang: 4, nom: 'SANTOS Lisa', classe: 'CM2-B', moyenne: 17.20, appreciation: 'Très Bien' },
      { rang: 5, nom: 'DOSSOU Paul', classe: '6ème B', moyenne: 16.95, appreciation: 'Très Bien' }
    ]
  };

  const getColorByPerformance = (moyenne: number) => {
    if (moyenne >= 16) return 'text-green-600 bg-green-50';
    if (moyenne >= 14) return 'text-blue-600 bg-blue-50';
    if (moyenne >= 12) return 'text-yellow-600 bg-yellow-50';
    if (moyenne >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    
    try {
      const statsResponse = await apiService.getStatistiquesGlobales({
        trimestre_id: 1 // À adapter selon le trimestre sélectionné
      });
      
      const reportContent = `RAPPORT STATISTIQUE - ${selectedTrimester}

STATISTIQUES GLOBALES:
- Effectif total: ${statsResponse.data.statistiques.effectif_total}
- Moyenne générale: ${statsResponse.data.statistiques.moyenne_generale.toFixed(2)}
- Taux de réussite: ${statsResponse.data.statistiques.taux_reussite.toFixed(1)}%

RÉPARTITION DES NOTES:
${statsResponse.data.repartition.map(tranche => 
  `${tranche.tranche}: ${tranche.count} élèves (${tranche.percentage.toFixed(1)}%)`
).join('\n')}`;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rapport_Statistiques_${selectedTrimester}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export du rapport');
    }
    
    setIsExporting(false);
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
            <BarChart3 className="h-7 w-7 mr-3 text-blue-600" />
            Statistiques des Notes et Moyennes
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={handleFilter}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Masquer Filtres' : 'Filtrer'}
            </button>
            <button 
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Export...' : 'Exporter Rapport'}
            </button>
          </div>
        </div>

        {/* Filtres conditionnels */}
        {showFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-3">Filtres Avancés</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Période</label>
                <select className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>Trimestre actuel</option>
                  <option>Année complète</option>
                  <option>Comparaison trimestrielle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Type d'analyse</label>
                <select className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>Analyse globale</option>
                  <option>Par niveau</option>
                  <option>Par série</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Seuil de réussite</label>
                <input 
                  type="number" 
                  min="0" 
                  max="20" 
                  defaultValue="10"
                  className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Format export</label>
                <select className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                setSelectedClass('Toutes');
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


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiques.global.effectifTotal}</p>
              <p className="text-sm text-gray-600">Élèves Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiques.global.moyenneGenerale}</p>
              <p className="text-sm text-gray-600">Moyenne Globale</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiques.global.tauxReussite}%</p>
              <p className="text-sm text-gray-600">Taux de Réussite</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiques.global.meilleureMoyenne}</p>
              <p className="text-sm text-gray-600">Meilleure Note</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold text-sm">!</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiques.global.plusFaibleMoyenne}</p>
              <p className="text-sm text-gray-600">Plus Faible Note</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Répartition des notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            Répartition des Notes par Tranche
          </h3>
          
          <div className="space-y-3">
            {statistiques.repartitionNotes.map((tranche, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${tranche.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{tranche.tranche}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${tranche.color}`}
                      style={{ width: `${tranche.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-[40px]">
                    {tranche.count}
                  </span>
                  <span className="text-xs text-gray-500 min-w-[35px]">
                    {tranche.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Élèves en réussite (≥10):</span>
              <span className="font-semibold text-green-600">
                {statistiques.repartitionNotes.slice(0, 5).reduce((sum, t) => sum + t.count, 0)} 
                ({statistiques.repartitionNotes.slice(0, 5).reduce((sum, t) => sum + t.percentage, 0).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Élèves en difficulté (&lt;10):</span>
              <span className="font-semibold text-red-600">
                {statistiques.repartitionNotes.slice(5).reduce((sum, t) => sum + t.count, 0)} 
                ({statistiques.repartitionNotes.slice(5).reduce((sum, t) => sum + t.percentage, 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Évolution par trimestre */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Évolution par Trimestre
          </h3>
          
          <div className="space-y-4">
            {statistiques.evolutionTrimestre.map((trimestre, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{trimestre.trimestre}</span>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getColorByPerformance(trimestre.moyenne)}`}>
                      {trimestre.moyenne}/20
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {trimestre.tauxReussite}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Moyenne</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(trimestre.moyenne / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Taux de réussite</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${trimestre.tauxReussite}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Tendance:</strong> 
              {statistiques.evolutionTrimestre[2].moyenne > statistiques.evolutionTrimestre[0].moyenne 
                ? ' Progression constante 📈' 
                : ' Stabilité ou régression 📊'}
            </div>
          </div>
        </div>
      </div>

      {/* Performances par matière */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Performances par Matière
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Matière</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Moyenne</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Taux de Réussite</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Performance</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Analyse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statistiques.performancesParMatiere.map((matiere, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {matiere.matiere}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorByPerformance(matiere.moyenne)}`}>
                      {matiere.moyenne.toFixed(1)}/20
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${matiere.tauxReussite}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {matiere.tauxReussite.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {matiere.moyenne >= 14 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Excellente
                      </span>
                    ) : matiere.moyenne >= 12 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Bonne
                      </span>
                    ) : matiere.moyenne >= 10 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Correcte
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        À améliorer
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-600">
                    {matiere.moyenne >= 14 
                      ? 'Maintenir le niveau'
                      : matiere.moyenne >= 10 
                      ? 'Renforcer les acquis'
                      : 'Soutien nécessaire'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 des meilleurs élèves */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-gold" />
          Top 5 des Meilleurs Élèves
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statistiques.topEleves.map((eleve, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              index === 0 ? 'bg-yellow-50 border-yellow-300' :
              index === 1 ? 'bg-gray-50 border-gray-300' :
              index === 2 ? 'bg-orange-50 border-orange-300' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold mb-2 ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-500' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {eleve.rang}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{eleve.nom}</h4>
                <p className="text-xs text-gray-600 mb-2">{eleve.classe}</p>
                <div className={`px-2 py-1 rounded-full text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {eleve.moyenne}/20
                </div>
                <p className="text-xs text-gray-600 mt-1">{eleve.appreciation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}