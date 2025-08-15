import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Enregistrer les polices
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a365d',
  },
  schoolDetails: {
    fontSize: 8,
    color: '#4a5568',
    lineHeight: 1.4,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '15px 0',
    color: '#1a365d',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d3748',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  col: {
    width: '48%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 120,
    color: '#4a5568',
  },
  value: {
    flex: 1,
    fontWeight: 'medium',
  },
  bold: {
    fontWeight: 'bold',
  },
  amountSection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginTop: 10,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  amountLabel: {
    color: '#4a5568',
  },
  amountValue: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 6,
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#718096',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
  statusBadge: (status: string) => ({
    backgroundColor: status === 'completed' ? '#48bb78' : status === 'pending' ? '#ecc94b' : '#f56565',
    color: 'white',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }),
  watermark: {
    position: 'absolute',
    opacity: 0.03,
    fontSize: 100,
    color: '#000000',
    transform: 'rotate(-45deg)',
    left: '20%',
    top: '40%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 10,
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    padding: '6px 0',
  },
  tableCol: {
    padding: '4px 8px',
  },
  tableCell: {
    fontSize: 9,
  },
  signature: {
    marginTop: 30,
    borderTop: '1px dashed #cbd5e0',
    paddingTop: 10,
    width: '50%',
  },
});

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
  schoolInfo?: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
    siret?: string;
    apeCode?: string;
    vatNumber?: string;
    director?: string;
    accountant?: string;
  };
}

const PDFReceipt: React.FC<PDFReceiptProps> = ({ 
  payment,
  schoolInfo = {
    name: 'ACADEMIA HUB',
    address: '123 Rue de l\'Éducation',
    city: '75000 Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@academia-hub.fr',
    website: 'www.academia-hub.fr',
    siret: '123 456 789 00012',
    apeCode: '8559A',
    vatNumber: 'FR 12 123 456 789',
    director: 'M. Jean DUPONT',
    accountant: 'Mme Sophie MARTIN',
  }
}) => {
  // Log pour déboguer les données reçues
  console.log('PDFReceipt - Données reçues:', JSON.parse(JSON.stringify(payment)));

  // Créer un objet étudiant avec des valeurs par défaut
  const student = {
    name: payment?.studentName || 'Non spécifié',
    class: payment?.class || 'Non affecté',
    reference: payment?.reference || 'N/A',
    parentName: payment?.parentName || 'Non spécifié',
    parentPhone: payment?.parentPhone || 'Non spécifié',
    address: payment?.address || 'Non spécifié',
    dateOfBirth: payment?.dateOfBirth || 'Non spécifié',
    schoolYear: payment?.schoolYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    status: payment?.status || 'Actif'
  };

  console.log('PDFReceipt - Données de l\'étudiant:', student);

  const formatDate = (dateString: string, includeTime = true) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Payé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'partial': return 'Partiel';
      default: return status;
    }
  };

  const paymentItems = payment.items || [{
    description: payment.type,
    amount: payment.amount,
    quantity: 1,
    total: payment.amount,
  }];

  const reduction = payment.reduction || 0;
  const amountGiven = payment.amountGiven || payment.amount;
  const change = payment.change || 0;
  const netAmount = payment.amount - reduction;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>ACADEMIA HUB</Text>
        
        {/* Header with Logo and School Info */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {schoolInfo.logo ? (
              <Image src={schoolInfo.logo} style={styles.logo} />
            ) : (
              <View style={styles.logo}>
                <Text>LOGO</Text>
              </View>
            )}
            <View style={styles.schoolInfo}>
              <Text style={styles.schoolName}>{schoolInfo.name}</Text>
              <Text style={styles.schoolDetails}>
                {schoolInfo.address} • {schoolInfo.city}
                {'\n'}
                Tél: {schoolInfo.phone} • Email: {schoolInfo.email} • {schoolInfo.website}
                {'\n'}
                SIRET: {schoolInfo.siret} • APE: {schoolInfo.apeCode} • TVA: {schoolInfo.vatNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Receipt Title */}
        <Text style={styles.receiptTitle}>REÇU DE PAIEMENT</Text>

        {/* Receipt Info */}
        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>N° de reçu:</Text>
                <Text style={[styles.value, styles.bold]}>{payment.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date et heure:</Text>
                <Text style={styles.value}>{formatDate(payment.date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Statut:</Text>
                <Text style={[styles.value, styles.statusBadge(payment.status)]}>
                  {getStatusText(payment.status).toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Référence:</Text>
                <Text style={styles.value}>{payment.reference || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Méthode:</Text>
                <Text style={styles.value}>{payment.method.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Année scolaire:</Text>
                <Text style={styles.value}>{student.schoolYear}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Student Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS ÉLÈVE</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {/* Colonne Informations personnelles */}
            <View style={{ width: '50%', paddingRight: 10 }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6, color: '#4b5563' }}>INFORMATIONS PERSONNELLES</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nom complet:</Text>
                <Text style={[styles.value, styles.bold]}>{student.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date de naissance:</Text>
                <Text style={styles.value}>
                  {!student.dateOfBirth || student.dateOfBirth === 'Non spécifié' 
                    ? 'Non spécifié' 
                    : new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Parent/Tuteur:</Text>
                <Text style={styles.value}>{student.parentName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Téléphone parent:</Text>
                <Text style={styles.value}>{student.parentPhone}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Adresse:</Text>
                <Text style={[styles.value, { flex: 1 }]} wrap>
                  {student.address}
                </Text>
              </View>
            </View>
            
            {/* Colonne Informations académiques */}
            <View style={{ width: '50%', paddingLeft: 10, borderLeft: '1px solid #e5e7eb' }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 6, color: '#4b5563' }}>INFORMATIONS ACADÉMIQUES</Text>
              <View style={styles.row}>
                <Text style={styles.label}>N° Educmaster:</Text>
                <Text style={[styles.value, styles.bold]}>{student.reference}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Classe:</Text>
                <Text style={styles.value}>
                  {student.class === 'N/A' ? 'Non affecté' : student.class}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Année scolaire:</Text>
                <Text style={styles.value}>{student.schoolYear}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Statut:</Text>
                <View style={{ 
                  backgroundColor: student.status === 'Actif' ? '#dcfce7' : '#fee2e2',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 10,
                  alignSelf: 'flex-start'
                }}>
                  <Text style={{ 
                    fontSize: 8, 
                    color: student.status === 'Actif' ? '#166534' : '#991b1b',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {student.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DÉTAIL DU PAIEMENT</Text>
          
          {/* Détail des articles */}
          <View style={{ marginBottom: 15 }}>
            <View style={styles.table}>
              {/* En-tête du tableau */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCol, styles.tableCell, { width: '50%' }]}>Description</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '15%', textAlign: 'right' }]}>P.U</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '10%', textAlign: 'center' }]}>Qté</Text>
                <Text style={[styles.tableCol, styles.tableCell, { width: '25%', textAlign: 'right' }]}>Total</Text>
              </View>
              
              {/* Lignes des articles */}
              {paymentItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCell, { width: '50%' }]}>{item.description}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, { width: '15%', textAlign: 'right' }]}>{formatCurrency(item.amount)}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, { width: '10%', textAlign: 'center' }]}>{item.quantity}</Text>
                  <Text style={[styles.tableCol, styles.tableCell, { width: '25%', textAlign: 'right' }]}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Récapitulatif du paiement */}
          <View style={[styles.amountSection, { backgroundColor: '#f0f9ff' }]}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 8 }}>RÉCAPITULATIF DU PAIEMENT</Text>
            
            <View style={[styles.amountRow, { marginBottom: 4 }]}>
              <Text style={styles.amountLabel}>Total TTC:</Text>
              <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
            </View>
            
            {reduction > 0 && (
              <View style={[styles.amountRow, { marginBottom: 4 }]}>
                <Text style={styles.amountLabel}>Réduction:</Text>
                <Text style={[styles.amountValue, { color: '#e53e3e' }]}>-{formatCurrency(reduction)}</Text>
              </View>
            )}
            
            <View style={[styles.amountRow, { marginTop: 6, paddingTop: 6, borderTop: '1px solid #e2e8f0' }]}>
              <Text style={[styles.amountLabel, styles.bold]}>Net à payer:</Text>
              <Text style={[styles.amountValue, styles.bold, { fontSize: 12 }]}>{formatCurrency(netAmount)}</Text>
            </View>
            
            <View style={[styles.amountRow, { marginTop: 8 }]}>
              <Text style={[styles.amountLabel, styles.bold]}>Montant versé:</Text>
              <Text style={[styles.amountValue, styles.bold]}>{formatCurrency(amountGiven)}</Text>
            </View>
            
            {change > 0 && (
              <View style={[styles.amountRow, { marginTop: 4 }]}>
                <Text style={[styles.amountLabel, styles.bold]}>Monnaie rendue:</Text>
                <Text style={[styles.amountValue, styles.bold, { color: '#2f855a' }]}>{formatCurrency(change)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Student Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BILAN DE SCOLARITÉ</Text>
          
          <View style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 4, marginTop: 8 }}>
            <View style={[styles.amountRow, { marginBottom: 4 }]}>
              <Text style={[styles.amountLabel, styles.bold]}>Total des frais de scolarité:</Text>
              <Text style={[styles.amountValue, styles.bold]}>{formatCurrency(payment.amount)}</Text>
            </View>
            
            <View style={[styles.amountRow, { marginBottom: 4 }]}>
              <Text style={styles.amountLabel}>Total déjà payé avant opération:</Text>
              <Text style={[styles.amountValue, { color: '#2f855a' }]}>{formatCurrency(payment.amount)}</Text>
            </View>
            
            <View style={[styles.amountRow, { marginBottom: 4 }]}>
              <Text style={styles.amountLabel}>Montant du paiement actuel:</Text>
              <Text style={[styles.amountValue, { color: '#2b6cb0' }]}>{formatCurrency(netAmount)}</Text>
            </View>
            
            <View style={[styles.amountRow, { marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }]}>
              <Text style={[styles.amountLabel, styles.bold]}>Total payé après opération:</Text>
              <Text style={[styles.amountValue, styles.bold, { color: '#2f855a' }]}>
                {formatCurrency(payment.amount + netAmount)}
              </Text>
            </View>
            
            <View style={[styles.amountRow, { marginTop: 4 }]}>
              <Text style={[styles.amountLabel, styles.bold]}>Reste à payer après opération:</Text>
              <Text style={[styles.amountValue, styles.bold, { color: '#c53030' }]}>
                {formatCurrency(Math.max(0, payment.amount - netAmount))}
              </Text>
            </View>
          </View>
          
          <View style={{ marginTop: 15, backgroundColor: '#fff5f5', padding: 10, borderRadius: 4, borderLeft: '4px solid #feb2b2' }}>
            <Text style={{ fontSize: 9, color: '#9b2c2c', fontWeight: 'bold', marginBottom: 4 }}>
              IMPORTANT:
            </Text>
            <Text style={{ fontSize: 8, color: '#9b2c2c' }}>
              Ce reçu est un justificatif de paiement officiel. Conservez-le précieusement.
              En cas de perte, une taxe de 1 000 FCFA sera appliquée pour l'édition d'un duplicata.
            </Text>
          </View>
        </View>

        {/* Terms and Signatures */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={styles.signature}>
            <Text style={{ textAlign: 'center', fontSize: 9, marginBottom: 25 }}>
              Signature du responsable
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 8, fontStyle: 'italic' }}>
              Cachet et signature de l'établissement
            </Text>
          </View>
          <View style={[styles.signature, { textAlign: 'right' }]}>
            <Text style={{ textAlign: 'center', fontSize: 9, marginBottom: 5 }}>
              Fait à {schoolInfo.city}, le {formatDate(new Date().toISOString(), false)}
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 8, marginTop: 20 }}>
              {schoolInfo.director}
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 8, fontStyle: 'italic' }}>
              {schoolInfo.accountant}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {schoolInfo.name} • {schoolInfo.address} • {schoolInfo.city} • Tél: {schoolInfo.phone}
            {'\n'}
            SIRET: {schoolInfo.siret} • APE: {schoolInfo.apeCode} • TVA: {schoolInfo.vatNumber}
            {'\n'}
            Ce document a une valeur probante. Ne pas jeter.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFReceipt;
