import React, { useState } from 'react';
import { apiService } from '../services/api';
import { 
  BookOpen, 
  Users, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

export function SaisieNotes() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedTrimester, setSelectedTrimester] = useState('T1');
  const [selectedLevel, setSelectedLevel] = useState('primaire');
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedSubject, setSelectedSubject] = useState('Mathématiques');
  const [selectedEvaluation, setSelectedEvaluation] = useState('EM1');
  const [isLoading, setIsLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>('view');
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);

  // Données simulées
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
  
  const subjects = ['Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie', 'Anglais'];
  const evaluationTypes = {
    'maternelle': ['Observation 1', 'Observation 2', 'Bilan'],
    'primaire': ['EM1', 'EM2', 'EC'],
    '1er_cycle': ['IE1', 'IE2', 'DS1', 'DS2'],
    '2nd_cycle': ['IE1', 'IE2', 'DS1', 'DS2']
  };

  const students = [
    { id: 1, nom: 'ADJOVI', prenom: 'Marie', sexe: 'F', numeroEducmaster: 'EDU2024001', rang: 2, moyenne: 15.75 },
    { id: 2, nom: 'BASSENE', prenom: 'Jean', sexe: 'M', numeroEducmaster: 'EDU2024002', rang: 15, moyenne: 9.45 },
    { id: 3, nom: 'HOUEDE', prenom: 'Sophie', sexe: 'F', numeroEducmaster: 'EDU2024003', rang: 1, moyenne: 17.25 },
    { id: 4, nom: 'KPODEHOME', prenom: 'André', sexe: 'M', numeroEducmaster: 'EDU2024004', rang: 8, moyenne: 12.80 },
    { id: 5, nom: 'AGBODJI', prenom: 'Lucie', sexe: 'F', numeroEducmaster: 'EDU2024005', rang: 5, moyenne: 14.20 },
    { id: 6, nom: 'SANTOS', prenom: 'Lisa', sexe: 'F', numeroEducmaster: 'EDU2024006', rang: 3, moyenne: 16.50 },
    { id: 7, nom: 'TOKO', prenom: 'André', sexe: 'M', numeroEducmaster: 'EDU2024007', rang: 3, moyenne: 16.50 }
  ];

  const [notes, setNotes] = useState<{[key: number]: string}>({});
  const [validatedNotes, setValidatedNotes] = useState<{[key: number]: boolean}>({});

  // Simulation des notes existantes pour certains élèves
  const [existingNotes, setExistingNotes] = useState<{[key: number]: boolean}>({
    1: true, // Marie ADJOVI a déjà des notes
    3: true, // Sophie HOUEDE a déjà des notes
    5: true  // Lucie AGBODJI a déjà des notes
  });

  // Fonction pour formater le rang avec gestion des ex-aequo et du sexe
  const formatRang = (rang: number, sexe: string, moyenne: number, allStudents: any[]) => {
    // Vérifier s'il y a des ex-aequo
    const studentsWithSameMoyenne = allStudents.filter(s => s.moyenne === moyenne);
    const isExAequo = studentsWithSameMoyenne.length > 1;
    
    let suffix = '';
    if (rang === 1) {
      suffix = sexe === 'F' ? 'ère' : 'er';
    } else {
      suffix = 'ème';
    }
    
    const baseRang = `${rang}${suffix}`;
    return isExAequo ? `${baseRang} ex-æquo` : baseRang;
  };

  // Fonction pour obtenir les colonnes d'évaluation selon le niveau
  const getEvaluationColumns = () => {
    switch (selectedLevel) {
      case 'maternelle':
        return [
          { key: 'evaluation', label: 'Évaluation', type: 'radio', options: ['TS', 'S', 'PS'] }
        ];
      case 'primaire':
        return [
          { key: 'em1', label: 'EM1', type: 'number', max: 20 },
          { key: 'em2', label: 'EM2', type: 'number', max: 20 },
          { key: 'ec', label: 'EC', type: 'number', max: 20 },
          { key: 'moyenne', label: 'Moyenne', type: 'calculated' }
        ];
      case '1er_cycle':
        return [
          { key: 'ie1', label: 'IE1', type: 'number', max: 20 },
          { key: 'ie2', label: 'IE2', type: 'number', max: 20 },
          { key: 'moy_ie', label: 'Moy. IE', type: 'calculated' },
          { key: 'ds1', label: 'DS1', type: 'number', max: 20 },
          { key: 'ds2', label: 'DS2', type: 'number', max: 20 },
          { key: 'moyenne', label: 'Moyenne', type: 'calculated' }
        ];
      case '2nd_cycle':
        return [
          { key: 'ie1', label: 'IE1', type: 'number', max: 20 },
          { key: 'ie2', label: 'IE2', type: 'number', max: 20 },
          { key: 'moy_ie', label: 'Moy. IE', type: 'calculated' },
          { key: 'ds1', label: 'DS1', type: 'number', max: 20 },
          { key: 'ds2', label: 'DS2', type: 'number', max: 20 },
          { key: 'coef', label: 'Coef', type: 'coefficient' },
          { key: 'moyenne', label: 'Moyenne coef', type: 'calculated' }
        ];
      default:
        return [];
    }
  };

  // Fonction pour obtenir le coefficient selon la matière et la série
  const getCoefficient = (matiere: string) => {
    // Simulation des coefficients pour série C (Terminale)
    const coefficients = {
      'Mathématiques': 7,
      'Sciences': 6,
      'Français': 3,
      'Histoire-Géographie': 2,
      'Anglais': 2
    };
    return coefficients[matiere as keyof typeof coefficients] || 1;
  };

  // Fonction pour calculer la moyenne selon le niveau
  const calculateMoyenne = (studentId: number, columns: any[]) => {
    const studentNotes = notes[studentId] || {};
    
    switch (selectedLevel) {
      case 'primaire':
        const em1 = parseFloat(studentNotes['em1'] || '0');
        const em2 = parseFloat(studentNotes['em2'] || '0');
        const ec = parseFloat(studentNotes['ec'] || '0');
        if (em1 && em2 && ec) {
          const moyenneEM = (em1 + em2) / 2;
          return ((moyenneEM + ec) / 2).toFixed(2);
        }
        break;
      case '1er_cycle':
        const ie1_1er = parseFloat(studentNotes['ie1'] || '0');
        const ie2_1er = parseFloat(studentNotes['ie2'] || '0');
        const ds1_1er = parseFloat(studentNotes['ds1'] || '0');
        const ds2_1er = parseFloat(studentNotes['ds2'] || '0');
        if (ie1_1er && ie2_1er && ds1_1er && ds2_1er) {
          const moyenneIE = (ie1_1er + ie2_1er) / 2;
          return ((moyenneIE + ds1_1er + ds2_1er) / 3).toFixed(2);
        }
        break;
      case '2nd_cycle':
        const ie1_2nd = parseFloat(studentNotes['ie1'] || '0');
        const ie2_2nd = parseFloat(studentNotes['ie2'] || '0');
        const ds1_2nd = parseFloat(studentNotes['ds1'] || '0');
        const ds2_2nd = parseFloat(studentNotes['ds2'] || '0');
        const coef = getCoefficient(selectedSubject);
        if (ie1_2nd && ie2_2nd && ds1_2nd && ds2_2nd) {
          const moyenneIE = (ie1_2nd + ie2_2nd) / 2;
          const moyenneBase = (moyenneIE + ds1_2nd + ds2_2nd) / 3;
          return (moyenneBase * coef).toFixed(2);
        }
        break;
      default:
        return '-';
    }
    return '-';
  };

  // Fonction pour calculer la moyenne IE
  const calculateMoyenneIE = (studentId: number) => {
    const studentNotes = notes[studentId] || {};
    const ie1 = parseFloat(studentNotes['ie1'] || '0');
    const ie2 = parseFloat(studentNotes['ie2'] || '0');
    
    if (ie1 && ie2) {
      return ((ie1 + ie2) / 2).toFixed(2);
    }
    return '-';
  };

  const handleModeChange = (newMode: 'add' | 'edit') => {
    setMode(newMode);
    setEditingStudentId(null);
    // Réinitialiser les notes en cours de saisie
    setNotes({});
  };

  const handleEditStudent = (studentId: number) => {
    setMode('edit');
    setEditingStudentId(studentId);
    // Charger les notes existantes de l'élève pour modification
    // Simulation de chargement des notes existantes
    setNotes({
      [studentId]: {
        'ie1': '15.5',
        'ie2': '16.0',
        'ds1': '14.5',
        'ds2': '15.0'
      }
    });
  };

  const handleSaveNotes = async () => {
    setIsLoading(true);
    
    try {
      // Préparer les données pour l'API
      const notesData = Object.entries(notes).map(([studentId, studentNotes]) => ({
        eleve_id: parseInt(studentId),
        ...studentNotes
      }));
      
      await apiService.saisirNotes({
        evaluation_id: 1, // À adapter selon l'évaluation sélectionnée
        notes: notesData
      });
      
      // Marquer les notes comme existantes après sauvegarde
      if (mode === 'add') {
        const newExistingNotes = { ...existingNotes };
        Object.keys(notes).forEach(studentId => {
          newExistingNotes[parseInt(studentId)] = true;
        });
        setExistingNotes(newExistingNotes);
      }
      
      setMode('view');
      setEditingStudentId(null);
      alert(`Notes ${mode === 'add' ? 'ajoutées' : 'modifiées'} avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des notes');
    }
    
    setIsLoading(false);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    // Simulation d'une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Toutes les notes ont été sauvegardées avec succès !');
  };

  const handleExport = () => {
    const columns = getEvaluationColumns();
    const csvContent = "data:text/csv;charset=utf-8," 
      + `N° Educmaster,Nom,Prenom,Sexe,${columns.map(c => c.label).join(',')},Rang,Appreciation\n`
      + students.map(student => {
          const studentNotes = notes[student.id] || {};
          const moyenne = calculateMoyenne(student.id, columns);
          const appreciation = moyenne !== '-' ? getAppreciation(parseFloat(moyenne)) : null;
          const rang = formatRang(student.rang, student.sexe, student.moyenne, students);
          const noteValues = columns.map(col => 
            col.type === 'calculated' ? moyenne : (studentNotes[col.key] || '')
          ).join(',');
          return `${student.numeroEducmaster},${student.nom},${student.prenom},${student.sexe},${noteValues},${rang},${appreciation?.text || ''}`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notes_${selectedClass}_${selectedSubject}_${selectedEvaluation}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleNoteChange = (studentId: number, column: string, value: string) => {
    if (selectedLevel === 'maternelle') {
      // Pour la maternelle, validation des options TS/S/PS
      if (value === '' || ['TS', 'S', 'PS'].includes(value)) {
        setNotes(prev => ({ 
          ...prev, 
          [studentId]: { ...prev[studentId], [column]: value }
        }));
        setValidatedNotes(prev => ({ ...prev, [studentId]: false }));
      }
    } else {
      // Pour les autres niveaux, validation numérique (0-20)
      const numNote = parseFloat(value);
      if (value === '' || (!isNaN(numNote) && numNote >= 0 && numNote <= 20)) {
        setNotes(prev => ({ 
          ...prev, 
          [studentId]: { ...prev[studentId], [column]: value }
        }));
        setValidatedNotes(prev => ({ ...prev, [studentId]: false }));
      }
    }
  };

  const validateNote = (studentId: number) => {
    const studentNotes = notes[studentId] || {};
    const columns = getEvaluationColumns();
    
    // Vérifier que toutes les notes requises sont saisies
    const requiredColumns = columns.filter(col => col.type !== 'calculated');
    const allNotesEntered = requiredColumns.every(col => studentNotes[col.key]);
    
    if (allNotesEntered) {
      setValidatedNotes(prev => ({ ...prev, [studentId]: false }));
    }
  };


  const getAppreciation = (note: number) => {
    if (note >= 18) return { text: 'Excellent', color: 'text-green-700', emoji: '🌟' };
    if (note >= 16) return { text: 'Très Bien', color: 'text-blue-700', emoji: '😊' };
    if (note >= 14) return { text: 'Bien', color: 'text-blue-600', emoji: '👍' };
    if (note >= 12) return { text: 'Assez Bien', color: 'text-yellow-600', emoji: '😐' };
    if (note >= 10) return { text: 'Passable', color: 'text-orange-600', emoji: '⚠️' };
    if (note >= 8) return { text: 'Insuffisant', color: 'text-red-600', emoji: '❌' };
    return { text: 'Très Insuffisant', color: 'text-red-700', emoji: '🚫' };
  };

  const getCurrentEvaluationTypes = () => {
    return evaluationTypes[selectedLevel as keyof typeof evaluationTypes] || evaluationTypes.primaire;
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
            <BookOpen className="h-7 w-7 mr-3 text-blue-600" />
            Saisie des Notes d'Évaluation
          </h2>
          <div className="flex space-x-3">
            {mode === 'view' && (
              <>
                <button 
                  onClick={() => handleModeChange('add')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ajouter
                </button>
                <button 
                  onClick={() => handleModeChange('edit')}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              </>
            )}
            {(mode === 'add' || mode === 'edit') && (
              <>
                <button 
                  onClick={handleSaveNotes}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button 
                  onClick={() => setMode('view')}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </>
            )}
            <button 
              onClick={handleImport}
              disabled={mode !== 'view'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </button>
            <button 
              onClick={handleExport}
              disabled={mode !== 'view'}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
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
                setSelectedEvaluation(getCurrentEvaluationTypes()[0]);
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

      {/* Info système éducatif */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm text-blue-800">
            <strong>Mode: {mode === 'view' ? 'Consultation' : mode === 'add' ? 'Ajout de notes' : 'Modification de notes'}</strong>
          </span>
        </div>
        <div className="flex items-center mt-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm text-blue-800">
            <strong>Système {selectedLevel === 'maternelle' ? 'Maternelle' : 
                            selectedLevel === 'primaire' ? 'Primaire' : 
                            selectedLevel === '1er_cycle' ? '1er Cycle Secondaire' : 
                            '2nd Cycle Secondaire'}:</strong> 
            {selectedLevel === 'maternelle' 
              ? ' Évaluation qualitative par observation continue - Échelle TS/S/PS'
              : selectedLevel === 'primaire' 
              ? ' EM1, EM2 (Évaluations Mensuelles), EC (Évaluation Certificative) - Sans coefficient'
              : selectedLevel === '1er_cycle'
              ? ' IE1, IE2 (Interrogations Écrites), DS1, DS2 (Devoirs Surveillés) - Sans coefficient'
              : ' IE1, IE2 (Interrogations Écrites), DS1, DS2 (Devoirs Surveillés) - Avec coefficient par série'
            }
          </span>
        </div>
      </div>

      {/* Tableau de saisie */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Liste des Élèves - {selectedClass} - {selectedSubject} - {selectedTrimester}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">N° Educmaster</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom & Prénoms</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Sexe</th>
                {getEvaluationColumns().map(col => (
                  <th key={col.key} className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {col.label}
                    {col.key === 'coef' && selectedLevel === '2nd_cycle' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedSubject}: {getCoefficient(selectedSubject)}
                      </div>
                    )}
                  </th>
                ))}
                <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Rang</th>
                {mode === 'view' && <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Statut</th>}
                {mode !== 'view' && <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const studentNotes = notes[student.id] || {};
                const columns = getEvaluationColumns();
                const moyenne = calculateMoyenne(student.id, columns);
                const moyenneIE = calculateMoyenneIE(student.id);
                const appreciation = moyenne !== '-' ? getAppreciation(parseFloat(moyenne)) : null;
                const isValidated = validatedNotes[student.id];
                const rang = formatRang(student.rang, student.sexe, student.moyenne, students);
                const hasExistingNotes = existingNotes[student.id];
                const isRowDisabled = (mode === 'add' && hasExistingNotes) || (mode === 'edit' && editingStudentId !== null && editingStudentId !== student.id);
                const canEdit = mode === 'edit' && hasExistingNotes;

                return (
                  <tr key={student.id} className={`transition-colors ${
                    isRowDisabled ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'
                  } ${editingStudentId === student.id ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {student.numeroEducmaster}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.nom} {student.prenom}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        student.sexe === 'F' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.sexe}
                      </span>
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-4 text-center">
                        {col.type === 'calculated' ? (
                          col.key === 'moy_ie' ? (
                            <span className={`px-2 py-1 rounded font-semibold ${
                              moyenneIE !== '-' ? 'text-blue-700 bg-blue-50' : 'text-gray-500'
                            }`}>
                              {moyenneIE}
                            </span>
                          ) : (
                            <span className={`px-2 py-1 rounded font-semibold ${
                              moyenne !== '-' ? getAppreciation(parseFloat(moyenne)).color + ' bg-opacity-10' : 'text-gray-500'
                            }`}>
                              {moyenne}
                            </span>
                          )
                        ) : col.type === 'coefficient' ? (
                          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">
                            {getCoefficient(selectedSubject)}
                          </span>
                        ) : col.type === 'select' ? (
                          <select
                            value={studentNotes[col.key] || ''}
                            onChange={(e) => handleNoteChange(student.id, col.key, e.target.value)}
                            className="w-16 p-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isValidated || mode === 'view' || isRowDisabled}
                          >
                            <option value="">-</option>
                            {col.options?.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : col.type === 'radio' ? (
                          <div className="flex justify-center space-x-2">
                            {col.options?.map(option => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`${student.id}_${col.key}`}
                                  value={option}
                                  checked={studentNotes[col.key] === option}
                                  onChange={(e) => handleNoteChange(student.id, col.key, e.target.value)}
                                  disabled={isValidated || mode === 'view' || isRowDisabled}
                                  className="mr-1"
                                />
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                  option === 'TS' ? 'bg-green-100 text-green-800' :
                                  option === 'S' ? 'bg-blue-100 text-blue-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max={col.max}
                            step="0.25"
                            value={studentNotes[col.key] || ''}
                            onChange={(e) => handleNoteChange(student.id, col.key, e.target.value)}
                            className="w-20 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            disabled={isValidated || mode === 'view' || isRowDisabled}
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        student.rang === 1 ? 'bg-yellow-100 text-yellow-800' :
                        student.rang === 2 ? 'bg-gray-100 text-gray-800' :
                        student.rang === 3 ? 'bg-orange-100 text-orange-800' :
                        student.rang <= 10 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rang}
                      </div>
                    </td>
                    {mode === 'view' && (
                      <td className="px-6 py-4 text-center">
                        {hasExistingNotes ? (
                          <div className="flex items-center justify-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Saisie</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Pas de notes
                          </span>
                        )}
                      </td>
                    )}
                    {mode !== 'view' && (
                      <td className="px-6 py-4 text-center">
                        {mode === 'edit' && canEdit && (
                          <button
                            onClick={() => handleEditStudent(student.id)}
                            disabled={editingStudentId !== null && editingStudentId !== student.id}
                            className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            {editingStudentId === student.id ? 'En cours...' : 'Modifier'}
                          </button>
                        )}
                        {mode === 'add' && !hasExistingNotes && (
                          <span className="text-sm text-green-600 font-medium">
                            Disponible
                          </span>
                        )}
                        {mode === 'edit' && !canEdit && (
                          <span className="text-sm text-gray-500">
                            Pas de notes
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistiques rapides */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(existingNotes).filter(id => existingNotes[parseInt(id)]).length}
              </div>
              <div className="text-sm text-gray-600">Élèves avec notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {students.length - Object.keys(existingNotes).filter(id => existingNotes[parseInt(id)]).length}
              </div>
              <div className="text-sm text-gray-600">Élèves sans notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(students.reduce((sum, student) => sum + student.moyenne, 0) / students.length).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Moyenne classe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {students.filter(s => s.moyenne >= 10).length}
              </div>
              <div className="text-sm text-gray-600">Élèves ≥ 10</div>
            </div>
          </div>
          
          {mode !== 'view' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Mode {mode === 'add' ? 'Ajout' : 'Modification'} :</strong>
                {mode === 'add' && ' Saisissez les notes pour les élèves qui n\'en ont pas encore.'}
                {mode === 'edit' && ' Cliquez sur "Modifier" pour un élève ayant déjà des notes.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'import */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Importer des Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Format attendu: N° Educmaster, Notes par colonne</p>
                <p>Exemple: EDU2024001, 15.5, 16.0, 14.5</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  alert('Import réussi !');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}