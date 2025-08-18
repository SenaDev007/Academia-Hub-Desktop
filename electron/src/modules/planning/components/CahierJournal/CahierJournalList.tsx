import React, { useState } from 'react';
import { Search, Filter, Edit, Eye, Trash2, ArrowLeft, Download, Send } from 'lucide-react';
import { CahierJournalEntry } from './types';
import { NotificationService } from "./services/NotificationService";
import CahierJournalView from './CahierJournalView';
import CahierJournalForm from './CahierJournalForm';

interface CahierJournalListProps {
  entries: CahierJournalEntry[];
  onUpdateEntry: (entry: CahierJournalEntry) => void;
  onBack: () => void;
}

const CahierJournalList: React.FC<CahierJournalListProps> = ({ entries, onUpdateEntry, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMatiere, setFilterMatiere] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<CahierJournalEntry | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.objectifs.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMatiere = !filterMatiere || entry.matiere === filterMatiere;
    const matchesStatut = !filterStatut || entry.statut === filterStatut;

    return matchesSearch && matchesMatiere && matchesStatut;
  });

  const matieres = [...new Set(entries.map(entry => entry.matiere))];

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'planifie': return 'Planifiée';
      case 'en_cours': return 'En cours';
      case 'realise': return 'Réalisée';
      case 'reporte': return 'Reportée';
      case 'valide': return 'Validée';
      default: return statut;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'planifie': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'realise': return 'bg-green-100 text-green-800';
      case 'reporte': return 'bg-orange-100 text-orange-800';
      case 'valide': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (entry: CahierJournalEntry) => {
    setSelectedEntry(entry);
    setViewMode('edit');
  };

  const handleView = (entry: CahierJournalEntry) => {
    setSelectedEntry(entry);
    setViewMode('view');
  };

  const handleUpdateEntry = (updatedEntry: Omit<CahierJournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      onUpdateEntry({
        ...selectedEntry,
        ...updatedEntry,
      });
      setViewMode('list');
      setSelectedEntry(null);
    }
  };

  const handleSendForValidation = (entry: CahierJournalEntry) => {
    // Mettre à jour le statut
    const updatedEntry = { ...entry, statut: 'en_attente_validation' as const };
    onUpdateEntry(updatedEntry);
    
    // Envoyer notification WhatsApp au directeur
    const notificationService = NotificationService.getInstance();
    const message = notificationService.generateWhatsAppMessage(
      'submit',
      entry,
      'Enseignant',
      'Séance soumise pour validation'
    );
    
    notificationService.sendWhatsAppNotification(
      '22997123456', // Numéro du directeur
      message,
      entry.id
    ).then(result => {
      if (result.success) {
        alert(`✅ Séance envoyée au Directeur pour validation.\nNotification WhatsApp envoyée avec succès.`);
      } else {
        alert(`⚠️ Séance envoyée mais erreur d'envoi WhatsApp: ${result.error}`);
      }
    });
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      // En production, appeler l'API de suppression
      alert('Séance supprimée avec succès');
    }
  };

  const handleExportPDF = (entry: CahierJournalEntry) => {
    // Simuler l'export PDF
    alert(`Export PDF de la séance "${entry.matiere} - ${entry.classe}" en cours...`);
    
    // En production, générer le PDF
    setTimeout(() => {
      alert('PDF généré avec succès !');
    }, 1500);
  };

  if (viewMode === 'view' && selectedEntry) {
    return (
      <CahierJournalView
        entry={selectedEntry}
        onEdit={() => setViewMode('edit')}
        onBack={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'edit' && selectedEntry) {
    return (
      <CahierJournalForm
        entry={selectedEntry}
        onSubmit={handleUpdateEntry}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Séances</h1>
              <p className="text-gray-600">{filteredEntries.length} séance(s) trouvée(s)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterMatiere}
            onChange={(e) => setFilterMatiere(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les matières</option>
            {matieres.map(matiere => (
              <option key={matiere} value={matiere}>{matiere}</option>
            ))}
          </select>

          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="planifie">Planifiée</option>
            <option value="en_cours">En cours</option>
            <option value="realise">Réalisée</option>
            <option value="reporte">Reportée</option>
            <option value="valide">Validée</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter size={16} />
            Plus de filtres
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Aucune séance trouvée</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entry.matiere} - {entry.classe}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(entry.statut)}`}>
                      {getStatutLabel(entry.statut)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Date:</span> {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <span className="font-medium">Durée:</span> {entry.duree} minutes
                    </div>
                    <div>
                      <span className="font-medium">Enseignant:</span> {entry.enseignant}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-2">{entry.objectifs}</p>

                  <div className="flex flex-wrap gap-2">
                    {entry.competences.map((competence, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {competence}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleView(entry)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  {entry.statut === 'planifie' && (
                    <button
                      onClick={() => handleSendForValidation(entry)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Envoyer pour validation"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleExportPDF(entry)}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Exporter PDF"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CahierJournalList;