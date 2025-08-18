import React, { useState } from 'react';
import { Save } from 'lucide-react';
import WatermarkConfig from './WatermarkConfig';

interface DocumentWatermarkConfig {
  id: string;
  name: string;
  type: 'bulletin' | 'certificat' | 'facture' | 'reçu' | 'attestation' | 'convocation';
  watermark: {
    enabled: boolean;
    type: 'text' | 'image';
    content: string;
    opacity: number;
    position: 'center' | 'diagonal' | 'horizontal' | 'vertical';
    size: 'small' | 'medium' | 'large';
    color: string;
  };
}

const DocumentWatermarkConfig = () => {
  const [watermarks, setWatermarks] = useState<DocumentWatermarkConfig[]>([
    {
      id: '1',
      name: 'Configuration par défaut',
      type: 'bulletin',
      watermark: {
        enabled: false,
        type: 'text',
        content: 'CONFIDENTIEL',
        opacity: 0.2,
        position: 'diagonal',
        size: 'medium',
        color: '#000000'
      }
    }
  ]);

  const [selectedWatermark, setSelectedWatermark] = useState<DocumentWatermarkConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);


  const documentTypes = [
    { value: 'bulletin', label: 'Bulletin' },
    { value: 'certificat', label: 'Certificat' },
    { value: 'facture', label: 'Facture' },
    { value: 'reçu', label: 'Reçu' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'convocation', label: 'Convocation' }
  ];

  const handleSave = (config: DocumentWatermarkConfig) => {
    if (selectedWatermark) {
      setWatermarks(watermarks.map(w => w.id === config.id ? config : w));
    } else {
      const newConfig = {
        ...config,
        id: Date.now().toString()
      };
      setWatermarks([...watermarks, newConfig]);
    }
    setIsEditing(false);
    setSelectedWatermark(null);
  };

  const handleEdit = (config: DocumentWatermarkConfig) => {
    setSelectedWatermark(config);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedWatermark(null);
  };

  const handleDelete = (id: string) => {
    setWatermarks(watermarks.filter(w => w.id !== id));
  };

  const WatermarkForm = ({ 
    config, 
    onSave, 
    onCancel 
  }: { 
    config: DocumentWatermarkConfig | null, 
    onSave: (config: DocumentWatermarkConfig) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<DocumentWatermarkConfig>(config || {
      id: '',
      name: '',
      type: 'bulletin',
      watermark: {
        enabled: false,
        type: 'text',
        content: 'CONFIDENTIEL',
        opacity: 0.2,
        position: 'diagonal',
        size: 'medium',
        color: '#000000'
      }
    });

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {config ? 'Modifier la configuration' : 'Nouvelle configuration'}
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="configName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la configuration
              </label>
              <input
                id="configName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Configuration Bulletin"
                required
              />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de document
              </label>
              <select
                id="documentType"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentWatermarkConfig['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Configuration du filigrane</h3>
              <WatermarkConfig
                config={formData.watermark}
                onChange={(watermark) => setFormData({ ...formData, watermark })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuration des filigranes</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez les filigranes pour le corps des documents
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedWatermark(null);
                setIsEditing(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Nouvelle configuration
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {watermarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune configuration</h3>
              <p className="text-gray-500 mb-4">
                Commencez par créer une nouvelle configuration de filigrane
              </p>
              <button
                onClick={() => {
                  setSelectedWatermark(null);
                  setIsEditing(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Créer une configuration
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {watermarks.map((config) => (
                <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-500">{documentTypes.find(t => t.value === config.type)?.label}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      config.watermark.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {config.watermark.enabled ? 'Activé' : 'Désactivé'}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Type: {config.watermark.type === 'text' ? 'Texte' : 'Image'}</div>
                    <div>Position: {config.watermark.position}</div>
                    <div>Opacité: {config.watermark.opacity * 100}%</div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(config)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <WatermarkForm
          config={selectedWatermark}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default DocumentWatermarkConfig;
