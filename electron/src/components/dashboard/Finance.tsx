import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users,
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Receipt,
  FileText,
  Calculator,
  Wallet,
  Building,
  UserCheck,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Send,
  Printer
} from 'lucide-react';
import {
  InvoiceModal, 
  ExpenseModal, 
  FeeTypeModal,
  FeeConfigurationModal,
  ClosingDayModal, 
  BudgetModal,
  PayrollModal,
  PayrollBatchModal,
  PayrollReportModal,
  PayrollDeclarationModal,
  PayrollSettingsModal,
  ConfirmModal,
  AlertModal,
  PaymentModal,
  ReceiptModal
} from '../modals';
import PayrollManagement from './PayrollManagement';
import '../../styles/tooltips.css';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFeeTypeModalOpen, setIsFeeTypeModalOpen] = useState(false);
  const [isFeeConfigurationModalOpen, setIsFeeConfigurationModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isPayrollBatchModalOpen, setIsPayrollBatchModalOpen] = useState(false);
  const [isPayrollReportModalOpen, setIsPayrollReportModalOpen] = useState(false);
  const [isPayrollDeclarationModalOpen, setIsPayrollDeclarationModalOpen] = useState(false);
  const [isPayrollSettingsModalOpen, setIsPayrollSettingsModalOpen] = useState(false);
  const [isClosingDayModalOpen, setIsClosingDayModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Fee configuration state
  const [feeTypes] = useState([
    { id: 1, name: 'Frais d\'inscription', description: 'Frais initiaux d\'inscription' },
    { id: 2, name: 'Frais de réinscription', description: 'Frais de réinscription annuelle' },
    { id: 3, name: 'Frais de scolarité', description: 'Frais mensuels de scolarité' },
    { id: 4, name: 'Frais de cantine', description: 'Frais de restauration scolaire' },
    { id: 5, name: 'Frais de transport', description: 'Frais de transport scolaire' },
    { id: 6, name: 'Frais d\'examen', description: 'Frais des examens officiels' },
    { id: 7, name: 'Frais de bibliothèque', description: 'Accès aux ressources documentaires' },
    { id: 8, name: 'Frais de laboratoire', description: 'Utilisation des laboratoires' },
    { id: 9, name: 'Frais d\'assurance', description: 'Assurance scolaire obligatoire' },
    { id: 10, name: 'Frais de sport', description: 'Activités sportives et équipement' },
    { id: 11, name: 'Frais d\'informatique', description: 'Accès aux technologies numériques' },
    { id: 12, name: 'Frais divers', description: 'Autres frais administratifs' }
  ]);

  const [feeLevels] = useState([
    'Petite Section', 'Moyenne Section', 'Grande Section', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'
  ]);





  // État pour l'année scolaire sélectionnée
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('2024-2025');

  // État pour la modal de reçu
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  // Données de frais par année scolaire (simulation)
  const feesByYear = {
    '2024-2025': {
      inscriptionFees: [50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 150000, 160000, 170000, 180000, 200000, 210000, 220000],
      reinscriptionFees: [40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 140000, 150000, 160000, 170000, 190000, 200000, 210000],
      scolariteFees: [150000, 165000, 180000, 195000, 210000, 225000, 240000, 255000, 270000, 450000, 480000, 510000, 540000, 600000, 630000, 660000]
    },
    '2023-2024': {
      inscriptionFees: [48000, 53000, 58000, 63000, 68000, 73000, 78000, 83000, 88000, 145000, 155000, 165000, 175000, 195000, 205000, 215000],
      reinscriptionFees: [38000, 43000, 48000, 53000, 58000, 63000, 68000, 73000, 78000, 135000, 145000, 155000, 165000, 185000, 195000, 205000],
      scolariteFees: [144000, 159000, 174000, 189000, 204000, 219000, 234000, 249000, 264000, 435000, 465000, 495000, 525000, 585000, 615000, 645000]
    },
    '2022-2023': {
      inscriptionFees: [46000, 51000, 56000, 61000, 66000, 71000, 76000, 81000, 86000, 140000, 150000, 160000, 170000, 190000, 200000, 210000],
      reinscriptionFees: [36000, 41000, 46000, 51000, 56000, 61000, 66000, 71000, 76000, 130000, 140000, 150000, 160000, 180000, 190000, 200000],
      scolariteFees: [138000, 153000, 168000, 183000, 198000, 213000, 228000, 243000, 258000, 420000, 450000, 480000, 510000, 570000, 600000, 630000]
    }
  };

  // Selected item for edit/delete
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [actionType, setActionType] = useState<'delete' | 'edit' | ''>('');

  // Ajouter cet état pour gérer la confirmation de suppression
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);

  const financialStats = [
    {
      title: 'Revenus du mois',
      value: '€45,230',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Paiements en attente',
      value: '€8,450',
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      title: 'Frais collectés',
      value: '€127,890',
      change: '+8%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Élèves à jour',
      value: '1,189',
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-purple-600 to-purple-700'
    }
  ];

  // Données pour les frais d'examen
  const examFees = [
    {
      id: 'EXM-2024-00001',
      studentName: 'Marie Dubois',
      class: '3ème A',
      examType: 'Brevet blanc',
      amount: 890,
      date: '2024-01-15',
      method: 'Carte bancaire',
      status: 'completed',
      type: 'Frais d\'examen'
    },
    {
      id: 'EXM-2024-00002',
      studentName: 'Pierre Martin',
      class: '2nde B',
      examType: 'Brevet blanc',
      amount: 890,
      date: '2024-01-14',
      method: 'Mobile Money',
      status: 'completed',
      type: 'Frais d\'examen'
    },
    {
      id: 'EXM-2024-00003',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      examType: 'Brevet blanc',
      amount: 890,
      date: '2024-01-13',
      method: 'Virement bancaire',
      status: 'pending',
      type: 'Frais d\'examen'
    }
  ];

  // Données pour les frais de cantine
  const canteenFees = [
    {
      id: 'CAN-2024-00001',
      studentName: 'Marie Dubois',
      class: '3ème A',
      mealType: 'Repas complet',
      amount: 320,
      date: '2024-01-15',
      method: 'Carte bancaire',
      status: 'completed',
      type: 'Frais de cantine'
    },
    {
      id: 'CAN-2024-00002',
      studentName: 'Pierre Martin',
      class: '2nde B',
      mealType: 'Demi-pension',
      amount: 240,
      date: '2024-01-14',
      method: 'Mobile Money',
      status: 'completed',
      type: 'Frais de cantine'
    },
    {
      id: 'CAN-2024-00003',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      mealType: 'Repas complet',
      amount: 320,
      date: '2024-01-13',
      method: 'Virement bancaire',
      status: 'pending',
      type: 'Frais de cantine'
    }
  ];

  const recentPayments = [
    {
      id: 'REC-2024-000123',
      studentName: 'Marie Dubois',
      class: '3ème A',
      amount: 450,
      date: '2024-01-10',
      method: 'Carte bancaire',
      status: 'completed',
      type: 'Frais de scolarité'
    },
    {
      id: 'REC-2024-000124',
      studentName: 'Pierre Martin',
      class: '2nde B',
      amount: 380,
      date: '2024-01-09',
      method: 'Mobile Money',
      status: 'completed',
      type: 'Frais d\'inscription'
    },
    {
      id: 'REC-2024-000125',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      amount: 520,
      date: '2024-01-08',
      method: 'Virement bancaire',
      status: 'pending',
      type: 'Frais de cantine'
    }
  ];

  const pendingFees = [
    {
      studentName: 'Jean Dupont',
      class: 'Terminale S',
      amount: 650,
      dueDate: '2024-01-15',
      daysOverdue: 0,
      parentPhone: '06 12 34 56 78',
      type: 'Frais de scolarité'
    },
    {
      studentName: 'Emma Rodriguez',
      class: '4ème B',
      amount: 420,
      dueDate: '2024-01-05',
      daysOverdue: 5,
      parentPhone: '06 98 76 54 32',
      type: 'Frais d\'examen'
    },
    {
      studentName: 'Lucas Bernard',
      class: '5ème A',
      amount: 380,
      dueDate: '2023-12-20',
      daysOverdue: 21,
      parentPhone: '06 55 66 77 88',
      type: 'Frais de transport'
    }
  ];

  const expenses = [
    {
      id: 'DEP-2024-000045',
      description: 'Salaires enseignants',
      category: 'Personnel',
      amount: 15420,
      date: '2024-01-10',
      status: 'approved',
      approvedBy: 'Directeur'
    },
    {
      id: 'DEP-2024-000046',
      description: 'Fournitures scolaires',
      category: 'Matériel',
      amount: 2340,
      date: '2024-01-09',
      status: 'pending',
      approvedBy: null
    },
    {
      id: 'DEP-2024-000047',
      description: 'Maintenance informatique',
      category: 'Maintenance',
      amount: 890,
      date: '2024-01-08',
      status: 'approved',
      approvedBy: 'Responsable IT'
    }
  ];

  const dailyClosing = {
    date: '2024-01-10',
    totalIncome: 4250,
    totalExpenses: 1890,
    netBalance: 2360,
    cashBalance: 1200,
    bankBalance: 45230,
    status: 'open'
  };

  const treasuryData = {
    currentBalance: 46430,
    monthlyIncome: 45230,
    monthlyExpenses: 38970,
    cashFlow: 6260,
    projectedBalance: 52690
  };

  // Données pour le bilan des encaissements
  const studentPaymentSummary = [
    {
      id: 'STD-001',
      studentName: 'Marie Dubois',
      class: '3ème A',
      totalExpected: 450000, // Inscription + Scolarité
      totalPaid: 300000,
      totalRemaining: 150000,
      lastPayment: '2024-01-15'
    },
    {
      id: 'STD-002',
      studentName: 'Pierre Martin',
      class: '2nde B',
      totalExpected: 420000,
      totalPaid: 420000,
      totalRemaining: 0,
      lastPayment: '2024-01-10'
    },
    {
      id: 'STD-003',
      studentName: 'Sophie Lambert',
      class: '1ère C',
      totalExpected: 480000,
      totalPaid: 160000,
      totalRemaining: 320000,
      lastPayment: '2024-01-08'
    }
  ];

  // Historique de paiement pour l'élève sélectionné
  const getStudentPaymentHistory = (studentId: string) => {
    const histories = {
      'STD-001': [
        {
          receiptNumber: 'REC-2024-000123',
          feeType: 'Frais d\'inscription',
          amount: 150000,
          paymentMethod: 'Mobile Money',
          date: '2024-01-15',
          status: 'Payé'
        },
        {
          receiptNumber: 'REC-2024-000089',
          feeType: 'Scolarité - 1ère tranche',
          amount: 150000,
          paymentMethod: 'Carte bancaire',
          date: '2024-01-10',
          status: 'Payé'
        }
      ],
      'STD-002': [
        {
          receiptNumber: 'REC-2024-000156',
          feeType: 'Frais de réinscription',
          amount: 120000,
          paymentMethod: 'Virement bancaire',
          date: '2024-01-10',
          status: 'Payé'
        },
        {
          receiptNumber: 'REC-2024-000157',
          feeType: 'Scolarité - Paiement complet',
          amount: 300000,
          paymentMethod: 'Virement bancaire',
          date: '2024-01-10',
          status: 'Payé'
        }
      ],
      'STD-003': [
        {
          receiptNumber: 'REC-2024-000098',
          feeType: 'Frais d\'inscription',
          amount: 160000,
          paymentMethod: 'Mobile Money',
          date: '2024-01-08',
          status: 'Payé'
        }
      ]
    };
    return histories[studentId as keyof typeof histories] || [];
  };

  const [studentPaymentHistory, setStudentPaymentHistory] = useState<any[]>([]);

  // Données fictives pour les élèves (pour les modals)
  const students = [
    { id: 'STD-001', firstName: 'Marie', lastName: 'Dubois', class: '3ème A' },
    { id: 'STD-002', firstName: 'Pierre', lastName: 'Martin', class: '2nde B' },
    { id: 'STD-003', firstName: 'Sophie', lastName: 'Lambert', class: '1ère C' }
  ];



  // Données fictives pour les niveaux d'éducation (pour les modals)
  const educationLevels = [
    { id: 'LVL-001', name: 'Primaire' },
    { id: 'LVL-002', name: 'Collège' },
    { id: 'LVL-003', name: 'Lycée' }
  ];

  // Données fictives pour les classes (pour les modals)
  const classes = [
    { id: 'CLS-001', name: '3ème A' },
    { id: 'CLS-002', name: '2nde B' },
    { id: 'CLS-003', name: '1ère C' }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverdueColor = (days: number) => {
    if (days === 0) return 'text-green-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Fonction pour gérer l'édition d'un élément
  const handleEditItem = (item: any, type: string = 'payment') => {
    try {
      console.log('=== handleEditItem appelé ===');
      console.log('Item reçu:', item);
      console.log('Type:', type);
      
      setActionType('edit');
      
      switch (type) {
        case 'payment':
          // Extraire les données de manière plus robuste
          const paymentData = {
            // ID et références
            id: item.id || item._id,
            studentId: item.studentId || item.student?.id || item.student?._id,
            
            // Informations de l'étudiant
            student: item.student || {
              id: item.studentId || item.student?.id,
              name: item.studentName || item.student?.name,
              class: item.className || item.student?.class,
              matricule: item.student?.matricule || item.student?.id,
              parentPhone: item.student?.parentPhone,
              totalExpected: item.student?.totalExpected || 0,
              totalPaid: item.student?.totalPaid || 0,
              totalRemaining: item.student?.totalRemaining || 0
            },
            
            // Détails du paiement
            amount: Number(item.amount) || 0,
            type: item.type || item.feeType || 'Frais de scolarité',
            method: item.method || item.paymentMethod || 'cash',
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            time: item.time || new Date().toTimeString().slice(0, 5),
            description: item.description || '',
            status: item.status || 'completed',
            
            // Références
            receiptNumber: item.receiptNumber || item.id,
            reference: item.reference || item.id,
            
            // Champs spécifiques
            reduction: Number(item.reduction) || 0,
            amountGiven: Number(item.amountGiven) || Number(item.amount) || 0,
            change: Number(item.change) || 0,
            
            // Données brutes pour débogage
            _raw: item
          };
          
          console.log('PaymentData préparé:', paymentData);
          setSelectedItem(paymentData);
          setIsPaymentModalOpen(true);
          break;
          
        case 'invoice':
          const invoiceData = {
            ...item,
            studentId: item.studentId || item.student?.id,
            student: item.student || students.find((s: any) => s.id === item.studentId),
            amount: item.amount,
            dueDate: item.dueDate,
            description: item.description || '',
            items: item.items || []
          };
          console.log('InvoiceData préparé:', invoiceData);
          setSelectedItem(invoiceData);
          setIsInvoiceModalOpen(true);
          break;
          
        default:
          console.warn('Type d\'élément non pris en charge pour l\'édition:', type);
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la préparation de l\'édition:', error);
      setAlertMessage({
        type: 'error',
        title: 'Erreur',
        content: 'Une erreur est survenue lors de la préparation de l\'édition.'
      });
      setIsAlertModalOpen(true);
    }
  };

  // Fonction pour gérer la suppression d'un élément
  const handleDeleteItem = (payment: any) => {
    // Créer un nouvel objet avec les propriétés renommées pour correspondre à ce que la modale attend
    const paymentForModal = {
      ...payment,
      // Mapper les noms de propriétés pour correspondre à ce que la modale attend
      className: payment.class || payment.className || 'Non spécifiée',
      feeType: payment.type || payment.feeType || 'Non spécifié',
      paymentMethod: payment.method || payment.paymentMethod || 'Non spécifiée'
    };
    
    setPaymentToDelete(paymentForModal);
    setIsConfirmModalOpen(true);
  };

  // Ajouter cette fonction pour confirmer la suppression
  const confirmDelete = async () => {
    if (!paymentToDelete) return;
    
    try {
      // Ici, vous devriez appeler votre API pour supprimer le paiement
      // await api.delete(`/api/payments/${paymentToDelete.id}`);
      
      // Afficher un message de succès
      setAlertMessage({
        title: 'Succès',
        message: 'Le paiement a été supprimé avec succès.',
        type: 'success'
      });
      
      // Recharger les données ou mettre à jour l'état local
      // loadPayments();
      
    } catch (error) {
      setAlertMessage({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la suppression du paiement.',
        type: 'error'
      });
    } finally {
      setIsConfirmModalOpen(false);
      setPaymentToDelete(null);
      setIsAlertModalOpen(true);
    }
  };

  // Fonction pour afficher le reçu
  const handleShowReceipt = (payment: any) => {
    setSelectedReceipt(payment);
    setIsReceiptModalOpen(true);
  };

  // Handlers pour les modals
  const handleNewPayment = () => {
    setSelectedItem(null);
    setIsPaymentModalOpen(true);
  };

  const handleNewInvoice = () => {
    setSelectedItem(null);
    setIsInvoiceModalOpen(true);
  };

  const handleNewExpense = () => {
    setSelectedItem(null);
    setIsExpenseModalOpen(true);
  };

  const handleNewFeeType = () => {
    setSelectedItem(null);
    setIsFeeTypeModalOpen(true);
  };

  const handleClosingDay = () => {
    setIsClosingDayModalOpen(true);
  };

  const handleNewBudget = () => {
    setSelectedItem(null);
    setIsBudgetModalOpen(true);
  };

  const handleFeeConfiguration = () => {
    setIsFeeConfigurationModalOpen(true);
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setStudentPaymentHistory(getStudentPaymentHistory(student.id));
  };

  const handleSavePayment = async (paymentData: any) => {
    try {
      console.log('Saving payment:', paymentData);
      
      // Mettre à jour les données locales pour refléter les changements immédiatement
      if (actionType === 'edit' && selectedItem) {
        // Mise à jour d'un paiement existant
        const updatedPayments = recentPayments.map(p => 
          p.id === selectedItem.id ? { ...p, ...paymentData } : p
        );
        setRecentPayments(updatedPayments);
        
        // Mettre à jour les statistiques
        updatePaymentStats(updatedPayments);
        
        setAlertMessage({
          title: 'Paiement mis à jour',
          message: 'Le paiement a été mis à jour avec succès.',
          type: 'success'
        });
      } else {
        // Ajout d'un nouveau paiement
        const newPayment = {
          id: `pay-${Date.now()}`,
          ...paymentData,
          status: 'completed',
          date: new Date().toISOString(),
        };
        
        setRecentPayments(prev => [newPayment, ...prev]);
        
        // Mettre à jour les statistiques
        updatePaymentStats([...recentPayments, newPayment]);
        
        setAlertMessage({
          title: 'Paiement enregistré',
          message: 'Le paiement a été enregistré avec succès.',
          type: 'success'
        });
      }
      
      // Fermer le modal de paiement
      setIsPaymentModalOpen(false);
      
      // Afficher la notification
      setIsAlertModalOpen(true);
      
      // Réinitialiser l'élément sélectionné après un court délai
      setTimeout(() => {
        setSelectedItem(null);
        setActionType('add');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      setAlertMessage({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'enregistrement du paiement.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
    }
  };

  const handleSaveInvoice = (invoiceData: any) => {
    console.log('Saving invoice:', invoiceData);
    setAlertMessage({
      title: 'Facture enregistrée',
      message: 'La facture a été enregistrée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveExpense = (expenseData: any) => {
    console.log('Saving expense:', expenseData);
    setAlertMessage({
      title: 'Dépense enregistrée',
      message: 'La dépense a été enregistrée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveFeeType = (feeTypeData: any) => {
    console.log('Saving fee type:', feeTypeData);
    setAlertMessage({
      title: 'Type de frais enregistré',
      message: 'Le type de frais a été enregistré avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveClosingDay = (closingData: any) => {
    console.log('Saving closing day:', closingData);
    setAlertMessage({
      title: 'Journée clôturée',
      message: 'La journée a été clôturée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveBudget = (budgetData: any) => {
    console.log('Saving budget:', budgetData);
    setAlertMessage({
      title: 'Budget enregistré',
      message: 'Le budget a été enregistré avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleSaveFeeConfiguration = (feeData: any) => {
    console.log('Saving fee configuration:', feeData);
    setAlertMessage({
      title: 'Configuration enregistrée',
      message: 'La configuration des frais a été enregistrée avec succès.',
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const handleViewReceipt = (payment: any) => {
    setSelectedReceipt(payment);
    setIsReceiptModalOpen(true);
  };

  const handleDownloadReceipt = (payment: any) => {
    console.log('Téléchargement du reçu:', payment.id);
  };

  const handleSendReceipt = async (payment: any, method: 'email' | 'sms' | 'whatsapp') => {
    try {
      console.log(`Envoi du reçu ${payment.id} par ${method}`);
      
      setAlertMessage({
        title: 'Succès',
        message: `Le reçu a été envoyé avec succès par ${method === 'email' ? 'email' : method === 'sms' ? 'SMS' : 'WhatsApp'}.`,
        type: 'success'
      });
      
      setIsAlertModalOpen(true);
    } catch (error) {
      setAlertMessage({
        title: 'Erreur',
        message: `Une erreur est survenue lors de l'envoi du reçu.`,
        type: 'error'
      });
      setIsAlertModalOpen(true);
    }
  };

  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionsMenu && !(event.target as Element).closest('.relative')) {
        setShowActionsMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu]);

  const tooltipStyle = `
    [data-tooltip] {
      position: relative;
      cursor: pointer;
    }
    [data-tooltip]:before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 5px;
      padding: 4px 8px;
      background: #333;
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 10;
    }
    [data-tooltip]:hover:before {
      opacity: 1;
      visibility: visible;
    }
  `;

  const GlobalStyles = () => (
    <style jsx global>{tooltipStyle}</style>
  );

  // Fonction pour mettre à jour les statistiques de paiement
  const updatePaymentStats = (payments: any[]) => {
    // Calculer le total des paiements
    const totalAmount = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    
    // Compter les paiements par méthode
    const paymentMethods = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod || 'other';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Mettre à jour l'état des statistiques
    setPaymentStats({
      totalAmount,
      totalPayments: payments.length,
      paymentMethods,
      lastUpdated: new Date().toISOString()
    });
    
    // Mettre à jour le graphique des paiements mensuels
    updateMonthlyPaymentsChart(payments);
  };
  
  // Fonction pour mettre à jour le graphique des paiements mensuels
  const updateMonthlyPaymentsChart = (payments: any[]) => {
    // Grouper les paiements par mois
    const monthlyData = payments.reduce((acc, payment) => {
      const date = new Date(payment.date || new Date());
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      
      acc[monthYear] += parseFloat(payment.amount) || 0;
      return acc;
    }, {} as Record<string, number>);
    
    // Trier les mois par ordre chronologique
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Mettre à jour l'état du graphique
    setMonthlyPaymentsData({
      labels: sortedMonths,
      datasets: [
        {
          label: 'Montant des paiements',
          data: sortedMonths.map(month => monthlyData[month] || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Fonctions d'export professionnel
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      setAlertMessage({
        title: 'Aucune donnée',
        message: 'Aucune donnée à exporter.',
        type: 'warning'
      });
      setIsAlertModalOpen(true);
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Échapper les guillemets et virgules
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setAlertMessage({
      title: 'Export réussi',
      message: `Le fichier ${filename}.csv a été téléchargé avec succès.`,
      type: 'success'
    });
    setIsAlertModalOpen(true);
  };

  const exportFinancialOverview = () => {
    const overviewData = [
      {
        'Catégorie': 'Revenus totaux',
        'Montant du jour (€)': '3,660',
        'Montant du mois (€)': '45,280',
        'Évolution': '+12.5%',
        'Statut': 'Actif',
        'Description': 'Encaissements de tous types'
      },
      {
        'Catégorie': 'Dépenses totaux',
        'Montant du jour (€)': '1,240',
        'Montant du mois (€)': '18,750',
        'Évolution': '+5.2%',
        'Statut': 'Surveillé',
        'Description': 'Sorties d\'argent'
      },
      {
        'Catégorie': 'Solde net',
        'Montant du jour (€)': '2,420',
        'Montant du mois (€)': '26,530',
        'Évolution': '+8.7%',
        'Statut': 'Positif',
        'Description': 'Bénéfice/Perte'
      },
      {
        'Catégorie': 'Paiements en attente',
        'Montant du jour (€)': '890',
        'Montant du mois (€)': '12,340',
        'Évolution': '5 en retard',
        'Statut': 'En attente',
        'Description': 'À encaisser'
      },
      {
        'Catégorie': 'Méthodes de paiement',
        'Montant du jour (€)': 'Carte: 75%',
        'Montant du mois (€)': 'Mobile: 20%, Virement: 5%',
        'Évolution': 'Équilibré',
        'Statut': 'Diversifié',
        'Description': 'Répartition'
      }
    ];
    
    exportToCSV(overviewData, 'Vue_ensemble_financiere');
  };

  const exportRevenueData = () => {
    const revenueData = recentPayments
      .filter(payment => payment.status === 'completed')
      .map(payment => ({
        'ID Paiement': payment.id,
        'Élève': payment.studentName,
        'Classe': payment.class,
        'Type de frais': payment.type,
        'Montant (€)': payment.amount,
        'Date': payment.date,
        'Méthode': payment.method,
        'Statut': 'Payé',
        'Référence': payment.reference || 'N/A'
      }));
    
    exportToCSV(revenueData, 'Revenus_detailles');
  };

  const exportExpenseData = () => {
    const expenseData = recentExpenses.map(expense => ({
      'ID Dépense': expense.id,
      'Description': expense.description,
      'Catégorie': expense.category,
      'Montant (€)': expense.amount,
      'Date': expense.date,
      'Méthode de paiement': expense.paymentMethod,
      'Statut': expense.status,
      'Approuvé par': expense.approvedBy || 'En attente',
      'Justificatif': expense.receipt ? 'Oui' : 'Non'
    }));
    
    exportToCSV(expenseData, 'Depenses_detaillees');
  };

  const exportBalanceData = () => {
    const balanceData = [
      {
        'Type': 'Solde d\'ouverture',
        'Montant (€)': '24,110',
        'Date': new Date().toLocaleDateString('fr-FR'),
        'Source': 'Report période précédente'
      },
      {
        'Type': 'Revenus du jour',
        'Montant (€)': '+3,660',
        'Date': new Date().toLocaleDateString('fr-FR'),
        'Source': 'Encaissements journaliers'
      },
      {
        'Type': 'Dépenses du jour',
        'Montant (€)': '-1,240',
        'Date': new Date().toLocaleDateString('fr-FR'),
        'Source': 'Sorties journalières'
      },
      {
        'Type': 'Solde de clôture',
        'Montant (€)': '26,530',
        'Date': new Date().toLocaleDateString('fr-FR'),
        'Source': 'Solde net calculé'
      }
    ];
    
    exportToCSV(balanceData, 'Solde_comptable');
  };

  const exportPendingPayments = () => {
    const pendingData = pendingFees.map(fee => ({
      'Élève': fee.studentName,
      'Classe': fee.class,
      'Type de frais': fee.type,
      'Montant (€)': fee.amount,
      'Date d\'échéance': fee.dueDate,
      'Jours de retard': fee.daysOverdue,
      'Téléphone parent': fee.parentPhone,
      'Statut': 'En attente',
      'Dernière relance': fee.lastReminder || 'Aucune'
    }));
    
    exportToCSV(pendingData, 'Paiements_en_attente');
  };

  const sendPaymentReminders = async () => {
    try {
      // Simuler l'envoi de rappels
      const pendingCount = pendingFees.length;
      const overdueCount = pendingFees.filter(fee => fee.daysOverdue > 0).length;
      
      // Ici, on pourrait intégrer avec un service SMS/Email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlertMessage({
        title: 'Rappels envoyés',
        message: `${pendingCount} rappels envoyés dont ${overdueCount} pour paiements en retard. Les parents ont été notifiés par SMS et email.`,
        type: 'success'
      });
      setIsAlertModalOpen(true);
      
      // Mettre à jour les données pour refléter l'envoi
      console.log('Rappels envoyés pour:', pendingFees.map(f => f.studentName));
      
    } catch (error) {
      setAlertMessage({
        title: 'Erreur d\'envoi',
        message: 'Une erreur est survenue lors de l\'envoi des rappels. Veuillez réessayer.',
        type: 'error'
      });
      setIsAlertModalOpen(true);
    }
  };

  const showDetailedStats = () => {
    const statsData = [
      { method: 'Carte bancaire', count: 156, amount: 34020, percentage: 75 },
      { method: 'Mobile Money', count: 42, amount: 9072, percentage: 20 },
      { method: 'Virement', count: 12, amount: 2268, percentage: 5 }
    ];
    
    console.log('Statistiques détaillées des méthodes de paiement:', statsData);
    
    setAlertMessage({
      title: 'Statistiques détaillées',
      message: `Carte: ${statsData[0].count} transactions (€${statsData[0].amount.toLocaleString()}), Mobile: ${statsData[1].count} transactions (€${statsData[1].amount.toLocaleString()}), Virement: ${statsData[2].count} transactions (€${statsData[2].amount.toLocaleString()})`,
      type: 'info'
    });
    setIsAlertModalOpen(true);
  };

  const openPaymentMethodsConfig = () => {
    setAlertMessage({
      title: 'Configuration',
      message: 'Module de configuration des méthodes de paiement en cours de développement. Disponible dans la prochaine version.',
      type: 'info'
    });
    setIsAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <GlobalStyles />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Économat & Finance</h1>
          <p className="text-gray-600">Gestion financière complète et contrôle budgétaire</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={exportFinancialOverview}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter bilan
          </button>
        </div>
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'payments', label: 'Encaissements', icon: CreditCard },
              { id: 'pending', label: 'Frais en attente', icon: Clock },
              { id: 'payment-summary', label: 'Bilan des encaissements', icon: BarChart3 },
              { id: 'expenses', label: 'Dépenses', icon: Receipt },
              { id: 'payroll', label: 'Gestion de la Paie', icon: DollarSign },
              { id: 'closing', label: 'Clôture journée', icon: Calculator },
              { id: 'treasury', label: 'Trésorerie', icon: Wallet },
              { id: 'reports', label: 'Rapports', icon: FileText },
              { id: 'canteen', label: 'Frais de cantine', icon: Building },
              { id: 'exams', label: 'Frais d\'examen', icon: FileText },
              { id: 'fee-config', label: 'Paramétrage frais', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Vue d'ensemble financière</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    onClick={exportFinancialOverview}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter bilan
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant du jour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant du mois
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Évolution
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
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Revenus totaux</div>
                            <div className="text-sm text-gray-500">Encaissements</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        €3,660
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        €45,280
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12.5%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Actif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => setActiveTab('payments')}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Voir détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Exporter"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Export des revenus',
                                message: 'Les données des revenus ont été exportées avec succès.',
                                type: 'success'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Receipt className="w-5 h-5 text-red-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Dépenses totales</div>
                            <div className="text-sm text-gray-500">Sorties d'argent</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        €1,240
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        €18,750
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +5.2%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Surveillé
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => setActiveTab('expenses')}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Voir détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Exporter"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Export des dépenses',
                                message: 'Les données des dépenses ont été exportées avec succès.',
                                type: 'success'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calculator className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Solde net</div>
                            <div className="text-sm text-gray-500">Bénéfice/Perte</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        €2,420
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        €26,530
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8.7%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Positif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => setActiveTab('closing')}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Voir clôture"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Exporter"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Export du solde',
                                message: 'Les données du solde ont été exportées avec succès.',
                                type: 'success'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Paiements en attente</div>
                            <div className="text-sm text-gray-500">À encaisser</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                        €890
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                        €12,340
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          5 en retard
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          En attente
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => setActiveTab('pending')}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Voir détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Envoyer rappels"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Rappels envoyés',
                                message: 'Les rappels de paiement ont été envoyés avec succès aux parents concernés.',
                                type: 'success'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-purple-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Méthodes de paiement</div>
                            <div className="text-sm text-gray-500">Répartition</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Carte: 75%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Mobile: 20%, Virement: 5%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Équilibré
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Diversifié
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Statistiques détaillées"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Statistiques détaillées',
                                message: 'Affichage des statistiques détaillées des méthodes de paiement.',
                                type: 'info'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                            data-tooltip="Configurer"
                            onClick={() => {
                              setAlertMessage({
                                title: 'Configuration',
                                message: 'Ouverture des paramètres de configuration des méthodes de paiement.',
                                type: 'info'
                              });
                              setIsAlertModalOpen(true);
                            }}
                          >
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Système d'encaissement</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    onClick={handleNewInvoice}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle facture
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type de frais
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
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
                    {recentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.class}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status === 'completed' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleShowReceipt(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Voir le reçu"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditItem(payment, 'payment')}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion des frais d'examen</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    onClick={handleNewInvoice}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel encaissement examen
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type d'examen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
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
                    {examFees.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.class}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status === 'completed' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleShowReceipt(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Voir le reçu"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditItem(payment, 'payment')}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'canteen' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion des frais de cantine</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </button>
                  <button 
                    onClick={handleNewInvoice}
                    className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel encaissement cantine
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu N°
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type de repas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
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
                    {canteenFees.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.class}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status === 'completed' ? 'Terminé' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleShowReceipt(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Voir le reçu"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditItem(payment, 'payment')}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(payment)}
                              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                              data-tooltip="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">État des paiements - Frais en attente</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Envoyer rappels
                </button>
              </div>

              <div className="space-y-4">
                {pendingFees.map((fee, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{fee.studentName}</h4>
                          <p className="text-sm text-gray-600">{fee.class} • {fee.type}</p>
                          <p className="text-sm text-gray-500">Échéance: {fee.dueDate}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">€{fee.amount}</p>
                        <p className={`text-sm font-medium ${getOverdueColor(fee.daysOverdue)}`}>
                          {fee.daysOverdue === 0 ? 'À échéance' : `${fee.daysOverdue} jours de retard`}
                        </p>
                        <p className="text-sm text-gray-500">{fee.parentPhone}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                          Contacter
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                          Échéancier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion des dépenses</h3>
                <button 
                  onClick={handleNewExpense}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle dépense
                </button>
              </div>

              <div className="grid gap-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
                          <p className="text-sm text-gray-600">{expense.category} • {expense.id}</p>
                          <p className="text-sm text-gray-500">{expense.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">-€{expense.amount}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpenseStatusColor(expense.status)}`}>
                          {expense.status === 'approved' ? 'Approuvé' : 
                           expense.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                        {expense.approvedBy && (
                          <p className="text-sm text-gray-500">Par: {expense.approvedBy}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                          Voir justificatif
                        </button>
                        {expense.status === 'pending' && (
                          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm">
                            Approuver
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditItem(expense, 'expense')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                          Éditer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'closing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Clôture de journée</h3>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Réconciliation
                  </button>
                  <button 
                    onClick={handleClosingDay}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Clôturer la journée
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Bilan du {dailyClosing.date}</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total encaissements</span>
                      <span className="text-xl font-bold text-green-600">+€{dailyClosing.totalIncome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total dépenses</span>
                      <span className="text-xl font-bold text-red-600">-€{dailyClosing.totalExpenses}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-medium">Solde net</span>
                      <span className="text-2xl font-bold text-blue-600">€{dailyClosing.netBalance}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Caisse physique</span>
                      <span className="font-bold">€{dailyClosing.cashBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Solde bancaire</span>
                      <span className="font-bold">€{dailyClosing.bankBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Statut</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dailyClosing.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {dailyClosing.status === 'open' ? 'Ouvert' : 'Clôturé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treasury' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestion de trésorerie</h3>
                <button 
                  onClick={handleNewBudget}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau budget
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">État de la trésorerie</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde actuel</span>
                      <span className="text-2xl font-bold text-purple-600">€{treasuryData.currentBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus mensuels</span>
                      <span className="font-bold text-green-600">+€{treasuryData.monthlyIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dépenses mensuelles</span>
                      <span className="font-bold text-red-600">-€{treasuryData.monthlyExpenses}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Cash-flow</span>
                      <span className="text-xl font-bold text-blue-600">€{treasuryData.cashFlow}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Prévisions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solde projeté (30j)</span>
                      <span className="text-xl font-bold text-green-600">€{treasuryData.projectedBalance}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Rentrées prévues: €12,450</p>
                      <p>• Sorties prévues: €8,190</p>
                      <p>• Échéances importantes: 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fee-config' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Paramétrage des frais scolaires</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gérez les frais par année scolaire</p>
                </div>
                <div className="flex gap-3">
                  <select 
                    value={selectedSchoolYear}
                    onChange={(e) => setSelectedSchoolYear(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    aria-label="Sélectionner l'année scolaire"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                  </select>
                  <button 
                    onClick={handleFeeConfiguration}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Année scolaire sélectionnée :</span> {selectedSchoolYear}
                </p>
              </div>

              {/* Sections distinctes pour chaque type de frais */}
              
              {/* Frais d'inscription */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Frais d'inscription (Nouveaux élèves)
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Maternelle</h4>
                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-green-600 dark:text-green-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].inscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Primaire</h4>
                    <div className="space-y-3">
                      {[3, 4, 5, 6, 7, 8].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].inscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Secondaire</h4>
                    <div className="space-y-3">
                      {[9, 10, 11, 12, 13, 14, 15].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].inscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frais de réinscription */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Frais de réinscription (Anciens élèves)
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Maternelle</h4>
                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].reinscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Primaire</h4>
                    <div className="space-y-3">
                      {[3, 4, 5, 6, 7, 8].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-yellow-600 dark:text-yellow-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].reinscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Secondaire</h4>
                    <div className="space-y-3">
                      {[9, 10, 11, 12, 13, 14, 15].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-orange-600 dark:text-orange-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].reinscriptionFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frais de scolarité */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Frais de scolarité (Annuel)
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Maternelle</h4>
                    <div className="space-y-3">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].scolariteFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Primaire</h4>
                    <div className="space-y-3">
                      {[3, 4, 5, 6, 7, 8].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].scolariteFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-900/30">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Niveau Secondaire</h4>
                    <div className="space-y-3">
                      {[9, 10, 11, 12, 13, 14, 15].map((index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">{feeLevels[index]}</span>
                          <span className="font-bold text-violet-600 dark:text-violet-400">{feesByYear[selectedSchoolYear as keyof typeof feesByYear].scolariteFees[index].toLocaleString()} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'payment-summary' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Bilan des encaissements</h3>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter le bilan
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Tableau Bilan encaissements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Bilan encaissements</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Élève
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total attendu
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total versé
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total restant
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {studentPaymentSummary.map((student) => (
                          <tr 
                            key={student.id} 
                            className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
                              selectedStudent?.id === student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleSelectStudent(student)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.studentName}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{student.class}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                              {student.totalExpected.toLocaleString()} F CFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600 dark:text-green-400">
                              {student.totalPaid.toLocaleString()} F CFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <span className={student.totalRemaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                {student.totalRemaining.toLocaleString()} F CFA
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tableau Historique de l'élève */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Historique de l'élève
                      {selectedStudent && (
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                          - {selectedStudent.studentName}
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    {selectedStudent ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              N° Reçu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Type de frais
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Méthode
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {studentPaymentHistory.map((payment, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                {payment.receiptNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {payment.feeType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                {payment.amount.toLocaleString()} F CFA
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {payment.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {payment.paymentMethod}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        Sélectionnez un élève pour voir son historique de paiement
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <PayrollManagement />
          )}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        payment={selectedItem}
        actionType={actionType}
        students={students}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        invoice={selectedItem}
        actionType={actionType}
        students={students}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expense={selectedItem}
        actionType={actionType}
      />

      <FeeTypeModal
        isOpen={isFeeTypeModalOpen}
        onClose={() => setIsFeeTypeModalOpen(false)}
        onSave={handleSaveFeeType}
        feeType={selectedItem}
        actionType={actionType}
      />

      <FeeConfigurationModal
        isOpen={isFeeConfigurationModalOpen}
        onClose={() => setIsFeeConfigurationModalOpen(false)}
        onSave={handleSaveFeeConfiguration}
        feeTypes={feeTypes}
        feeLevels={feeLevels}
        feesByYear={feesByYear}
        selectedSchoolYear={selectedSchoolYear}
        onSchoolYearChange={setSelectedSchoolYear}
      />

      <ClosingDayModal
        isOpen={isClosingDayModalOpen}
        onClose={() => setIsClosingDayModalOpen(false)}
        onSave={handleSaveClosingDay}
        dailyClosing={dailyClosing}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        budget={selectedItem}
        actionType={actionType}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedReceipt}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPaymentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        type="danger"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Voulez-vous vraiment supprimer ce paiement ?</p>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Élève:</span>
                <span>{paymentToDelete?.studentName || 'Non spécifié'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Classe:</span>
                <span>{paymentToDelete?.className || 'Non spécifiée'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Type de frais:</span>
                <span>{paymentToDelete?.feeType || 'Non spécifié'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Montant:</span>
                <span>{paymentToDelete?.amount || '0'} FCFA</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Date:</span>
                <span>{paymentToDelete?.date ? new Date(paymentToDelete.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Méthode:</span>
                <span className="capitalize">{paymentToDelete?.paymentMethod || 'Non spécifiée'}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-32 flex-shrink-0">• Statut:</span>
                <span className={`capitalize ${
                  paymentToDelete?.status === 'completed' ? 'text-green-600' : 
                  paymentToDelete?.status === 'pending' ? 'text-yellow-600' : 
                  paymentToDelete?.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {paymentToDelete?.status === 'completed' ? 'Complété' : 
                   paymentToDelete?.status === 'pending' ? 'En attente' : 
                   paymentToDelete?.status === 'failed' ? 'Échoué' : 
                   paymentToDelete?.status || 'Inconnu'}
                </span>
              </li>
            </ul>
          </div>
          
          <p className="text-red-600 text-sm">Cette action est irréversible.</p>
        </div>
      </ConfirmModal>

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={alertMessage.title}
        message={alertMessage.message}
        type={alertMessage.type}
      />
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onSave={(payrollData) => {
          console.log('Saving payroll:', payrollData);
          setIsPayrollModalOpen(false);
          setAlertMessage({
            title: 'Fiche de paie créée',
            message: 'La fiche de paie a été créée avec succès.',
            type: 'success'
          });
          setIsAlertModalOpen(true);
        }}
      />

      <PayrollBatchModal
        isOpen={isPayrollBatchModalOpen}
        onClose={() => setIsPayrollBatchModalOpen(false)}
        onSave={(batchData) => {
          console.log('Processing batch:', batchData);
          setIsPayrollBatchModalOpen(false);
          setAlertMessage({
            title: 'Traitement par lot lancé',
            message: 'Le traitement de paie par lot a été lancé avec succès.',
            type: 'success'
          });
          setIsAlertModalOpen(true);
        }}
      />

      <PayrollReportModal
        isOpen={isPayrollReportModalOpen}
        onClose={() => setIsPayrollReportModalOpen(false)}
        onGenerate={(reportOptions) => {
          console.log('Generating report:', reportOptions);
          setIsPayrollReportModalOpen(false);
          setAlertMessage({
            title: 'Rapport généré',
            message: 'Le rapport de paie a été généré avec succès.',
            type: 'success'
          });
          setIsAlertModalOpen(true);
        }}
      />

      <PayrollDeclarationModal
        isOpen={isPayrollDeclarationModalOpen}
        onClose={() => setIsPayrollDeclarationModalOpen(false)}
        onGenerate={(declarationOptions) => {
          console.log('Generating declaration:', declarationOptions);
          setIsPayrollDeclarationModalOpen(false);
          setAlertMessage({
            title: 'Déclaration générée',
            message: 'La déclaration sociale a été générée avec succès.',
            type: 'success'
          });
          setIsAlertModalOpen(true);
        }}
      />

      <PayrollSettingsModal
        isOpen={isPayrollSettingsModalOpen}
        onClose={() => setIsPayrollSettingsModalOpen(false)}
        onSave={(settings) => {
          console.log('Saving settings:', settings);
          setIsPayrollSettingsModalOpen(false);
          setAlertMessage({
            title: 'Paramètres sauvegardés',
            message: 'Les paramètres de paie ont été sauvegardés avec succès.',
            type: 'success'
          });
          setIsAlertModalOpen(true);
        }}
      />
    </div>
  );
};

export default Finance;