import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, CheckCircle, Clock, Mail, Key, ArrowRight, Shield, Users, Zap } from 'lucide-react';

const SchoolConfirmation: React.FC = () => {
  const [isCreatingCredentials, setIsCreatingCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{
    subdomain: string;
    email: string;
    password: string;
    loginUrl: string;
  } | null>(null);
  const [step, setStep] = useState(1); // 1: confirmation, 2: creating credentials, 3: credentials ready
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer les données du plan et du paiement depuis l'état de navigation
  const { plan, amount, paymentMethod } = location.state || {};
  
  // Récupérer les données d'inscription depuis le localStorage
  const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');

  useEffect(() => {
    // Auto-démarrer la création des credentials après 3 secondes
    const timer = setTimeout(() => {
      if (step === 1) {
        createCredentials();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [step]);

  const createCredentials = async () => {
    setStep(2);
    setIsCreatingCredentials(true);

    try {
      // Simuler la création de l'école et des credentials
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Générer les credentials
      const schoolCredentials = {
        subdomain: registrationData.subdomain || 'ecole-exemple',
        email: registrationData.email || 'admin@ecole.com',
        password: 'TempPass123!', // Mot de passe temporaire
        loginUrl: `https://${registrationData.subdomain || 'ecole-exemple'}.academiahub.com/login`
      };

      setCredentials(schoolCredentials);
      setStep(3);

      // Nettoyer le localStorage
      localStorage.removeItem('registrationData');

    } catch (error) {
      console.error('Credential creation failed:', error);
    } finally {
      setIsCreatingCredentials(false);
    }
  };

  const handleLoginToSchool = () => {
    // Rediriger vers l'URL de connexion de l'école
    if (credentials) {
      // Dans une vraie implémentation, on redirigerait vers le sous-domaine
      // Pour la démo, on va vers la page de connexion avec le sous-domaine
      navigate(`/${credentials.subdomain}/login`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Vous pourriez ajouter une notification ici
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Step 1: Confirmation */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-full blur-xl opacity-30"></div>
                <CheckCircle className="relative w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {plan?.price === 0 ? 'Essai gratuit activé !' : 'Paiement confirmé !'}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Félicitations ! Votre école "{registrationData.schoolName}" est en cours de création.
            </p>

            {/* Plan Summary */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan sélectionné:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{plan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">École:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{registrationData.schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sous-domaine:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{registrationData.subdomain}.academiahub.com</span>
                </div>
                {plan?.price !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Montant payé:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{amount?.toLocaleString()} F CFA</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Création de votre espace en cours...</span>
            </div>
          </div>
        )}

        {/* Step 2: Creating Credentials */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30"></div>
                <GraduationCap className="relative w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Configuration de votre école
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Nous configurons votre espace personnalisé et créons vos identifiants de connexion...
            </p>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Création de la base de données</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Configuration du sous-domaine</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-700 dark:text-gray-300">Génération des identifiants...</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Cette étape peut prendre quelques instants. Merci de patienter...
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Credentials Ready */}
        {step === 3 && credentials && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-full blur-xl opacity-30"></div>
                  <CheckCircle className="relative w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Votre école est prête !
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Vos identifiants de connexion ont été générés. Conservez-les précieusement.
              </p>
            </div>

            {/* Credentials */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Vos identifiants de connexion
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de connexion
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={credentials.loginUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.loginUrl)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Copier
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email administrateur
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={credentials.email}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.email)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Copier
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mot de passe temporaire
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={credentials.password}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.password)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ⚠️ Changez ce mot de passe lors de votre première connexion
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Prochaines étapes</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-blue-800 dark:text-blue-300">Connectez-vous à votre espace école</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-blue-800 dark:text-blue-300">Changez votre mot de passe</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-blue-800 dark:text-blue-300">Configurez les informations de votre école</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                  <span className="text-blue-800 dark:text-blue-300">Ajoutez vos premiers élèves et enseignants</span>
                </div>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Gestion complète</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Élèves, enseignants, notes et bien plus</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">IA intégrée</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analytics et recommandations intelligentes</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sécurisé</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Données protégées et sauvegardées</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLoginToSchool}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Accéder à mon école
              </button>
              
              <button
                onClick={() => {
                  const mailtoLink = `mailto:${credentials.email}?subject=Identifiants Academia Hub&body=Voici vos identifiants de connexion :%0D%0A%0D%0AURL: ${credentials.loginUrl}%0D%0AEmail: ${credentials.email}%0D%0AMot de passe: ${credentials.password}%0D%0A%0D%0AN'oubliez pas de changer votre mot de passe lors de votre première connexion.`;
                  window.open(mailtoLink);
                }}
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl font-semibold hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Envoyer par email
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Besoin d'aide ? Contactez notre support à{' '}
                <a href="mailto:support@academiahub.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  support@academiahub.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolConfirmation;