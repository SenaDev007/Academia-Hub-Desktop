import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, UserX, Calendar, Clock, MessageSquare } from 'lucide-react';

interface AbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (absenceData: any) => void;
  absenceData?: any;
  isEdit?: boolean;
  students?: any[];
}

const AbsenceModal: React.FC<AbsenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  absenceData,
  isEdit = false,
  students = []
}) => {
  const defaultStudents = [
    { id: 'STD-001', name: 'Marie Dubois', class: '3ème A' },
    { id: 'STD-002', name: 'Pierre Martin', class: '2nde B' },
    { id: 'STD-003', name: 'Sophie Lambert', class: '1ère C' }
  ];

  const allStudents = students.length > 0 ? students : defaultStudents;

  const [formData, setFormData] = useState({
    studentId: absenceData?.studentId || '',
    studentName: absenceData?.studentName || '',
    studentClass: absenceData?.studentClass || '',
    date: absenceData?.date || new Date().toISOString().split('T')[0],
    period: absenceData?.period || 'morning',
    reason: absenceData?.reason || '',
    isJustified: absenceData?.isJustified || false,
    justification: absenceData?.justification || '',
    notifyParent: absenceData?.notifyParent !== undefined ? absenceData.notifyParent : true,
    comments: absenceData?.comments || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = allStudents.find(s => s.id === studentId);
    
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId,
        studentName: student.name,
        studentClass: student.class
      }));
    }
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
      title={isEdit ? "Modifier une absence" : "Saisir une nouvelle absence"}
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
            form="absence-form"
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="absence-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de l'élève */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <UserX className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Élève absent
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Élève*
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un élève</option>
                {allStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name} ({student.class})</option>
                ))}
              </select>
            </div>
            
            {formData.studentId && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Élève:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Classe:</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.studentClass}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Détails de l'absence */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Détails de l'absence
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date*
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période*
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="morning">Matin</option>
                <option value="afternoon">Après-midi</option>
                <option value="full_day">Journée complète</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motif de l'absence*
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner un motif</option>
                <option value="Maladie">Maladie</option>
                <option value="Rendez-vous médical">Rendez-vous médical</option>
                <option value="Raison familiale">Raison familiale</option>
                <option value="Transport">Problème de transport</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Justification */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            Justification et notifications
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isJustified"
                name="isJustified"
                checked={formData.isJustified}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isJustified" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Absence justifiée
              </label>
            </div>
            
            {formData.isJustified && (
              <div>
                <label htmlFor="justification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Détails de la justification
                </label>
                <textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Précisez la justification..."
                />
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyParent"
                name="notifyParent"
                checked={formData.notifyParent}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="notifyParent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Notifier le parent/tuteur
              </label>
            </div>
            
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commentaires
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Commentaires supplémentaires..."
              />
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default AbsenceModal;