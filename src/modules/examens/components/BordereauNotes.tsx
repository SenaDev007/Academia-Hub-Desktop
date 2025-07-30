import React, { useState } from 'react';
import { apiService } from '../services/api';
import { FileText, Download, Printer as Print, Filter, Eye, BarChart3, Users, RefreshCw } from 'lucide-react';

export function BordereauNotes() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedLevel, setSelectedLevel] = useState('primaire');
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedTrimester, setSelectedTrimester] = useState('T1');
  const [selectedSubject, setSelectedSubject] = useState('Toutes');
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
  
  const subjects = ['Toutes', 'Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais'];

  // Fonction pour obtenir les colonnes selon le niveau scolaire
  const getColumnsForLevel = () => {
    switch (selectedLevel) {
      case 'maternelle':
        return [
          { key: 'evaluation', label: 'Évaluation', type: 'qualitative' }
        ];
      case 'primaire':
        return [
          { key: 'em1', label: 'EM1' },
          { key: 'em2', label: 'EM2' },
          { key: 'ec', label: 'EC' },
          { key: 'moyenne', label: 'Moyenne' }
        ];
      case '1er_cycle':
        return [
          { key: 'ie1', label: 'IE1' },
          { key: 'ie2', label: 'IE2' },
          { key: 'moy_ie', label: 'Moy. IE' },
          { key: 'ds1', label: 'DS1' },
          { key: 'ds2', label: 'DS2' },
          { key: 'moyenne', label: 'Moyenne' }
        ];
      case '2nd_cycle':
        return [
          { key: 'ie1', label: 'IE1' },
          { key: 'ie2', label: 'IE2' },
          { key: 'moy_ie', label: 'Moy. IE' },
          { key: 'ds1', label: 'DS1' },
          { key: 'ds2', label: 'DS2' },
          { key: 'coef', label: 'Coef' },
          { key: 'moyenne', label: 'Moyenne coef' }
        ];
      default:
        return [];
    }
  };

  // Données simulées pour le bordereau
  const bordereauxData = [
    {
      id: 1,
      nom: 'ADJOVI',
      prenom: 'Marie',
      numeroEducmaster: 'EDU2024001',
      sexe: 'F',
      notes: {
        'Mathématiques': { EM1: 15.5, EM2: 16.0, EC: 14.5, moyenne: 15.33 },
        'Français': { EM1: 13.0, EM2: 14.5, EC: 15.0, moyenne: 14.17 },
        'Sciences': { EM1: 16.5, EM2: 15.0, EC: 17.0, moyenne: 16.17 },
        'Histoire-Géographie': { EM1: 12.0, EM2: 13.5, EC: 14.0, moyenne: 13.17 },
        'Anglais': { EM1: 14.0, EM2: 15.5, EC: 13.0, moyenne: 14.17 }
      },
      moyenneGenerale: 14.60,
      rang: 2
    },
    {
      id: 2,
      nom: 'BASSENE',
      prenom: 'Jean',
      numeroEducmaster: 'EDU2024002',
      sexe: 'M',
      notes: {
        'Mathématiques': { EM1: 12.0, EM2: 11.5, EC: 13.0, moyenne: 12.17 },
        'Français': { EM1: 14.5, EM2: 13.0, EC: 12.5, moyenne: 13.33 },
        'Sciences': { EM1: 11.0, EM2: 12.5, EC: 13.5, moyenne: 12.33 },
        'Histoire-Géographie': { EM1: 13.5, EM2: 14.0, EC: 12.0, moyenne: 13.17 },
        'Anglais': { EM1: 10.5, EM2: 11.0, EC: 12.5, moyenne: 11.33 }
      },
      moyenneGenerale: 12.47,
      rang: 15
    },
    {
      id: 3,
      nom: 'HOUEDE',
      prenom: 'Sophie',
      numeroEducmaster: 'EDU2024003',
      sexe: 'F',
      notes: {
        'Mathématiques': { EM1: 17.0, EM2: 18.5, EC: 16.5, moyenne: 17.33 },
        'Français': { EM1: 16.5, EM2: 17.0, EC: 18.0, moyenne: 17.17 },
        'Sciences': { EM1: 18.0, EM2: 17.5, EC: 19.0, moyenne: 18.17 },
        'Histoire-Géographie': { EM1: 15.5, EM2: 16.0, EC: 17.5, moyenne: 16.33 },
        'Anglais': { EM1: 16.0, EM2: 17.5, EC: 16.5, moyenne: 16.67 }
      },
      moyenneGenerale: 17.13,
      rang: 1
    }
  ];

  // Fonction pour formater le rang avec gestion du sexe et ex-aequo
  const formatRang = (rang: number, sexe: string) => {
    let suffix = '';
    if (rang === 1) {
      suffix = sexe === 'F' ? 'ère' : 'er';
    } else {
      suffix = 'ème';
    }
    return `${rang}${suffix}`;
  };
  const getAppreciationColor = (moyenne: number) => {
    if (moyenne >= 16) return 'text-green-700 bg-green-50';
    if (moyenne >= 14) return 'text-blue-700 bg-blue-50';
    if (moyenne >= 12) return 'text-yellow-700 bg-yellow-50';
    if (moyenne >= 10) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  const getAppreciationText = (moyenne: number) => {
    if (moyenne >= 18) return 'Excellent 🌟';
    if (moyenne >= 16) return 'Très Bien 😊';
    if (moyenne >= 14) return 'Bien 👍';
    if (moyenne >= 12) return 'Assez Bien 😐';
    if (moyenne >= 10) return 'Passable ⚠️';
    if (moyenne >= 8) return 'Insuffisant ❌';
    return 'Très Insuffisant 🚫';
  };

  const filteredData = selectedSubject === 'Toutes' ? bordereauxData : bordereauxData;

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    
    try {
      const data = await apiService.getBordereau({
        classe_id: 1, // À adapter selon la classe sélectionnée
        trimestre_id: 1, // À adapter selon le trimestre sélectionné
        matiere_id: selectedSubject !== 'Toutes' ? 1 : undefined
      });
      
      // Création d'un fichier CSV avec les vraies données
      const csvContent = "data:text/csv;charset=utf-8," 
        + "N° Educmaster,Nom,Prenom,Sexe,Matiere,EM1,EM2,EC,Moyenne\n"
        + data.data.map(row => {
            return `${row.numero_educmaster},${row.nom},${row.prenom},${row.sexe},${row.matiere},${row.EM1 || ''},${row.EM2 || ''},${row.EC || ''},${row.moyenne || ''}`;
          }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bordereau_${selectedClass}_${selectedTrimester}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export du bordereau');
    }
    
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
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
            <FileText className="h-7 w-7 mr-3 text-blue-600" />
            Bordereau de Notes
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
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Export...' : 'Exporter Excel'}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Print className="h-4 w-4 mr-2" />
              Imprimer
            </button>
          </div>
        </div>

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

      {/* Statistiques de classe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length}
              </p>
              <p className="text-sm text-gray-600">Élèves</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(filteredData.reduce((sum, student) => sum + student.moyenneGenerale, 0) / filteredData.length).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Moyenne Classe</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(student => student.moyenneGenerale >= 10).length}
              </p>
              <p className="text-sm text-gray-600">Admis</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold">✗</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(student => student.moyenneGenerale < 10).length}
              </p>
              <p className="text-sm text-gray-600">En difficulté</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bordereau détaillé */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Bordereau de Notes - {selectedClass} - {selectedTrimester}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Système Primaire: EM1, EM2 (Évaluations Mensuelles) + EC (Évaluation Certificative)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Sexe
                </th>
                {selectedLevel === 'maternelle' ? (
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Évaluation Globale
                  </th>
                ) : (
                  Object.keys(bordereauxData[0].notes).map(matiere => (
                    <th key={matiere} className="px-3 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <div className="space-y-1">
                        <div>{matiere}</div>
                        <div className="flex justify-center space-x-1 text-xs">
                          {getColumnsForLevel().map(col => (
                            <span key={col.key} className={`px-1 rounded ${
                              col.key === 'moyenne' ? 'bg-purple-100' :
                              col.key === 'moy_ie' ? 'bg-yellow-100' :
                              col.key === 'coef' ? 'bg-gray-100' :
                              col.key.includes('em') ? 'bg-blue-100' :
                              col.key === 'ec' ? 'bg-green-100' :
                              'bg-orange-100'
                            }`}>
                              {col.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </th>
                  ))
                )}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Moyenne Générale
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Appréciation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {student.prenom.charAt(0)}{student.nom.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.nom} {student.prenom}
                        </div>
                        <div className="text-xs text-gray-500">{student.numeroEducmaster}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      student.sexe === 'F' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.sexe}
                    </span>
                  </td>
                  {Object.entries(student.notes).map(([matiere, noteData]) => (
                    <td key={matiere} className="px-3 py-4 text-center">
                      <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-1 text-xs">
                          <span className="bg-blue-50 p-1 rounded">{noteData.EM1}</span>
                          <span className="bg-blue-50 p-1 rounded">{noteData.EM2}</span>
                          <span className="bg-green-50 p-1 rounded">{noteData.EC}</span>
                          <span className={`p-1 rounded font-semibold ${getAppreciationColor(noteData.moyenne)}`}>
                            {noteData.moyenne.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getAppreciationColor(student.moyenneGenerale)}`}>
                      {student.moyenneGenerale.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-sm font-bold ${
                      student.rang === 1 ? 'bg-yellow-100 text-yellow-800' :
                      student.rang === 2 ? 'bg-gray-100 text-gray-800' :
                      student.rang === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {formatRang(student.rang, student.sexe)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAppreciationColor(student.moyenneGenerale)}`}>
                      {getAppreciationText(student.moyenneGenerale)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Résumé statistique */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Répartition par Mention</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Excellent (≥18):</span>
                  <span className="font-semibold text-green-600">
                    {filteredData.filter(s => s.moyenneGenerale >= 18).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Très Bien (16-17.99):</span>
                  <span className="font-semibold text-blue-600">
                    {filteredData.filter(s => s.moyenneGenerale >= 16 && s.moyenneGenerale < 18).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bien (14-15.99):</span>
                  <span className="font-semibold text-blue-500">
                    {filteredData.filter(s => s.moyenneGenerale >= 14 && s.moyenneGenerale < 16).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Assez Bien (12-13.99):</span>
                  <span className="font-semibold text-yellow-600">
                    {filteredData.filter(s => s.moyenneGenerale >= 12 && s.moyenneGenerale < 14).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Passable (10-11.99):</span>
                  <span className="font-semibold text-orange-600">
                    {filteredData.filter(s => s.moyenneGenerale >= 10 && s.moyenneGenerale < 12).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insuffisant (&lt;10):</span>
                  <span className="font-semibold text-red-600">
                    {filteredData.filter(s => s.moyenneGenerale < 10).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Statistiques Générales</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Moyenne de classe:</span>
                  <div className="font-bold text-lg text-blue-600">
                    {(filteredData.reduce((sum, student) => sum + student.moyenneGenerale, 0) / filteredData.length).toFixed(2)}/20
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Taux de réussite:</span>
                  <div className="font-bold text-lg text-green-600">
                    {((filteredData.filter(s => s.moyenneGenerale >= 10).length / filteredData.length) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Extrêmes</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Meilleure moyenne:</span>
                  <div className="font-bold text-lg text-green-600">
                    {Math.max(...filteredData.map(s => s.moyenneGenerale)).toFixed(2)}/20
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Plus faible moyenne:</span>
                  <div className="font-bold text-lg text-red-600">
                    {Math.min(...filteredData.map(s => s.moyenneGenerale)).toFixed(2)}/20
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'aperçu */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Aperçu du Bordereau - {selectedClass} - {selectedTrimester}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">RÉPUBLIQUE DU BÉNIN</h2>
                <p className="text-gray-600">Ministère de l'Enseignement Primaire et Secondaire</p>
                <h3 className="text-lg font-semibold mt-4">BORDEREAU DE NOTES</h3>
                <p className="text-gray-600">{selectedClass} - {selectedTrimester}</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-2 py-2 text-left">N°</th>
                      <th className="border border-gray-300 px-2 py-2 text-left">Nom & Prénoms</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Sexe</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Math</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Français</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Sciences</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Moy. Gén.</th>
                      <th className="border border-gray-300 px-2 py-2 text-center">Rang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((student, index) => (
                      <tr key={student.id}>
                        <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-2">{student.nom} {student.prenom}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{student.sexe}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{student.notes.Mathématiques.moyenne.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{student.notes.Français.moyenne.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{student.notes.Sciences.moyenne.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center font-semibold">{student.moyenneGenerale.toFixed(2)}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center">{formatRang(student.rang, student.sexe)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
                <p>Academia Hub - Module Examens</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}