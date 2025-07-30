import React, { useState } from 'react';
import { Download, FileText, Calendar, User, School, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { CahierJournalEntry } from '../types';

interface ExportPDFProps {
  entries: CahierJournalEntry[];
  selectedEntries?: string[];
  onExport: (config: ExportConfig) => void;
  onClose: () => void;
}

interface ExportConfig {
  format: 'individual' | 'weekly' | 'monthly' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  includeDetails: {
    objectifs: boolean;
    competences: boolean;
    deroulement: boolean;
    supports: boolean;
    evaluation: boolean;
    observations: boolean;
  };
  template: 'standard' | 'inspection' | 'minimal' | 'detailed';
  orientation: 'portrait' | 'landscape';
  includeSignature: boolean;
  includeHeader: boolean;
  customHeader?: string;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ entries, selectedEntries, onExport, onClose }) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'individual',
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    includeDetails: {
      objectifs: true,
      competences: true,
      deroulement: true,
      supports: true,
      evaluation: true,
      observations: false
    },
    template: 'standard',
    orientation: 'portrait',
    includeSignature: true,
    includeHeader: true
  });

  const [activeTab, setActiveTab] = useState<'format' | 'content' | 'style'>('format');

  const templates = [
    {
      id: 'standard',
      nom: 'Standard',
      description: 'Format standard pour usage quotidien',
      preview: 'Mise en page équilibrée avec toutes les sections'
    },
    {
      id: 'inspection',
      nom: 'Inspection',
      description: 'Format officiel pour les inspections pédagogiques',
      preview: 'Conforme aux exigences du MEMP'
    },
    {
      id: 'minimal',
      nom: 'Minimal',
      description: 'Format condensé avec informations essentielles',
      preview: 'Objectifs, déroulement et évaluation uniquement'
    },
    {
      id: 'detailed',
      nom: 'Détaillé',
      description: 'Format complet avec toutes les informations',
      preview: 'Toutes les sections avec commentaires et observations'
    }
  ];

  const getFilteredEntries = () => {
    let filtered = entries;

    if (selectedEntries && selectedEntries.length > 0) {
      filtered = entries.filter(entry => selectedEntries.includes(entry.id));
    }

    if (config.format !== 'custom') {
      const start = new Date(config.dateRange.start);
      const end = new Date(config.dateRange.end);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }

    return filtered;
  };

  const handleExport = () => {
    alert('🔄 Génération du PDF en cours...');
    
    // Simuler la génération PDF
    setTimeout(() => {
      const fileName = `cahier_journal_${config.format}_${new Date().toISOString().split('T')[0]}.pdf`;
      alert(`✅ PDF généré avec succès !\nFichier: ${fileName}\nNombre de séances: ${filteredEntries.length}`);
      onClose();
    }, 2000);
    
    onExport(config);
  };

  const updateConfig = (updates: Partial<ExportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateIncludeDetails = (key: keyof ExportConfig['includeDetails'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      includeDetails: {
        ...prev.includeDetails,
        [key]: value
      }
    }));
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="text-blue-600" />
                Exporter en PDF
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredEntries.length} séance(s) sélectionnée(s) pour l'export
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar avec onglets */}
          <div className="w-64 border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('format')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'format' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar size={16} className="inline mr-2" />
                  Format et période
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'content' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText size={16} className="inline mr-2" />
                  Contenu
                </button>
                <button
                  onClick={() => setActiveTab('style')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'style' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={16} className="inline mr-2" />
                  Style et mise en page
                </button>
              </nav>
            </div>

            {/* Aperçu des séances */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Séances à exporter</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="text-sm p-2 bg-white rounded border">
                    <div className="font-medium text-gray-900">{entry.matiere}</div>
                    <div className="text-gray-600">{entry.classe} - {new Date(entry.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                ))}
                {filteredEntries.length > 5 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{filteredEntries.length - 5} autres séances
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'format' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Format d'export</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="format"
                        value="individual"
                        checked={config.format === 'individual'}
                        onChange={(e) => updateConfig({ format: e.target.value as any })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Séances individuelles</div>
                        <div className="text-sm text-gray-600">Une page par séance</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="format"
                        value="weekly"
                        checked={config.format === 'weekly'}
                        onChange={(e) => updateConfig({ format: e.target.value as any })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Vue hebdomadaire</div>
                        <div className="text-sm text-gray-600">Regroupement par semaine</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="format"
                        value="monthly"
                        checked={config.format === 'monthly'}
                        onChange={(e) => updateConfig({ format: e.target.value as any })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Vue mensuelle</div>
                        <div className="text-sm text-gray-600">Calendrier mensuel</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="format"
                        value="custom"
                        checked={config.format === 'custom'}
                        onChange={(e) => updateConfig({ format: e.target.value as any })}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Personnalisé</div>
                        <div className="text-sm text-gray-600">Sélection manuelle</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Période</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                      <input
                        type="date"
                        value={config.dateRange.start}
                        onChange={(e) => updateConfig({
                          dateRange: { ...config.dateRange, start: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                      <input
                        type="date"
                        value={config.dateRange.end}
                        onChange={(e) => updateConfig({
                          dateRange: { ...config.dateRange, end: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections à inclure</h3>
                  <div className="space-y-3">
                    {Object.entries(config.includeDetails).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateIncludeDetails(key as any, e.target.checked)}
                          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 capitalize">
                          {key === 'objectifs' ? 'Objectifs pédagogiques' :
                           key === 'competences' ? 'Compétences visées' :
                           key === 'deroulement' ? 'Déroulement de la séance' :
                           key === 'supports' ? 'Supports et matériels' :
                           key === 'evaluation' ? 'Modalités d\'évaluation' :
                           'Observations et adaptations'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Options supplémentaires</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.includeHeader}
                        onChange={(e) => updateConfig({ includeHeader: e.target.checked })}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Inclure l'en-tête de l'établissement</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.includeSignature}
                        onChange={(e) => updateConfig({ includeSignature: e.target.checked })}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Espace pour signature</span>
                    </label>
                  </div>

                  {config.includeHeader && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        En-tête personnalisé (optionnel)
                      </label>
                      <textarea
                        value={config.customHeader || ''}
                        onChange={(e) => updateConfig({ customHeader: e.target.value })}
                        placeholder="École Primaire Publique de..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Modèle de document</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {templates.map((template) => (
                      <label
                        key={template.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                          config.template === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={template.id}
                          checked={config.template === template.id}
                          onChange={(e) => updateConfig({ template: e.target.value as any })}
                          className="mr-3 mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{template.nom}</div>
                          <div className="text-sm text-gray-600 mb-1">{template.description}</div>
                          <div className="text-xs text-gray-500">{template.preview}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Orientation</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="orientation"
                        value="portrait"
                        checked={config.orientation === 'portrait'}
                        onChange={(e) => updateConfig({ orientation: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Portrait</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="orientation"
                        value="landscape"
                        checked={config.orientation === 'landscape'}
                        onChange={(e) => updateConfig({ orientation: e.target.value as any })}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Paysage</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-500" />
              Configuration prête pour l'export
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                disabled={filteredEntries.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPDF;