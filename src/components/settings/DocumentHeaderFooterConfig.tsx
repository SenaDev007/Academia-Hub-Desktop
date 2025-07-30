import React, { useState } from 'react';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Eye, 
  Save, 
  Download,
  FileText,
  FileCheck,
  FileSignature,
  FileDigit,
  FileBarChart
} from 'lucide-react';
import WatermarkConfig from './WatermarkConfig';



interface HeaderConfig {
  id: string;
  name: string;
  type: 'bulletin' | 'certificat' | 'facture' | 'reçu' | 'attestation' | 'convocation';
  logoLeft?: string;
  logoRight?: string;
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolWebsite?: string;
  academicYear: string;
  slogan?: string;
  additionalText?: string;
  watermark?: WatermarkConfig;
}

interface FooterConfig {
  id: string;
  name: string;
  type: 'bulletin' | 'certificat' | 'facture' | 'reçu' | 'attestation' | 'convocation';
  directorSignature?: string;
  directorName: string;
  directorTitle: string;
  legalNotice?: string;
  contactInfo?: string;
  qrCode?: boolean;
  date?: boolean;
  pageNumber?: boolean;
  watermark?: WatermarkConfig;
}

const DocumentHeaderFooterConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'headers' | 'footers'>('headers');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingHeader, setEditingHeader] = useState<HeaderConfig | null>(null);
  const [editingFooter, setEditingFooter] = useState<FooterConfig | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [headers, setHeaders] = useState<HeaderConfig[]>([
    {
      id: '1',
      name: 'En-tête Bulletin',
      type: 'bulletin',
      logoLeft: '',
      logoRight: '',
      schoolName: 'École Primaire Exemple',
      schoolAddress: '123 Rue de l\'Éducation, Cotonou, Bénin',
      schoolPhone: '+229 21 23 45 67',
      schoolEmail: 'contact@ecole-exemple.bj',
      schoolWebsite: '',
      academicYear: '2023-2024',
      slogan: 'Excellence et Discipline',
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

  const [footers, setFooters] = useState<FooterConfig[]>([
    {
      id: '1',
      name: 'Pied de page Bulletin',
      type: 'bulletin',
      directorName: 'M. Jean Dupont',
      directorTitle: 'Directeur',
      legalNotice: 'Ce document est établi sous l\'autorité de l\'établissement',
      contactInfo: 'Pour toute question, contactez le secrétariat',
      qrCode: true,
      date: true,
      pageNumber: true,
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

  const documentTypes = [
    { 
      value: 'bulletin', 
      label: 'Bulletin de notes',
      icon: <FileBarChart className="w-4 h-4 inline mr-2" />
    },
    { 
      value: 'certificat', 
      label: 'Certificat de scolarité',
      icon: <FileCheck className="w-4 h-4 inline mr-2" />
    },
    { 
      value: 'facture', 
      label: 'Facture',
      icon: <FileSignature className="w-4 h-4 inline mr-2" />
    },
    { 
      value: 'reçu', 
      label: 'Reçu de paiement',
      icon: <FileDigit className="w-4 h-4 inline mr-2" />
    },
    { 
      value: 'attestation', 
      label: 'Attestation',
      icon: <FileText className="w-4 h-4 inline mr-2" />
    },
    { 
      value: 'convocation', 
      label: 'Convocation',
      icon: <Download className="w-4 h-4 inline mr-2" />
    }
  ];

  const handleSaveHeader = (header: HeaderConfig): void => {
    if (header.id) {
      setHeaders(headers.map(h => h.id === header.id ? header : h));
    } else {
      setHeaders([...headers, { ...header, id: Date.now().toString() }]);
    }
    setEditingHeader(null);
  };

  const handleSaveFooter = (footer: FooterConfig): void => {
    if (footer.id) {
      setFooters(footers.map(f => f.id === footer.id ? footer : f));
    } else {
      setFooters([...footers, { ...footer, id: Date.now().toString() }]);
    }
    setEditingFooter(null);
  };

  const HeaderForm = ({ header, onSave, onCancel }: { header: HeaderConfig | null, onSave: (h: HeaderConfig) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<HeaderConfig>(header || {
      id: '',
      name: '',
      type: 'bulletin',
      logoLeft: '',
      logoRight: '',
      schoolName: '',
      schoolAddress: '',
      schoolPhone: '',
      schoolEmail: '',
      academicYear: '',
      slogan: '',
      additionalText: '',
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Configuration de l'en-tête</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la configuration</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: En-tête Bulletin 2024"
                />
              </div>

              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
                <select
                  id="documentType"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bulletin' | 'certificat' | 'facture' | 'reçu' | 'attestation' | 'convocation' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  aria-label="Sélectionnez le type de document"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement</label>
                <input
                  id="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Nom de l'école"
                  placeholder="Entrez le nom de l'école"
                />
              </div>

              <div>
                <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-1">Adresse de l'école</label>
                <textarea
                  id="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  aria-required="true"
                  placeholder="Entrez l'adresse complète de l'école"
                />
              </div>

              <div>
                <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  id="schoolPhone"
                  type="tel"
                  value={formData.schoolPhone}
                  onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Téléphone de l'école"
                  placeholder="Entrez le numéro de téléphone"
                  title="Numéro de téléphone de l'école"
                />
              </div>

              <div>
                <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="schoolEmail"
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Email de l'école"
                  placeholder="Entrez l'email de l'école"
                  title="Adresse email de l'école"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="schoolWebsite" className="block text-sm font-medium text-gray-700 mb-1">Site web (optionnel)</label>
                <input
                  id="schoolWebsite"
                  type="url"
                  value={formData.schoolWebsite || ''}
                  onChange={(e) => setFormData({ ...formData, schoolWebsite: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemple.com"
                  aria-describedby="websiteHelp"
                />
                <p id="websiteHelp" className="mt-1 text-xs text-gray-500">Laissez vide si non applicable</p>
              </div>

              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
                <input
                  id="academicYear"
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="2023-2024"
                  aria-label="Année scolaire"
                  title="Année scolaire au format AAAA-AAAA"
                />
              </div>

              <div>
                <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                <input
                  id="slogan"
                  type="text"
                  value={formData.slogan || ''}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  aria-label="Slogan de l'école"
                  placeholder="Entrez un slogan pour l'école"
                  title="Slogan de l'école"
                />
              </div>

              <div>
                <label htmlFor="additionalText" className="block text-sm font-medium text-gray-700 mb-1">Texte supplémentaire (optionnel)</label>
                <textarea
                  id="additionalText"
                  value={formData.additionalText || ''}
                  onChange={(e) => setFormData({ ...formData, additionalText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Texte supplémentaire ou mentions légales"
                  aria-describedby="additionalTextHelp"
                />
                <p id="additionalTextHelp" className="mt-1 text-xs text-gray-500">Ce texte apparaîtra sous l'en-tête du document</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="logoLeft" className="block text-sm font-medium text-gray-700 mb-1">Logo gauche</label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        id="logoLeft"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setFormData({ ...formData, logoLeft: e.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-label="Logo gauche de l'établissement"
                        title="Sélectionner le logo à afficher à gauche de l'en-tête"
                      />
                      {formData.logoLeft && (
                        <img 
                          src={formData.logoLeft} 
                          alt="Logo gauche" 
                          className="h-12 w-12 object-contain rounded border border-gray-300"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="logoRight" className="block text-sm font-medium text-gray-700 mb-1">Logo droit</label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        id="logoRight"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setFormData({ ...formData, logoRight: e.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-label="Logo droit de l'établissement"
                        title="Sélectionner le logo à afficher à droite de l'en-tête"
                      />
                      {formData.logoRight && (
                        <img 
                          src={formData.logoRight} 
                          alt="Logo droit" 
                          className="h-12 w-12 object-contain rounded border border-gray-300"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

  const FooterForm = ({ footer, onSave, onCancel }: { footer: FooterConfig | null, onSave: (f: FooterConfig) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<FooterConfig>(footer || {
      id: '',
      name: '',
      type: 'bulletin',
      directorName: '',
      directorTitle: '',
      legalNotice: '',
      contactInfo: '',
      qrCode: false,
      date: true,
      pageNumber: true
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Configuration du pied de page</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="footerName" className="block text-sm font-medium text-gray-700 mb-1">Nom de la configuration</label>
              <input
                id="footerName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                aria-label="Nom de la configuration"
                placeholder="Entrez un nom pour cette configuration"
                title="Nom de la configuration du pied de page"
              />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
              <select
                id="documentType"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bulletin' | 'certificat' | 'facture' | 'reçu' | 'attestation' | 'convocation' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                aria-label="Sélectionnez le type de document"
              >
                <option value="all">Tous les types</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="directorName" className="block text-sm font-medium text-gray-700 mb-1">Nom du directeur</label>
              <input
                id="directorName"
                type="text"
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                aria-label="Nom du directeur"
                placeholder="Entrez le nom du directeur"
                title="Nom complet du directeur de l'établissement"
              />
            </div>

            <div>
              <label htmlFor="directorTitle" className="block text-sm font-medium text-gray-700 mb-1">Titre du directeur</label>
              <input
                id="directorTitle"
                type="text"
                value={formData.directorTitle}
                onChange={(e) => setFormData({ ...formData, directorTitle: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                aria-label="Titre du directeur"
                placeholder="Entrez le titre du directeur"
                title="Titre ou fonction du directeur (ex: Directeur, Principal, etc.)"
              />
            </div>

            <div>
              <label htmlFor="legalNotice" className="block text-sm font-medium text-gray-700 mb-1">Mention légale</label>
              <textarea
                id="legalNotice"
                value={formData.legalNotice || ''}
                onChange={(e) => setFormData({ ...formData, legalNotice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Mentions légales ou informations complémentaires"
                aria-label="Mentions légales"
                title="Mentions légales à afficher dans le pied de page"
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">Informations de contact</label>
              <textarea
                id="contactInfo"
                value={formData.contactInfo || ''}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
                placeholder="Informations de contact pour les questions"
                aria-label="Coordonnées de contact"
                title="Informations de contact pour les questions ou réclamations"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="block text-sm font-medium text-gray-700 mb-2">Options d'affichage</legend>
              
              <div className="flex items-center">
                <input
                  id="qrCodeCheckbox"
                  type="checkbox"
                  checked={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="qrCodeHelp"
                />
                <label htmlFor="qrCodeCheckbox" className="ml-2 text-sm text-gray-700">
                  Inclure un QR code de vérification
                </label>
                <p id="qrCodeHelp" className="sr-only">Activez pour ajouter un QR code de vérification dans le pied de page</p>
              </div>

              <div className="flex items-center">
                <input
                  id="dateCheckbox"
                  type="checkbox"
                  checked={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="dateHelp"
                />
                <label htmlFor="dateCheckbox" className="ml-2 text-sm text-gray-700">
                  Afficher la date d'édition
                </label>
                <p id="dateHelp" className="sr-only">Affiche automatiquement la date du jour dans le pied de page</p>
              </div>

              <div className="flex items-center">
                <input
                  id="pageNumberCheckbox"
                  type="checkbox"
                  checked={formData.pageNumber}
                  onChange={(e) => setFormData({ ...formData, pageNumber: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-describedby="pageNumberHelp"
                />
                <label htmlFor="pageNumberCheckbox" className="ml-2 text-sm text-gray-700">
                  Afficher le numéro de page
                </label>
                <p id="pageNumberHelp" className="sr-only">Affiche le numéro de page en bas de chaque page</p>
              </div>
            </fieldset>
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

  const filteredItems = activeTab === 'headers' 
    ? (selectedType === 'all' 
        ? headers 
        : headers.filter(h => h.type === selectedType))
    : (selectedType === 'all' 
        ? footers 
        : footers.filter(f => f.type === selectedType));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Paramétrage des Documents</h2>
          <p className="text-gray-600">Configurez les en-têtes et pieds de page de vos documents sans coder</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 inline mr-2" />
          Exporter la configuration
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'headers' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                En-têtes
              </button>
              <button
                onClick={() => setActiveTab('footers')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'footers' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pieds de page
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="documentFilter" className="sr-only">Filtrer par type de document</label>
              <select
                id="documentFilter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Filtrer par type de document"
              >
                <option value="all">Tous les types</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  if (activeTab === 'headers') {
                    setEditingHeader({
                      id: '',
                      name: '',
                      type: 'bulletin',
                      schoolName: '',
                      schoolAddress: '',
                      schoolPhone: '',
                      schoolEmail: '',
                      academicYear: ''
                    });
                  } else {
                    setEditingFooter({
                      id: '',
                      name: '',
                      type: 'bulletin',
                      directorName: '',
                      directorTitle: '',
                      legalNotice: '',
                      contactInfo: '',
                      qrCode: false,
                      date: true,
                      pageNumber: true
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nouvelle configuration
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Type: {item.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Aperçu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (activeTab === 'headers') {
                          setEditingHeader(item as HeaderConfig);
                        } else {
                          setEditingFooter(item as FooterConfig);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
                          if (activeTab === 'headers') {
                            setHeaders(headers.filter(h => h.id !== item.id));
                          } else {
                            setFooters(footers.filter(f => f.id !== item.id));
                          }
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {previewMode && (
                  <div className="mt-4 p-4 border-t">
                    {activeTab === 'headers' ? (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{(item as HeaderConfig).schoolName}</p>
                        <p>{(item as HeaderConfig).schoolAddress}</p>
                        <p>{(item as HeaderConfig).schoolPhone} • {(item as HeaderConfig).schoolEmail}</p>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Signature: {(item as FooterConfig).directorName} ({(item as FooterConfig).directorTitle})</p>
                        {(item as FooterConfig).legalNotice && <p>Mention: {(item as FooterConfig).legalNotice}</p>}
                        {(item as FooterConfig).contactInfo && <p>Contact: {(item as FooterConfig).contactInfo}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingHeader && (
        <HeaderForm
          header={editingHeader}
          onSave={handleSaveHeader}
          onCancel={() => setEditingHeader(null)}
        />
      )}

      {editingFooter && (
        <FooterForm
          footer={editingFooter}
          onSave={handleSaveFooter}
          onCancel={() => setEditingFooter(null)}
        />
      )}
    </div>
  );
};

export default DocumentHeaderFooterConfig;
