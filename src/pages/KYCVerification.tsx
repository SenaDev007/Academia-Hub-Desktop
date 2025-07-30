import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Upload, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const KYCVerification: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    idCard: null as File | null,
    schoolAuthorization: null as File | null,
    proofOfAddress: null as File | null,
    schoolPhotos: [] as File[]
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const files = e.target.files;
    if (!files) return;
    
    if (field === 'schoolPhotos') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev.schoolPhotos, ...Array.from(files)]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: files[0]
      }));
    }
  };
  
  const handleRemoveFile = (field: keyof typeof formData, index?: number) => {
    if (field === 'schoolPhotos' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        schoolPhotos: prev.schoolPhotos.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call to submit KYC documents
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setIsSubmitted(true);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('KYC submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepTitle = () => {
    switch (step) {
      case 1:
        return "Documents d'identité";
      case 2:
        return "Documents de l'établissement";
      case 3:
        return "Vérification finale";
      default:
        return "";
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Documents soumis avec succès !</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Votre dossier KYC a été soumis et est en cours d'examen. Nous vous notifierons par email dès que la vérification sera terminée.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vous allez être redirigé vers votre tableau de bord...
          </p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 dark:bg-green-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          to="/register/school/plan" 
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour au choix du plan
        </Link>

        {/* KYC Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30"></div>
                <GraduationCap className="relative w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Vérification KYC</h1>
            <p className="text-gray-600 dark:text-gray-400">Complétez la vérification pour activer votre compte</p>
            
            {renderStepIndicator()}
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
              {renderStepTitle()}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Identity Documents */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pièce d'identité du promoteur*
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {formData.idCard ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{formData.idCard.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('idCard')}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cliquez pour télécharger ou glissez-déposez</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG ou PDF (max. 5MB)</p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, 'idCard')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Justificatif de domicile*
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {formData.proofOfAddress ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{formData.proofOfAddress.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('proofOfAddress')}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cliquez pour télécharger ou glissez-déposez</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG ou PDF (max. 5MB)</p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Sécurité des données</p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Vos documents sont chiffrés et stockés en toute sécurité. Ils ne seront utilisés que pour la vérification KYC.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: School Documents */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Autorisation d'ouverture d'école*
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {formData.schoolAuthorization ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{formData.schoolAuthorization.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('schoolAuthorization')}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cliquez pour télécharger ou glissez-déposez</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG ou PDF (max. 5MB)</p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, 'schoolAuthorization')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Photos de l'établissement* (max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {formData.schoolPhotos.length > 0 ? (
                      <div className="space-y-2">
                        {formData.schoolPhotos.map((photo, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{photo.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('schoolPhotos', index)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                        {formData.schoolPhotos.length < 5 && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => document.getElementById('schoolPhotosInput')?.click()}
                              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                            >
                              Ajouter plus de photos
                            </button>
                            <input
                              id="schoolPhotosInput"
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'schoolPhotos')}
                              className="hidden"
                              multiple
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cliquez pour télécharger ou glissez-déposez</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG ou JPG (max. 5MB par photo)</p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'schoolPhotos')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          multiple
                          required
                        />
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Ajoutez des photos de l'extérieur et de l'intérieur de votre établissement.
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Final Verification */}
            {step === 3 && (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-300 font-medium">Documents prêts à être soumis</p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Veuillez vérifier que tous les documents sont corrects avant de soumettre.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Documents d'identité</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                        Pièce d'identité: {formData.idCard?.name}
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                        Justificatif de domicile: {formData.proofOfAddress?.name}
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Documents de l'établissement</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                        Autorisation d'ouverture: {formData.schoolAuthorization?.name}
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                        Photos de l'établissement: {formData.schoolPhotos.length} photo(s)
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">Important</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        La vérification KYC peut prendre jusqu'à 48 heures ouvrables. Vous recevrez une notification par email une fois la vérification terminée.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Précédent
                </button>
              )}
              
              <button
                type={step === 3 ? 'submit' : 'button'}
                onClick={step < 3 ? () => setStep(step + 1) : undefined}
                disabled={isLoading}
                className={`${step === 1 || step === 2 ? 'w-full' : ''} ${step > 1 ? 'ml-auto' : ''} bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  step < 3 ? "Suivant" : "Soumettre les documents"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;