import React, { useState } from 'react';
import { Image, Type, Eye, EyeOff } from 'lucide-react';

interface WatermarkConfig {
  enabled: boolean;
  type: 'text' | 'image';
  content: string;
  opacity: number;
  position: 'center' | 'diagonal' | 'horizontal' | 'vertical';
  size: 'small' | 'medium' | 'large';
  color: string;
}

interface WatermarkConfigProps {
  config: WatermarkConfig;
  onChange: (config: WatermarkConfig) => void;
}

const WatermarkConfig: React.FC<WatermarkConfigProps> = ({ config, onChange }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleToggle = () => {
    onChange({ ...config, enabled: !config.enabled });
  };

  const handleTypeChange = (type: 'text' | 'image') => {
    onChange({ ...config, type });
  };

  const handleContentChange = (content: string) => {
    onChange({ ...config, content });
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({ ...config, opacity });
  };

  const handlePositionChange = (position: 'center' | 'diagonal' | 'horizontal' | 'vertical') => {
    onChange({ ...config, position });
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    onChange({ ...config, size });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...config, color });
  };

  return (
    <div className="space-y-6">
      {/* Toggle principal */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Filigrane</h3>
          <p className="text-sm text-gray-500">Ajouter un filigrane au document</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-4 border border-gray-200 rounded-lg p-4">
          {/* Type de filigrane */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de filigrane</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="watermarkType"
                  value="text"
                  checked={config.type === 'text'}
                  onChange={() => handleTypeChange('text')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <Type className="w-4 h-4 mr-1" />
                  Texte
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="watermarkType"
                  value="image"
                  checked={config.type === 'image'}
                  onChange={() => handleTypeChange('image')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <Image className="w-4 h-4 mr-1" />
                  Image
                </span>
              </label>
            </div>
          </div>

          {/* Contenu selon le type */}
          {config.type === 'text' ? (
            <div>
              <label htmlFor="watermarkText" className="block text-sm font-medium text-gray-700 mb-1">
                Texte du filigrane
              </label>
              <input
                id="watermarkText"
                type="text"
                value={config.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Ex: CONFIDENTIEL, BROUILLON, COPIE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
                aria-label="Texte du filigrane"
                title="Entrez le texte à afficher comme filigrane"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="watermarkImage" className="block text-sm font-medium text-gray-700 mb-1">
                Image du filigrane
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="watermarkImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        handleContentChange(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  title="Sélectionner une image pour le filigrane"
                />
                {config.content && config.type === 'image' && (
                  <img 
                    src={config.content} 
                    alt="Aperçu filigrane" 
                    className="h-12 w-12 object-contain rounded border border-gray-300"
                  />
                )}
              </div>
            </div>
          )}

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <select
              id="position"
              value={config.position}
              onChange={(e) => handlePositionChange(e.target.value as 'center' | 'diagonal' | 'horizontal' | 'vertical')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Sélectionner la position du filigrane"
            >
              <option value="center">Centre</option>
              <option value="diagonal">Diagonale</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          {/* Taille */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
            <select
              id="size"
              value={config.size}
              onChange={(e) => handleSizeChange(e.target.value as 'small' | 'medium' | 'large')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Sélectionner la taille du filigrane"
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </div>

          {/* Opacité */}
          <div>
            <label htmlFor="opacity" className="block text-sm font-medium text-gray-700 mb-1">
              Opacité: {Math.round(config.opacity * 100)}%
            </label>
            <input
              id="opacity"
              type="range"
              min="0.1"
              max="0.5"
              step="0.1"
              value={config.opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Couleur (pour texte) */}
          {config.type === 'text' && (
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Couleur du texte
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="color"
                  type="color"
                  value={config.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-8 w-8 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-500">{config.color}</span>
              </div>
            </div>
          )}

          {/* Aperçu */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Aperçu</label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {previewMode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {previewMode ? 'Masquer' : 'Afficher'} l'aperçu
              </button>
            </div>
            
            {previewMode && (
              <div className="bg-gray-50 p-8 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {config.type === 'text' ? (
                    <div
                      className="text-gray-400 font-bold select-none"
                      style={{
                        fontSize: config.size === 'small' ? '24px' : config.size === 'medium' ? '36px' : '48px',
                        opacity: config.opacity,
                        color: config.color,
                        transform: config.position === 'diagonal' ? 'rotate(-45deg)' : 'none',
                        writingMode: config.position === 'vertical' ? 'vertical-rl' : 'horizontal-tb'
                      }}
                    >
                      {config.content || 'APERÇU'}
                    </div>
                  ) : config.content ? (
                    <img
                      src={config.content}
                      alt="Aperçu filigrane"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        opacity: config.opacity,
                        maxWidth: config.size === 'small' ? '100px' : config.size === 'medium' ? '150px' : '200px'
                      }}
                    />
                  ) : (
                    <div className="text-gray-400">Aucun filigrane configuré</div>
                  )}
                </div>
                <div className="relative z-10 bg-white p-4 rounded shadow-sm">
                  <p className="text-sm text-gray-600">Contenu du document avec filigrane</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatermarkConfig;
