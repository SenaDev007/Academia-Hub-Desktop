import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  CheckCircle,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { DocumentTemplateModal, ConfirmModal, AlertModal } from '../modals';

const DocumentTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Données fictives pour les templates
  const templates: Template[] = [
    {
      id: 'TPL-001',
      name: 'Facture standard',
      description: 'Template de facture avec en-tête et pied de page personnalisés',
      type: 'invoice',
      category: 'boutique',
      lastModified: '2024-01-15',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-002',
      name: 'Bulletin de notes trimestriel',
      description: 'Format officiel pour les bulletins de notes',
      type: 'report_card',
      category: 'academique',
      lastModified: '2024-01-10',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-003',
      name: 'Certificat de scolarité',
      description: 'Attestation de présence dans l\'établissement',
      type: 'certificate',
      category: 'academique',
      lastModified: '2024-01-08',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-004',
      name: 'Convocation parents',
      description: 'Modèle de convocation pour les parents d\'élèves',
      type: 'convocation',
      category: 'administratif',
      lastModified: '2024-01-05',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    },
    {
      id: 'TPL-005',
      name: 'Rappel de paiement',
      description: 'Lettre de rappel pour les frais impayés',
      type: 'payment_reminder',
      category: 'financier',
      lastModified: '2024-01-03',
      isDefault: true,
      isActive: true,
      createdBy: 'Admin'
    }
  ];

  // Catégories de documents
  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'boutique', name: 'Boutique' },
    { id: 'academique', name: 'Académique' },
    { id: 'administratif', name: 'Administratif' },
    { id: 'financier', name: 'Financier' },
    { id: 'rapports', name: 'Rapports' }
  ];

  const types = [
    { id: 'all', name: 'Tous les types' },
    { id: 'invoice', name: 'Facture' },
    { id: 'report_card', name: 'Bulletin' },
    { id: 'certificate', name: 'Certificat' },
    { id: 'convocation', name: 'Convocation' },
    { id: 'payment_reminder', name: 'Rappel de paiement' }
  ];

  const statuses = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'active', name: 'Actifs' },
    { id: 'inactive', name: 'Inactifs' },
    { id: 'default', name: 'Par défaut' }
  ];

  // Filtrage des templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && template.isActive) ||
      (selectedStatus === 'inactive' && !template.isActive) ||
      (selectedStatus === 'default' && template.isDefault);
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Handlers pour les modals
  const handleNewTemplate = () => {
    setIsEditMode(false);
    setSelectedTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setIsEditMode(true);
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsConfirmModalOpen(true);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate = {
      ...template,
      id: `TPL-${Math.floor(Math.random() * 1000)}`,
      name: `${template.name} (copie)`,
      isDefault: false
    };
    
    // TODO: Ajouter le template dupliqué à la liste
    console.log('Template dupliqué:', duplicatedTemplate);
    
    setAlertMessage({
      title: 'Template dupliqué',
      message: `Le template "${template.name}" a été dupliqué avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setAlertMessage({
      title: 'Prévisualisation',
      message: `Prévisualisation du template "${template.name}" en cours...`,
      type: 'info'
    });
    setIsAlertModalOpen(true);
  };

  const handleExportTemplates = () => {
    const exportData = {
      templates: filteredTemplates,
      exportDate: new Date().toISOString(),
      totalCount: filteredTemplates.length
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setAlertMessage({
      title: 'Export réussi',
      message: `${filteredTemplates.length} template(s) exporté(s) avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleImportTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setAlertMessage({
            title: 'Import réussi',
            message: `${data.templates?.length || 0} template(s) importé(s) avec succès.`,
            type: 'success'
          });
          setIsAlertModalOpen(true);
        } catch {
          setAlertMessage({
            title: 'Erreur d\'import',
            message: 'Le fichier importé n\'est pas valide.',
            type: 'error'
          });
          setIsAlertModalOpen(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleToggleFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleSaveTemplate = (templateData: Partial<Template>) => {
    console.log('Saving template:', templateData);
    setAlertMessage({
      title: isEditMode ? 'Template mis à jour' : 'Template créé',
      message: isEditMode 
        ? `Le template "${templateData.name}" a été mis à jour avec succès.`
        : `Le template "${templateData.name}" a été créé avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const confirmDeleteTemplate = () => {
    console.log('Deleting template:', selectedTemplate);
    setIsConfirmModalOpen(false);
    setAlertMessage({
      title: 'Template supprimé',
      message: `Le template "${selectedTemplate?.name}" a été supprimé avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paramétrage des Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestion des templates pour tous les documents générés</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </button>
          <button 
            onClick={handleNewTemplate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Filtrer par catégorie"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleToggleFilters}
              className={`inline-flex items-center px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                showAdvancedFilters ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
            <button 
              onClick={handleExportTemplates}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <label className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Importer
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplates}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {showAdvancedFilters && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de document
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  title="Filtrer par type de document"
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  title="Filtrer par statut"
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredTemplates.length} template(s) trouvé(s)
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{template.name}</h4>
                    {template.isDefault && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        Par défaut
                      </span>
                    )}
                    {!template.isActive && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">ID: {template.id}</span>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Type: {template.type}</span>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Modifié le: {template.lastModified}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePreviewTemplate(template)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg"
                  title="Prévisualiser"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTemplate(template)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? "Aucun résultat ne correspond à votre recherche. Essayez de modifier vos critères."
              : "Vous n'avez pas encore créé de templates. Commencez par en créer un nouveau."}
          </p>
          <button 
            onClick={handleNewTemplate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un template
          </button>
        </div>
      )}

      {/* Information section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">Paramétrage des documents</h3>
            <p className="text-blue-800 dark:text-blue-400 mb-4">
              Les templates de documents permettent de personnaliser l'apparence de tous les documents générés par l'application.
              Vous pouvez créer des templates pour chaque type de document et les personnaliser selon vos besoins.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  Bonnes pratiques
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Utilisez des variables pour les données dynamiques</li>
                  <li>• Testez vos templates avant de les utiliser</li>
                  <li>• Créez des templates distincts pour chaque type de document</li>
                  <li>• Respectez la charte graphique de votre établissement</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Points d'attention
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Vérifiez la compatibilité avec l'impression</li>
                  <li>• Assurez-vous que toutes les variables sont définies</li>
                  <li>• Limitez la taille des images pour optimiser les performances</li>
                  <li>• Testez sur différents formats de papier si nécessaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DocumentTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        templateData={selectedTemplate}
        isEdit={isEditMode}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteTemplate}
        title="Supprimer ce template ?"
        message={`Êtes-vous sûr de vouloir supprimer le template "${selectedTemplate?.name}" ? Cette action est irréversible.`}
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
    </div>
  );
};

export default DocumentTemplates;