import React, { useState } from 'react';
import FormModal from './FormModal';
import { FileText, Save, Eye } from 'lucide-react';

interface DocumentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => void;
  templateData?: any;
  isEdit?: boolean;
  documentTypes?: any[];
}

const DocumentTemplateModal: React.FC<DocumentTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  templateData,
  isEdit = false,
  documentTypes = []
}) => {
  const defaultDocumentTypes = [
    { id: 'invoice', name: 'Facture', category: 'boutique' },
    { id: 'receipt', name: 'Reçu', category: 'boutique' },
    { id: 'delivery_note', name: 'Bon de livraison', category: 'boutique' },
    { id: 'report_card', name: 'Bulletin de notes', category: 'academique' },
    { id: 'certificate', name: 'Certificat', category: 'academique' },
    { id: 'diploma', name: 'Diplôme', category: 'academique' },
    { id: 'letter', name: 'Courrier', category: 'administratif' },
    { id: 'convocation', name: 'Convocation', category: 'administratif' },
    { id: 'payment_reminder', name: 'Rappel de paiement', category: 'financier' },
    { id: 'statistics', name: 'Statistiques', category: 'rapports' }
  ];

  const allDocumentTypes = documentTypes.length > 0 ? documentTypes : defaultDocumentTypes;

  const [formData, setFormData] = useState({
    name: templateData?.name || '',
    description: templateData?.description || '',
    documentType: templateData?.documentType || '',
    content: templateData?.content || '',
    variables: templateData?.variables || [
      { name: 'nom_ecole', description: 'Nom de l\'école', type: 'text', source: 'school' },
      { name: 'adresse_ecole', description: 'Adresse de l\'école', type: 'text', source: 'school' },
      { name: 'telephone_ecole', description: 'Téléphone de l\'école', type: 'text', source: 'school' },
      { name: 'logo_ecole', description: 'Logo de l\'école', type: 'image', source: 'school' },
      { name: 'numero_document', description: 'Numéro du document', type: 'text', source: 'document' },
      { name: 'date_document', description: 'Date du document', type: 'date', source: 'document' },
      { name: 'titre_document', description: 'Titre du document', type: 'text', source: 'document' },
      { name: 'signature', description: 'Signature', type: 'image', source: 'user' },
      { name: 'mentions_legales', description: 'Mentions légales', type: 'text', source: 'school' },
      { name: 'page_number', description: 'Numéro de page', type: 'number', source: 'system' },
      { name: 'total_pages', description: 'Nombre total de pages', type: 'number', source: 'system' }
    ],
    isDefault: templateData?.isDefault || false,
    isActive: templateData?.isActive !== undefined ? templateData.isActive : true
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [newVariable, setNewVariable] = useState({ name: '', description: '', type: 'text', source: 'document' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddVariable = () => {
    if (newVariable.name && newVariable.description) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }));
      setNewVariable({ name: '', description: '', type: 'text', source: 'document' });
    }
  };

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_: any, i: number) => i !== index)
    }));
  };

  const insertVariable = (variable: string) => {
    const placeholder = `{${variable}}`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + ' ' + placeholder
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier un template de document" : "Créer un template de document"}
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="document-template-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="document-template-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations du template
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom du template*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Facture standard"
              />
            </div>
            
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de document*
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un type</option>
                {allDocumentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name} ({type.category})</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description du template..."
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Définir comme template par défaut
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Template actif
                </span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Éditeur de template - Version simple sans codes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Contenu du document
            </h4>
            
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              {previewMode ? "Éditer" : "Prévisualiser"}
            </button>
          </div>
          
          {previewMode ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-64 bg-gray-50 dark:bg-gray-900">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {formData.content || (
                  <div className="text-gray-400 dark:text-gray-500 text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun contenu. Commencez à écrire votre document...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenu du document
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Commencez à écrire le contenu de votre document..."
                />
              </div>
              
              {/* Variables disponibles - simple et accessible */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informations à insérer</h5>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Cliquez sur une information pour l'insérer dans votre document
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable: any, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertVariable(variable.name)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title={variable.description}
                    >
                      {variable.description}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Gestion des variables personnalisées */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Variables personnalisées
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nom de la variable"
                value={newVariable.name}
                onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Description"
                value={newVariable.description}
                onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={newVariable.type}
                onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="image">Image</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleAddVariable}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Ajouter la variable
            </button>
            
            {formData.variables.length > 11 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Variables personnalisées</h5>
                {formData.variables.slice(11).map((variable: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{variable.description}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(index + 11)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default DocumentTemplateModal;
