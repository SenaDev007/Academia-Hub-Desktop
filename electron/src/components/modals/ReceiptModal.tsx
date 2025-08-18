import React, { useState } from 'react';
import { X, Printer, Download, Loader2 } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PDFReceipt from '../receipts/PDFReceipt';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
    studentName: string;
    class: string;
    amount: number;
    date: string;
    method: string;
    type: string;
    status: string;
    reference?: string;
    parentName?: string;
    parentPhone?: string;
    address?: string;
    dateOfBirth?: string;
    schoolYear?: string;
    studentData?: {
      id: string;
      name: string;
      class: string;
      matricule: string;
      parentName: string;
      parentPhone: string;
      address: string;
      dateOfBirth: string;
      schoolYear: string;
      totalExpected: number;
      totalPaid: number;
      totalRemaining: number;
      status: string;
    };
  } | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, payment }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !payment) return null;

  // Ajouter un log pour déboguer les données reçues
  console.log('Données reçues dans ReceiptModal:', JSON.parse(JSON.stringify(payment)));

  // Créer un objet de données complet avec des valeurs par défaut
  const receiptData = {
    ...payment,
    // Assurer que les champs requis sont définis
    studentName: payment.studentName || 'Non spécifié',
    class: payment.class || 'Non affecté',
    reference: payment.reference || 'N/A',
    amount: payment.amount || 0,
    date: payment.date || new Date().toISOString().split('T')[0],
    method: payment.method || 'Non spécifié',
    status: payment.status || 'completed',
    type: payment.type || 'Frais non spécifié',
    // Ajouter les champs manquants avec des valeurs par défaut
    parentName: payment.parentName || 'Parent non spécifié',
    parentPhone: payment.parentPhone || 'Non spécifié',
    address: payment.address || 'Non spécifié',
    dateOfBirth: payment.dateOfBirth || 'Non spécifié',
    schoolYear: payment.schoolYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  };

  console.log('Données envoyées à PDFReceipt:', JSON.parse(JSON.stringify(receiptData)));

  const handlePrint = () => {
    setIsPrinting(true);
    // Laisser le temps au PDF de se charger avant d'imprimer
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 1000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Le téléchargement sera géré par PDFDownloadLink
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Aperçu du reçu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isPrinting || isDownloading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="500px" className="border-0">
              {receiptData && (
                <>
                  <PDFReceipt payment={receiptData} />
                </>
              )}
            </PDFViewer>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={handlePrint}
            disabled={isPrinting || isDownloading}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 ${
              isPrinting || isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Impression...
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </>
            )}
          </button>

          <PDFDownloadLink
            document={<PDFReceipt payment={receiptData} />}
            fileName={`recu-${receiptData.id}.pdf`}
            onClick={() => {
              setIsDownloading(true);
              return true;
            }}
            onComplete={() => {
              setIsDownloading(false);
              return true;
            }}
            className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {({ loading }) => (
              <>
                {loading || isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Préparation...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le PDF
                  </>
                )}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
