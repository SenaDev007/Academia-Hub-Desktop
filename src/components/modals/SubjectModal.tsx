import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, BookOpen, GraduationCap, Hash } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectData: any) => void;
  subjectData?: any;
  isEdit?: boolean;
}

const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjectData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    name: subjectData?.name || '',
    code: subjectData?.code || '',
    level: subjectData?.level || '',
    coefficient: subjectData?.coefficient || null,
    description: subjectData?.description || '',
    isActive: subjectData?.isActive !== undefined ? subjectData.isActive : true
  });

  const educationLevels = [
    { id: 'maternelle', name: 'Maternelle', hasCoefficient: false },
    { id: 'primaire', name: 'Primaire', hasCoefficient: false },
    { id: 'secondaire_1er_cycle', name: 'Secondaire 1er cycle (6ème à 3ème)', hasCoefficient: false },
    { id: 'secondaire_2nd_cycle', name: 'Secondaire 2nd cycle (2nde à Terminale)', hasCoefficient: true }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'level') {
      const selectedLevel = educationLevels.find(level => level.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        coefficient: selectedLevel?.hasCoefficient ? (prev.coefficient || 1) : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || null : value
      }));
    }
  };

  // Générer un code basé sur le nom si le code est vide
  const generateCode = () => {
    if (!formData.code && formData.name) {
      const code = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 8);
      
      setFormData(prev => ({
        ...prev,
        code
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const selectedLevel = educationLevels.find(level => level.id === formData.level);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier une matière" : "Créer une nouvelle matière"}
      size="lg"
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
            form="subject-form"
            className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="subject-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Informations de la matière
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la matière*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={generateCode}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Mathématiques"
              />
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code*
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: MATH"
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau scolaire*
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un niveau</option>
                {educationLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            
            {selectedLevel?.hasCoefficient && (
              <div>
                <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Coefficient*
                </label>
                <input
                  type="number"
                  id="coefficient"
                  name="coefficient"
                  value={formData.coefficient || ''}
                  onChange={handleChange}
                  required={selectedLevel.hasCoefficient}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Description de la matière..."
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Matière active
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informations sur les coefficients */}
        {selectedLevel?.hasCoefficient && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-900/30">
            <h4 className="text-lg font-medium text-purple-900 dark:text-purple-300 mb-4 flex items-center">
              <Hash className="w-5 h-5 mr-2" />
              Informations sur les coefficients
            </h4>
            
            <div className="space-y-3">
              <p className="text-purple-800 dark:text-purple-300">
                Pour le niveau {selectedLevel.name}, les matières ont des coefficients qui influencent le calcul de la moyenne générale.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Coefficients courants :</h5>
                  <ul className="space-y-1 text-purple-800 dark:text-purple-400">
                    <li>• Mathématiques : 7</li>
                    <li>• Sciences Physiques : 6</li>
                    <li>• Français : 3</li>
                    <li>• Histoire-Géo : 2</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Calcul de la moyenne :</h5>
                  <p className="text-purple-800 dark:text-purple-400">
                    Moyenne = (Σ(Note × Coefficient)) / Σ(Coefficients)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Information sur les niveaux */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-3">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Niveaux scolaires</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {isEdit 
                ? "La modification de cette matière sera enregistrée dans l'historique des changements."
                : "Les matières sont organisées par niveau scolaire. Les coefficients ne s'appliquent qu'au secondaire (1er et 2nd cycles)."}
            </p>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default SubjectModal;