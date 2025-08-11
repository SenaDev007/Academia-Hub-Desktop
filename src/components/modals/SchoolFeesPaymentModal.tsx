import React, { useState } from 'react';
import FormModal from './FormModal';
import { DollarSign, CreditCard, Phone, CheckCircle, AlertTriangle, Shield, User, BarChart3, Calendar, Clock, Percent, Calculator } from 'lucide-react';

interface SchoolFeesPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  studentData?: any;
  studentName?: string;
  invoiceNumber?: string;
  feeType?: string;
}

const SchoolFeesPaymentModal: React.FC<SchoolFeesPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  studentData,
  studentName = '',
  invoiceNumber = '',
  feeType = ''
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'cash'>('mobile_money');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTime, setPaymentTime] = useState(new Date().toTimeString().slice(0, 5));
  const [paymentAmount, setPaymentAmount] = useState(amount);
  const [paymentReference, setPaymentReference] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [reduction, setReduction] = useState(0);
  const [amountGiven, setAmountGiven] = useState(0);
  const [change, setChange] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolWhatsAppNumber, setSchoolWhatsAppNumber] = useState('');
  const [savedSchoolWhatsAppNumber, setSavedSchoolWhatsAppNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger le numéro WhatsApp de l'école sauvegardé
  React.useEffect(() => {
    const savedNumber = localStorage.getItem('schoolWhatsAppNumber');
    if (savedNumber) {
      setSchoolWhatsAppNumber(savedNumber);
      setSavedSchoolWhatsAppNumber(savedNumber);
    }
  }, []);

  // Mock students data
  const allStudents = [
    {
      id: 'STD-001',
      name: 'Marie Dubois',
      class: '3ème A',
      matricule: 'MAT-2024-00001',
      dateOfBirth: '15/03/2009',
      parentName: 'Jean Dubois',
      parentPhone: '0195722234',
      address: '123 Rue de la Paix, 75001 Paris',
      schoolYear: '2023-2024',
      status: 'Actif',
      totalExpected: 450000,
      totalPaid: 300000,
      totalRemaining: 150000
    },
    {
      id: 'STD-002',
      name: 'Pierre Martin',
      class: '2nde B',
      matricule: 'MAT-2024-00002',
      dateOfBirth: '22/07/2008',
      parentName: 'Sophie Martin',
      parentPhone: '06 98 76 54 32',
      address: '456 Avenue des Écoles, 75002 Paris',
      schoolYear: '2023-2024',
      status: 'Actif',
      totalExpected: 470000,
      totalPaid: 200000,
      totalRemaining: 270000
    },
    {
      id: 'STD-003',
      name: 'Sophie Lambert',
      class: '1ère C',
      matricule: 'MAT-2024-00003',
      dateOfBirth: '08/11/2007',
      parentName: 'Michel Lambert',
      parentPhone: '06 55 66 77 88',
      address: '789 Boulevard de l\'École, 75003 Paris',
      schoolYear: '2023-2024',
      status: 'Actif',
      totalExpected: 480000,
      totalPaid: 150000,
      totalRemaining: 330000
    }
  ];

  // Filter students based on search term
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate receipt number
  React.useEffect(() => {
    const generateReceiptNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `REC-${year}${month}${day}-${random}`;
    };
    setReceiptNumber(generateReceiptNumber());
  }, []);

  // Calculate change when amount given changes
  React.useEffect(() => {
    if (paymentMethod === 'cash') {
      const calculatedChange = amountGiven - (paymentAmount - reduction);
      setChange(calculatedChange > 0 ? calculatedChange : 0);
    } else {
      setAmountGiven(paymentAmount - reduction);
      setChange(0);
    }
  }, [amountGiven, paymentAmount, reduction, paymentMethod]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    
    try {
      // Validate payment amount
      if (selectedStudent && paymentAmount > selectedStudent.totalRemaining) {
        throw new Error('Le montant ne peut pas dépasser le montant dû par l\'élève');
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Envoyer le reçu par SMS et WhatsApp au parent
      await sendSMSNotification();
      
      // Simulate successful payment
      setIsSuccess(true);
      
      // Ouvrir WhatsApp avec le message pré-rempli
      if (selectedStudent && selectedStudent.parentPhone) {
        const message = `
📧 REÇU DE PAIEMENT - École Exemple

👤 Élève: ${selectedStudent.name}
🏫 Classe: ${selectedStudent.class}
📋 N° Educmaster: ${selectedStudent.matricule}

💰 DÉTAILS DU PAIEMENT:
• N° Reçu: ${receiptNumber}
• Date: ${paymentDate} à ${paymentTime}
• Montant: ${formatAmount(paymentAmount)} F CFA
${reduction > 0 ? `• Réduction: ${formatAmount(reduction)} F CFA` : ''}
• Montant net: ${formatAmount(paymentAmount - reduction)} F CFA
• Méthode: ${paymentMethod === 'mobile_money' ? 'Mobile Money' : paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
${paymentReference ? `• Référence: ${paymentReference}` : ''}

💳 BILAN APRÈS PAIEMENT:
• Total attendu: ${formatAmount(selectedStudent.totalExpected)} F CFA
• Total versé: ${formatAmount(selectedStudent.totalPaid + (paymentAmount - reduction))} F CFA
• Restant à payer: ${formatAmount(selectedStudent.totalRemaining - (paymentAmount - reduction))} F CFA

📞 Contact école: ${schoolWhatsAppNumber || '01 23 45 67 89'}
📧 Email: contact@ecole-exemple.fr

Merci pour votre confiance ! 🙏
`.trim();
        
        const whatsappLink = `https://wa.me/${selectedStudent.parentPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
      }

      // Wait a bit before closing the modal
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendSMSNotification = async () => {
    if (!selectedStudent) return;
    
    // Contenu du reçu de paiement
    const receiptContent = `
📧 REÇU DE PAIEMENT - École Exemple

👤 Élève: ${selectedStudent.name}
🏫 Classe: ${selectedStudent.class}
📋 N° Educmaster: ${selectedStudent.matricule}

💰 DÉTAILS DU PAIEMENT:
• N° Reçu: ${receiptNumber}
• Date: ${paymentDate} à ${paymentTime}
• Montant: ${formatAmount(paymentAmount)} F CFA
${reduction > 0 ? `• Réduction: ${formatAmount(reduction)} F CFA` : ''}
• Montant net: ${formatAmount(paymentAmount - reduction)} F CFA
• Méthode: ${paymentMethod === 'mobile_money' ? 'Mobile Money' : paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
${paymentReference ? `• Référence: ${paymentReference}` : ''}

💳 BILAN APRÈS PAIEMENT:
• Total attendu: ${formatAmount(selectedStudent.totalExpected)} F CFA
• Total versé: ${formatAmount(selectedStudent.totalPaid + (paymentAmount - reduction))} F CFA
• Restant à payer: ${formatAmount(selectedStudent.totalRemaining - (paymentAmount - reduction))} F CFA

📞 Contact école: 01 23 45 67 89
📧 Email: contact@ecole-exemple.fr

Merci pour votre confiance ! 🙏
    `.trim();
    
    try {
      // Envoi par SMS
      await sendSMS(selectedStudent.parentPhone, receiptContent);
      console.log('✅ SMS envoyé avec succès au parent:', selectedStudent.parentPhone);
      
      // Envoi par WhatsApp
      await sendWhatsApp(selectedStudent.parentPhone, receiptContent);
      console.log('✅ WhatsApp envoyé avec succès au parent:', selectedStudent.parentPhone);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des notifications:', error);
      // En cas d'erreur, on continue quand même le processus de paiement
    }
  };

  const sendSMS = async (phoneNumber: string, message: string) => {
    // Dans une vraie implémentation, vous appelleriez votre service SMS ici
    // Exemple avec une API SMS
    const smsData = {
      to: phoneNumber,
      message: message,
      from: 'École Exemple'
    };
    
    // Simuler l'appel API
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData)
    });
    
    if (!response.ok) {
      throw new Error('Échec de l\'envoi SMS');
    }
    
    return response.json();
  };

  const sendWhatsApp = async (phoneNumber: string, message: string) => {
    // Si le numéro WhatsApp de l'école n'est pas défini, utiliser le numéro de l'école par défaut
    const schoolNumber = schoolWhatsAppNumber || '01 23 45 67 89';
    
    // Construire le lien WhatsApp avec le numéro du parent et le message
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Ouvrir le lien WhatsApp dans une nouvelle fenêtre
    window.open(whatsappLink, '_blank');
    
    // Sauvegarder le numéro WhatsApp de l'école si nécessaire
    if (schoolWhatsAppNumber && schoolWhatsAppNumber !== savedSchoolWhatsAppNumber) {
      setSavedSchoolWhatsAppNumber(schoolWhatsAppNumber);
      // Ici vous pouvez ajouter une fonction pour sauvegarder le numéro dans le localStorage ou une base de données
      localStorage.setItem('schoolWhatsAppNumber', schoolWhatsAppNumber);
    }
    
    return { success: true };
    // Dans une vraie implémentation, vous utiliseriez l'API WhatsApp Business
    // Exemple avec WhatsApp Business API
    const whatsappData = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: {
        body: message
      }
    };
    
    // Simuler l'appel API WhatsApp
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_WHATSAPP_TOKEN'
      },
      body: JSON.stringify(whatsappData)
    });
    
    if (!response.ok) {
      throw new Error('Échec de l\'envoi WhatsApp');
    }
    
    return response.json();
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Encaissement des frais de scolarité"
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Annuler
          </button>
          {!isSuccess && (
            <button
              type="submit"
              form="school-fees-payment-form"
              disabled={isProcessing || !selectedStudent}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Encaisser
                </>
              )}
            </button>
          )}
        </div>
      }
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Paiement encaissé avec succès !</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Montant encaissé : {formatAmount(paymentAmount - reduction)} F CFA
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Numéro de reçu: {receiptNumber}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Un SMS de confirmation a été envoyé au parent d'élève
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Le reçu a été généré et peut être imprimé.
          </p>
        </div>
      ) : (
        <form id="school-fees-payment-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de l'élève */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Sélection de l'élève
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Nom de l'élève
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un élève par nom, N° Educmaster, classe ou parent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const studentId = e.target.value;
                    setSelectedStudentId(studentId);
                    const student = filteredStudents.find(s => s.id === studentId);
                    setSelectedStudent(student || null);
                    if (student) {
                      setPaymentAmount(Math.min(amount, student.totalRemaining));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={filteredStudents.length === 0}
                  aria-label="Sélectionner un élève pour le paiement des frais"
                >
                  <option value="">
                    {filteredStudents.length === 0 
                      ? 'Aucun élève trouvé' 
                      : filteredStudents.length === allStudents.length 
                        ? 'Sélectionner un élève' 
                        : `${filteredStudents.length} élève(s) trouvé(s)`}
                  </option>
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class} (N° Educmaster: {student.matricule})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Configuration WhatsApp */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Configuration WhatsApp
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Numéro WhatsApp de l'école
                </label>
                <input
                  type="tel"
                  value={schoolWhatsAppNumber}
                  onChange={(e) => setSchoolWhatsAppNumber(e.target.value)}
                  placeholder="Ex: 01 23 45 67 89"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Le numéro WhatsApp de l'école sera utilisé pour envoyer les messages aux parents.
                  Il sera sauvegardé pour les prochaines utilisations.
                </p>
              </div>
            </div>
          </div>

          {/* Informations de l'élève (chargées après sélection) */}
          {selectedStudent && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Informations de l'élève
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Informations personnelles</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nom complet:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date de naissance:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Parent/Tuteur:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.parentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Téléphone parent:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.parentPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Adresse:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.address}</span>
                    </div>
                  </div>
                </div>
                
                {/* Informations académiques */}
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Informations académiques</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">N° Educmaster:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.matricule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Classe:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Année scolaire:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStudent.schoolYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Statut:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {selectedStudent.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bilan scolarité */}
          {selectedStudent && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Bilan scolarité
              </h4>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total attendu</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatAmount(selectedStudent.totalExpected)} F CFA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total versé</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatAmount(selectedStudent.totalPaid)} F CFA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total restant</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatAmount(selectedStudent.totalRemaining)} F CFA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Paiement */}
          {selectedStudent && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                Détails du paiement
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      N° Reçu*
                    </label>
                    <input
                      type="text"
                      id="receiptNumber"
                      value={receiptNumber}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date de paiement*
                      </label>
                      <input
                        type="date"
                        id="paymentDate"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="paymentTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Heure de paiement*
                      </label>
                      <input
                        type="time"
                        id="paymentTime"
                        value={paymentTime}
                        onChange={(e) => setPaymentTime(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Montant (F CFA)*
                    </label>
                    <input
                      type="number"
                      id="paymentAmount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                      max={selectedStudent.totalRemaining}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Maximum : {formatAmount(selectedStudent.totalRemaining)} F CFA
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="reduction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Réduction (F CFA)
                    </label>
                    <input
                      type="number"
                      id="reduction"
                      value={reduction}
                      onChange={(e) => setReduction(parseInt(e.target.value) || 0)}
                      min="0"
                      max={paymentAmount}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                {/* Méthode de paiement et détails */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Méthode de paiement*
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mobile_money')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          paymentMethod === 'mobile_money'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <Phone className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium">Mobile Money</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          paymentMethod === 'card'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium">Carte</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <DollarSign className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium">Espèces</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Référence
                    </label>
                    <input
                      type="text"
                      id="paymentReference"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Référence de transaction"
                    />
                  </div>
                  
                  {/* Champs spécifiques Mobile Money */}
                  {paymentMethod === 'mobile_money' && (
                    <>
                      <div>
                        <label htmlFor="senderPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          N° téléphone envoyeur*
                        </label>
                        <input
                          type="tel"
                          id="senderPhone"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="97123456"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          N° téléphone récepteur*
                        </label>
                        <input
                          type="tel"
                          id="receiverPhone"
                          value={receiverPhone}
                          onChange={(e) => setReceiverPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="97654321"
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Champs spécifiques Carte bancaire */}
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Numéro de carte*
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="**** **** **** 1234"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date d'expiration*
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="MM/AA"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVV*
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Champs spécifiques Espèces */}
                  {paymentMethod === 'cash' && (
                    <>
                      <div>
                        <label htmlFor="amountGiven" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Somme remise (F CFA)*
                        </label>
                        <input
                          type="number"
                          id="amountGiven"
                          value={amountGiven}
                          onChange={(e) => setAmountGiven(parseInt(e.target.value) || 0)}
                          min={paymentAmount - reduction}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="change" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Reliquat (F CFA)
                        </label>
                        <input
                          type="number"
                          id="change"
                          value={change}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Récapitulatif du paiement */}
          {selectedStudent && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
              <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Récapitulatif du paiement
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">Élève:</span>
                    <span className="font-bold text-blue-900 dark:text-blue-200">{selectedStudent.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">N° Reçu:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-200">{receiptNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">Date et heure:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-200">{paymentDate} à {paymentTime}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">Méthode:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-200">
                      {paymentMethod === 'mobile_money' ? 'Mobile Money' : 
                       paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">Montant initial:</span>
                    <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(paymentAmount)} F CFA</span>
                  </div>
                  
                  {reduction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-800 dark:text-blue-300">Réduction:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">-{formatAmount(reduction)} F CFA</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-blue-800 dark:text-blue-300">Montant net:</span>
                    <span className="font-bold text-blue-900 dark:text-blue-200">{formatAmount(paymentAmount - reduction)} F CFA</span>
                  </div>
                  
                  {paymentMethod === 'cash' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-blue-800 dark:text-blue-300">Somme remise:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">{formatAmount(amountGiven)} F CFA</span>
                      </div>
                      
                      {change > 0 && (
                        <div className="flex justify-between">
                          <span className="text-blue-800 dark:text-blue-300">Reliquat:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">{formatAmount(change)} F CFA</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
          
          {/* Security Notice */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toutes les transactions sont sécurisées et un reçu sera automatiquement généré.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Le reçu de paiement sera automatiquement envoyé par SMS et WhatsApp au parent d'élève.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </FormModal>
  );
};

export default SchoolFeesPaymentModal;