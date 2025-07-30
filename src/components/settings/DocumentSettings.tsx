import React, { useState } from 'react';
import DocumentHeaderFooterConfig from './DocumentHeaderFooterConfig';
import DocumentTemplates from './DocumentTemplates';
import DocumentWatermarkConfig from './DocumentWatermarkConfig';

const DocumentSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'header-footer' | 'templates' | 'watermark'>('header-footer');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveSection('header-footer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'header-footer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              En-têtes & Pieds de page
            </button>
            <button
              onClick={() => setActiveSection('watermark')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'watermark'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Filigranes du document
            </button>
            <button
              onClick={() => setActiveSection('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Modèles de documents
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeSection === 'header-footer' && <DocumentHeaderFooterConfig />}
          {activeSection === 'watermark' && <DocumentWatermarkConfig />}
          {activeSection === 'templates' && <DocumentTemplates />}
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
