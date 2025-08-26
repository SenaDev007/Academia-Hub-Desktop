import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  School, 
  Users, 
  Shield, 
  Bell,
  CreditCard,
  Database,
  Save,
  Upload,
  Download,
  FileText,
  RefreshCw,
  Trash2
} from 'lucide-react';
import DocumentSettings from '../settings/DocumentSettings';
import { storageDashboardService, RealTimeStorageData, RealTimeSyncData, RealTimePerformanceData, FileCategoryData } from '../../services/storageDashboardService';
import { electronBridge } from '../../services/electronBridge';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('school');
  
  // États pour les données en temps réel
  const [storageData, setStorageData] = useState<RealTimeStorageData | null>(null);
  const [syncData, setSyncData] = useState<RealTimeSyncData | null>(null);
  const [performanceData, setPerformanceData] = useState<RealTimePerformanceData | null>(null);
  const [fileData, setFileData] = useState<FileCategoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const settingsTabs = [
    { id: 'school', label: 'Établissement', icon: School },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'data', label: 'Stockage & Sync', icon: Database },
    { id: 'system', label: 'Système', icon: SettingsIcon }
  ];

  // Fonctions de gestion des données
  const refreshAllData = async () => {
    setLoading(true);
    try {
      await storageDashboardService.refreshAllData();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const preloadFrequentData = async () => {
    setLoading(true);
    try {
      await storageDashboardService.preloadFrequentData();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error preloading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const forceSync = async () => {
    setLoading(true);
    try {
      await storageDashboardService.forceSync();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error forcing sync:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      await storageDashboardService.clearCache();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setLoading(false);
    }
  };

  const preloadData = async () => {
    setLoading(true);
    try {
      await storageDashboardService.preloadData();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error preloading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeDiskSpace = async () => {
    setLoading(true);
    try {
      const analysis = await storageDashboardService.analyzeDiskSpace();
      console.log('Disk space analysis:', analysis);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error analyzing disk space:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldFiles = async () => {
    setLoading(true);
    try {
      await storageDashboardService.cleanupOldFiles();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIntegrity = async () => {
    setLoading(true);
    try {
      const integrity = await storageDashboardService.checkIntegrity();
      console.log('Integrity check:', integrity);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error checking integrity:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportMetrics = async () => {
    setLoading(true);
    try {
      const metrics = await storageDashboardService.exportMetrics();
      console.log('Exported metrics:', metrics);
      // Ici vous pourriez télécharger le fichier JSON
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error exporting metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupLogs = async () => {
    setLoading(true);
    try {
      await storageDashboardService.cleanupLogs();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect pour les données en temps réel
  React.useEffect(() => {
    if (activeTab === 'data') {
      // S'abonner aux mises à jour en temps réel
      const unsubscribeStorage = storageDashboardService.onStorageUpdate(setStorageData);
      const unsubscribeSync = storageDashboardService.onSyncUpdate(setSyncData);
      const unsubscribePerformance = storageDashboardService.onPerformanceUpdate(setPerformanceData);
      const unsubscribeFiles = storageDashboardService.onFileUpdate(setFileData);

      // Charger les données initiales
      refreshAllData();

      // Nettoyer les abonnements
      return () => {
        unsubscribeStorage();
        unsubscribeSync();
        unsubscribePerformance();
        unsubscribeFiles();
      };
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configuration et gestion de votre établissement</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'school' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Informations de l'établissement</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'établissement
                    </label>
                    <input
                      type="text"
                      defaultValue="École Exemple"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'établissement
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>École primaire</option>
                      <option>Collège</option>
                      <option>Lycée</option>
                      <option>Université</option>
                      <option>Centre de formation</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="123 Rue de l'Éducation, 75001 Paris, France"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="01 23 45 67 89"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="contact@ecole-exemple.fr"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de l'établissement
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <School className="w-8 h-8 text-white" />
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        <Upload className="w-4 h-4 mr-2" />
                        Changer le logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Ajouter utilisateur
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Administrateurs</h3>
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès complet à tous les modules</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Enseignants</h3>
                      <span className="text-2xl font-bold text-green-600">45</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès aux modules pédagogiques</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Personnel</h3>
                      <span className="text-2xl font-bold text-purple-600">12</span>
                    </div>
                    <p className="text-sm text-gray-600">Accès limité selon le rôle</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Rôles et permissions</h3>
                  
                  <div className="space-y-3">
                    {['Directeur', 'Enseignant', 'Secrétaire', 'Comptable', 'Surveillant'].map((role, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{role}</h4>
                          <p className="text-sm text-gray-600">
                            {role === 'Directeur' ? 'Accès complet à tous les modules' :
                             role === 'Enseignant' ? 'Notes, emploi du temps, communication' :
                             role === 'Secrétaire' ? 'Élèves, communication, documents' :
                             role === 'Comptable' ? 'Finance, paiements, rapports' :
                             'Absences, discipline, surveillance'}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Modifier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Sécurité et confidentialité</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Authentification</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Authentification à deux facteurs obligatoire</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Expiration automatique des sessions (30 min)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Connexion par empreinte digitale</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Politique de mot de passe</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longueur minimale
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>8 caractères</option>
                          <option>10 caractères</option>
                          <option>12 caractères</option>
                        </select>
                      </div>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Caractères spéciaux obligatoires</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-3 text-sm text-gray-700">Renouvellement tous les 90 jours</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-red-900 mb-4">Zone de danger</h3>
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Réinitialiser tous les mots de passe
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 ml-3">
                      Exporter les logs de sécurité
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Paramètres de notification</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Notifications système</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Nouvelles inscriptions</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Paiements reçus</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Absences non justifiées</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Incidents disciplinaires</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Canaux de notification</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Email</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">SMS</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notifications push</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Slack/Teams</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Facturation et abonnement</h2>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Plan Professional</h3>
                      <p className="text-sm text-gray-600">Jusqu'à 500 élèves • Tous les modules inclus</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">79€/mois</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Changer de plan
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Informations de facturation</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de facturation
                        </label>
                        <input
                          type="text"
                          defaultValue="École Exemple"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse de facturation
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="123 Rue de l'Éducation, 75001 Paris, France"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Méthode de paiement</h3>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expire 12/25</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Historique des factures</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/01/2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€79.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Payé
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Paramétrage des Documents</h2>
                    <p className="text-gray-600">Configurez les en-têtes, pieds de page et modèles de vos documents</p>
                  </div>
                </div>
                <DocumentSettings />
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gestion du stockage et synchronisation</h2>
                    <p className="text-gray-600">Surveillez et gérez votre architecture de stockage hybride</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${electronBridge.isElectronEnvironment() ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <span className="text-xs text-gray-500">
                        {electronBridge.getEnvironmentInfo()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={refreshAllData}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      {loading ? 'Actualisation...' : 'Actualiser'}
                    </button>
                    <button 
                      onClick={preloadFrequentData}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {loading ? 'Préchargement...' : 'Précharger'}
                    </button>
                  </div>
                </div>

                {/* Vue d'ensemble du stockage */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Base SQLite</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {storageData ? `${(storageData.sqlite.totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {storageData ? `${storageData.sqlite.totalItems} éléments` : 'Chargement...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Save className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Cache IndexedDB</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {storageData ? `${(storageData.cache.totalSize / (1024 * 1024)).toFixed(0)} MB` : '...'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {storageData ? `${storageData.cache.totalItems} éléments` : 'Chargement...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Fichiers locaux</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {storageData ? `${(storageData.files.totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {storageData ? `${storageData.files.totalFiles} fichiers` : 'Chargement...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Upload className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {storageData ? `${(storageData.overall.totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                        </p>
                        <p className="text-xs text-green-600">
                          {storageData ? `+${(storageData.overall.compressionRatio * 100).toFixed(0)}% optimisé` : 'Chargement...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut de synchronisation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Statut de synchronisation</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${syncData?.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-medium ${syncData?.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                          {syncData?.isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {syncData ? syncData.queueStatus.pending : '...'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">En attente</p>
                        <p className="text-xs text-gray-500">Éléments à synchroniser</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-green-600">
                            {syncData ? syncData.syncStats.completedItems : '...'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Synchronisés</p>
                        <p className="text-xs text-gray-500">Aujourd'hui</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-red-600">
                            {syncData ? syncData.queueStatus.failed : '...'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Échecs</p>
                        <p className="text-xs text-gray-500">À résoudre</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-3">
                      <button 
                        onClick={forceSync}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Synchronisation...' : 'Forcer la synchronisation'}
                      </button>
                      <button 
                        onClick={async () => {
                          const queue = await storageDashboardService.getSyncQueue();
                          console.log('Sync queue:', queue);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Voir la queue
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance du cache */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Performance du cache</h3>
                  </div>
                  <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Taux de réussite</span>
                            <span className="font-medium text-gray-900">
                              {performanceData ? `${performanceData.cacheHitRate.toFixed(1)}%` : '...'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${performanceData ? performanceData.cacheHitRate : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Temps de réponse</span>
                            <span className="font-medium text-gray-900">
                              {performanceData ? `${performanceData.responseTime.toFixed(0)}ms` : '...'}
                            </span>
                        </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${performanceData ? (performanceData.responseTime / 60) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Espace utilisé</span>
                            <span className="font-medium text-gray-900">
                              {performanceData ? `${(performanceData.spaceUsage / (1024 * 1024)).toFixed(0)} MB / ${(performanceData.maxSpace / (1024 * 1024)).toFixed(0)} MB` : '...'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${performanceData ? (performanceData.spaceUsage / performanceData.maxSpace) * 100 : 0}%` }}
                            ></div>
                        </div>
                      </div>
                    </div>
                    
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Stratégies de cache</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Fréquent</span>
                            <span className="text-sm font-medium text-green-600">
                              {performanceData ? `${performanceData.strategies.frequent.count} éléments` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Normal</span>
                            <span className="text-sm font-medium text-blue-600">
                              {performanceData ? `${performanceData.strategies.normal.count} éléments` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">Rare</span>
                            <span className="text-sm font-medium text-orange-600">
                              {performanceData ? `${performanceData.strategies.rare.count} éléments` : '...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-3">
                      <button 
                        onClick={clearCache}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Nettoyage...' : 'Nettoyer le cache'}
                      </button>
                      <button 
                        onClick={preloadData}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Préchargement...' : 'Précharger les données'}
                      </button>
                    </div>
                    </div>
                  </div>

                {/* Gestion des fichiers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Gestion des fichiers</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Répartition par catégorie</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-blue-500 rounded"></div>
                              <span className="text-sm text-gray-700">Photos d'élèves</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {fileData ? `${(fileData.studentPhotos.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-green-500 rounded"></div>
                              <span className="text-sm text-gray-700">Documents</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {fileData ? `${(fileData.documents.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-purple-500 rounded"></div>
                              <span className="text-sm text-gray-700">Rapports</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {fileData ? `${(fileData.reports.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : '...'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Statistiques d'optimisation</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-700">Photos optimisées</span>
                            <span className="text-sm font-medium text-blue-600">
                              {fileData ? `${fileData.studentPhotos.optimized}/${fileData.studentPhotos.count}` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm text-gray-700">Documents compressés</span>
                            <span className="text-sm font-medium text-green-600">
                              {fileData ? `${fileData.documents.compressed}/${fileData.documents.count}` : '...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-sm text-gray-700">Rapports archivés</span>
                            <span className="text-sm font-medium text-purple-600">
                              {fileData ? `${fileData.reports.archived}/${fileData.reports.count}` : '...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-3">
                      <button 
                        onClick={analyzeDiskSpace}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Analyse...' : 'Analyser l\'espace'}
                      </button>
                      <button 
                        onClick={cleanupOldFiles}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Nettoyage...' : 'Nettoyer les anciens'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions de maintenance */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-yellow-900 mb-4">Actions de maintenance</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                      <button 
                        onClick={checkIntegrity}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Database className="w-4 h-4 inline mr-2" />
                        {loading ? 'Vérification...' : 'Vérifier l\'intégrité'}
                      </button>
                      <button 
                        onClick={exportMetrics}
                        disabled={loading}
                        className="w-full px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        {loading ? 'Export...' : 'Exporter les métriques'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={cleanupLogs}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        {loading ? 'Nettoyage...' : 'Nettoyer les logs'}
                      </button>
                      <button 
                        onClick={async () => {
                          const settings = await storageDashboardService.getAdvancedSettings();
                          console.log('Advanced settings:', settings);
                        }}
                        className="w-full px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4 inline mr-2" />
                        Paramètres avancés
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Paramètres système</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Langue
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Français</option>
                          <option>English</option>
                          <option>Español</option>
                          <option>Deutsch</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuseau horaire
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Europe/Paris (UTC+1)</option>
                          <option>Europe/London (UTC+0)</option>
                          <option>America/New_York (UTC-5)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Format de date
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Intégrations IA</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Traduction automatique</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Génération de commentaires</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Détection d'anomalies</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Prédictions de performance</span>
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Informations système</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-800"><strong>Version:</strong> Academia Hub v2.1.0</p>
                      <p className="text-blue-800"><strong>Base de données:</strong> PostgreSQL 14.2</p>
                      <p className="text-blue-800"><strong>Serveur:</strong> AWS eu-west-1</p>
                    </div>
                    <div>
                      <p className="text-blue-800"><strong>Uptime:</strong> 99.98%</p>
                      <p className="text-blue-800"><strong>Dernière mise à jour:</strong> 15/01/2024</p>
                      <p className="text-blue-800"><strong>Support:</strong> 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;