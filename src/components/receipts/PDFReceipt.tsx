import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { pdfService } from '../../services/pdfService';
import { useNotification } from '../../hooks/useNotification';

interface PDFReceiptProps {
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
    reduction?: number;
    amountGiven?: number;
    change?: number;
    studentData?: {
      id: string;
      name: string;
      class: string;
      matricule: string;
      parentName: string;
      parentPhone: string;
      address: string;
      schoolYear: string;
      totalExpected: number;
      totalPaid: number;
      totalRemaining: number;
    };
    items?: Array<{
      description: string;
      amount: number;
      quantity: number;
      total: number;
    }>;
  };
  onClose: () => void;
}

interface ReceiptOptions {
  format: 'A4' | 'A5' | 'receipt';
  includeLogo: boolean;
  includeQR: boolean;
  includeFooter: boolean;
  showDetails: boolean;
  language: 'fr' | 'en';
  template: 'standard' | 'official' | 'minimal';
}

const PDFReceipt = ({ payment, onClose }: PDFReceiptProps) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ReceiptOptions>({
    format: 'receipt',
    includeLogo: true,
    includeQR: false,
    includeFooter: true,
    showDetails: true,
    language: 'fr',
    template: 'standard'
  });

  const { showNotification } = useNotification();

  const handleExport = async (action: 'download' | 'preview' | 'print') => {
    setLoading(true);
    
    try {
      const pdfData = await pdfService.generateReceipt(payment, {
        format: options.format === 'receipt' ? 'A5' : options.format,
        orientation: 'portrait',
        margins: { top: 10, bottom: 10, left: 10, right: 10 },
        quality: 'high',
        includeHeader: options.includeLogo,
        includeFooter: options.includeFooter
      });

      const filename = `reçu-${payment.studentName}-${format(new Date(payment.date), 'yyyy-MM-dd')}.pdf`;

      switch (action) {
        case 'download':
          const filePath = await pdfService.savePDF(pdfData, filename, 'reçus');
          showNotification({
            type: 'success',
            message: `Reçu exporté avec succès: ${filePath}`
          });
          break;
          
        case 'preview':
          await pdfService.previewPDF(pdfData, filename);
          break;
          
        case 'print':
          await pdfService.printPDF(pdfData, filename);
          break;
      }
    } catch (error) {
      console.error('Erreur lors de l\'export du reçu:', error);
      showNotification({
        type: 'error',
        message: `Erreur lors de l'export: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Exporter le reçu de paiement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Aperçu du reçu */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Aperçu du reçu</h3>
            <div className="text-sm space-y-1">
              <div><strong>Élève:</strong> {payment.studentName}</div>
              <div><strong>Classe:</strong> {payment.class}</div>
              <div><strong>Montant:</strong> {payment.amount} FCFA</div>
              <div><strong>Date:</strong> {format(new Date(payment.date), 'dd/MM/yyyy', { locale: fr })}</div>
              <div><strong>Méthode:</strong> {payment.method}</div>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              value={options.format}
              onChange={(e) => setOptions({ ...options, format: e.target.value as 'A4' | 'A5' | 'receipt' })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="receipt">Format ticket</option>
              <option value="A5">A5</option>
              <option value="A4">A4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <select
              value={options.template}
              onChange={(e) => setOptions({ ...options, template: e.target.value as 'standard' | 'official' | 'minimal' })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="standard">Standard</option>
              <option value="official">Officiel</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeLogo}
                onChange={(e) => setOptions({ ...options, includeLogo: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Inclure le logo de l'établissement</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeFooter}
                onChange={(e) => setOptions({ ...options, includeFooter: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Inclure le pied de page</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.showDetails}
                onChange={(e) => setOptions({ ...options, showDetails: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Afficher les détails détaillés</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => handleExport('preview')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Aperçu'}
          </button>
          <button
            onClick={() => handleExport('print')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Imprimer'}
          </button>
          <button
            onClick={() => handleExport('download')}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Télécharger'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFReceipt;
