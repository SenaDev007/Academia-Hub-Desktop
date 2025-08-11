import React from 'react';
import { X, Printer, Download, Calendar, User, DollarSign, Hash } from 'lucide-react';

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
  } | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Créer un PDF ou télécharger le reçu
    const receiptContent = `
      REÇU DE PAIEMENT
      
      Numéro: ${payment.id}
      Date: ${formatDate(payment.date)}
      
      Élève: ${payment.studentName}
      Classe: ${payment.class}
      
      Type de paiement: ${payment.type}
      Montant: ${formatCurrency(payment.amount)}
      Méthode: ${payment.method}
      
      Statut: ${payment.status === 'completed' ? 'Payé' : 'En attente'}
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reçu-${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Reçu de Paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6" id="receipt-content">
          {/* School Header */}
          <div className="text-center mb-6 border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-900">ÉCOLE ACADEMIA HUB</h3>
            <p className="text-gray-600">Reçu de Paiement</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Hash className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Numéro:</span>
                <span className="ml-2">{payment.id}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">{formatDate(payment.date)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Élève:</span>
                <span className="ml-2">{payment.studentName}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Classe:</span>
                <span className="ml-2">{payment.class}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Détails du paiement</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type de paiement:</span>
                <span className="font-medium">{payment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode de paiement:</span>
                <span className="font-medium">{payment.method}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Montant total:</span>
                <span className="text-green-600">{formatCurrency(payment.amount)}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              payment.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {payment.status === 'completed' ? 'Paiement confirmé' : 'En attente de confirmation'}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Ce reçu est généré automatiquement par le système de gestion financière.</p>
            <p>Conservez ce document pour vos dossiers.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
