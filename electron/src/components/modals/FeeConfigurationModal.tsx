import React, { useState } from 'react';
import FormModal from './FormModal';
import { Settings, Save, DollarSign, GraduationCap, Calendar } from 'lucide-react';

interface FeeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feeData: unknown) => void;
}

const FeeConfigurationModal: React.FC<FeeConfigurationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('inscription');
  
  const [inscriptionFees, setInscriptionFees] = useState([
    { level: 'Petite Section', amount: 50000 },
    { level: 'Moyenne Section', amount: 55000 },
    { level: 'Grande Section', amount: 60000 },
    { level: 'CI', amount: 65000 },
    { level: 'CP', amount: 70000 },
    { level: 'CE1', amount: 75000 },
    { level: 'CE2', amount: 80000 },
    { level: 'CM1', amount: 85000 },
    { level: 'CM2', amount: 90000 },
    { level: '6ème', amount: 150000 },
    { level: '5ème', amount: 160000 },
    { level: '4ème', amount: 170000 },
    { level: '3ème', amount: 180000 },
    { level: '2nde', amount: 200000 },
    { level: '1ère', amount: 210000 },
    { level: 'Terminale', amount: 220000 }
  ]);

  const [reinscriptionFees, setReinscriptionFees] = useState([
    { level: 'Petite Section', amount: 40000 },
    { level: 'Moyenne Section', amount: 45000 },
    { level: 'Grande Section', amount: 50000 },
    { level: 'CI', amount: 55000 },
    { level: 'CP', amount: 60000 },
    { level: 'CE1', amount: 65000 },
    { level: 'CE2', amount: 70000 },
    { level: 'CM1', amount: 75000 },
    { level: 'CM2', amount: 80000 },
    { level: '6ème', amount: 140000 },
    { level: '5ème', amount: 150000 },
    { level: '4ème', amount: 160000 },
    { level: '3ème', amount: 170000 },
    { level: '2nde', amount: 190000 },
    { level: '1ère', amount: 200000 },
    { level: 'Terminale', amount: 210000 }
  ]);

  const [tuitionFees, setTuitionFees] = useState([
    { level: 'Petite Section', installments: 3, amounts: [80000, 80000, 80000] },
    { level: 'Moyenne Section', installments: 3, amounts: [85000, 85000, 85000] },
    { level: 'Grande Section', installments: 3, amounts: [90000, 90000, 90000] },
    { level: 'CI', installments: 3, amounts: [95000, 95000, 95000] },
    { level: 'CP', installments: 3, amounts: [100000, 100000, 100000] },
    { level: 'CE1', installments: 3, amounts: [105000, 105000, 105000] },
    { level: 'CE2', installments: 3, amounts: [110000, 110000, 110000] },
    { level: 'CM1', installments: 3, amounts: [115000, 115000, 115000] },
    { level: 'CM2', installments: 3, amounts: [120000, 120000, 120000] },
    { level: '6ème', installments: 3, amounts: [180000, 180000, 180000] },
    { level: '5ème', installments: 3, amounts: [190000, 190000, 190000] },
    { level: '4ème', installments: 3, amounts: [200000, 200000, 200000] },
    { level: '3ème', installments: 3, amounts: [210000, 210000, 210000] },
    { level: '2nde', installments: 3, amounts: [230000, 230000, 230000] },
    { level: '1ère', installments: 3, amounts: [240000, 240000, 240000] },
    { level: 'Terminale', installments: 3, amounts: [250000, 250000, 250000] }
  ]);

  const [schoolYear, setSchoolYear] = useState('2023-2024');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  const updateInscriptionFee = (index: number, amount: number) => {
    const updated = [...inscriptionFees];
    updated[index].amount = amount;
    setInscriptionFees(updated);
  };

  const updateReinscriptionFee = (index: number, amount: number) => {
    const updated = [...reinscriptionFees];
    updated[index].amount = amount;
    setReinscriptionFees(updated);
  };



  const updateTuitionAmount = (levelIndex: number, installmentIndex: number, amount: number) => {
    const updated = [...tuitionFees];
    updated[levelIndex].amounts[installmentIndex] = amount;
    setTuitionFees(updated);
  };

  const updateInstallments = (levelIndex: number, newInstallments: number) => {
    const updated = [...tuitionFees];
    const currentAmounts = updated[levelIndex].amounts;
    const currentTotal = currentAmounts.reduce((sum, amount) => sum + amount, 0);
    const newAmounts = Array(newInstallments).fill(Math.round(currentTotal / newInstallments));
    
    updated[levelIndex] = {
      ...updated[levelIndex],
      installments: newInstallments,
      amounts: newAmounts
    };
    setTuitionFees(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const feeConfiguration = {
      schoolYear,
      effectiveDate,
      inscriptionFees,
      reinscriptionFees,
      tuitionFees
    };
    
    onSave(feeConfiguration);
    onClose();
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
      title="Configuration des frais scolaires"
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="fee-configuration-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer la configuration
          </button>
        </div>
      }
    >
      <form id="fee-configuration-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations générales
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Année scolaire*
              </label>
              <select
                id="schoolYear"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date d'application*
              </label>
              <input
                type="date"
                id="effectiveDate"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Onglets de configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'inscription', label: 'Frais d\'inscription', icon: GraduationCap },
                { id: 'reinscription', label: 'Frais de réinscription', icon: GraduationCap },
                { id: 'tuition', label: 'Frais de scolarité', icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
            {/* Frais d'inscription */}
            {activeTab === 'inscription' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Configuration des frais d'inscription
                </h4>
                
                {/* Niveau Maternelle */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg p-4 border border-pink-200 dark:border-pink-900/30">
                  <h5 className="font-medium text-pink-700 dark:text-pink-300 mb-3">Niveau Maternelle</h5>
                  <div className="space-y-3">
                    {inscriptionFees.filter(fee => ['Petite Section', 'Moyenne Section', 'Grande Section'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = inscriptionFees.findIndex(f => f.level === fee.level);
                            updateInscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant inscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Primaire */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
                  <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Niveau Primaire</h5>
                  <div className="space-y-3">
                    {inscriptionFees.filter(fee => ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = inscriptionFees.findIndex(f => f.level === fee.level);
                            updateInscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant inscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Secondaire */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg p-4 border border-green-200 dark:border-green-900/30">
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-3">Niveau Secondaire</h5>
                  <div className="space-y-3">
                    {inscriptionFees.filter(fee => ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = inscriptionFees.findIndex(f => f.level === fee.level);
                            updateInscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant inscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Frais de réinscription */}
            {activeTab === 'reinscription' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Configuration des frais de réinscription
                </h4>
                
                {/* Niveau Maternelle */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg p-4 border border-pink-200 dark:border-pink-900/30">
                  <h5 className="font-medium text-pink-700 dark:text-pink-300 mb-3">Niveau Maternelle</h5>
                  <div className="space-y-3">
                    {reinscriptionFees.filter(fee => ['Petite Section', 'Moyenne Section', 'Grande Section'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = reinscriptionFees.findIndex(f => f.level === fee.level);
                            updateReinscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant réinscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Primaire */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
                  <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Niveau Primaire</h5>
                  <div className="space-y-3">
                    {reinscriptionFees.filter(fee => ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = reinscriptionFees.findIndex(f => f.level === fee.level);
                            updateReinscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant réinscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Secondaire */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg p-4 border border-green-200 dark:border-green-900/30">
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-3">Niveau Secondaire</h5>
                  <div className="space-y-3">
                    {reinscriptionFees.filter(fee => ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</label>
                        <input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => {
                            const actualIndex = reinscriptionFees.findIndex(f => f.level === fee.level);
                            updateReinscriptionFee(actualIndex, parseInt(e.target.value) || 0);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
                          placeholder="Montant"
                          aria-label={`Montant réinscription ${fee.level}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Frais de scolarité */}
            {activeTab === 'tuition' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Configuration des frais de scolarité (par tranche)
                </h4>
                
                {/* Niveau Maternelle */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg p-4 border border-pink-200 dark:border-pink-900/30">
                  <h5 className="font-medium text-pink-700 dark:text-pink-300 mb-3">Niveau Maternelle</h5>
                  <div className="space-y-3">
                    {tuitionFees.filter(fee => ['Petite Section', 'Moyenne Section', 'Grande Section'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total: {formatAmount(fee.amounts.reduce((sum, amount) => sum + amount, 0))} F CFA
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={fee.installments}
                            onChange={(e) => {
                              const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                              updateInstallments(actualIndex, parseInt(e.target.value) || 1);
                            }}
                            className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                            placeholder="Tranches"
                            aria-label={`Nombre de tranches pour ${fee.level}`}
                            min="1"
                            max="12"
                          />
                        </div>
                        
                        {/* Champs de configuration des tranches */}
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-pink-200 dark:border-pink-800">
                          {Array.from({ length: fee.installments }, (_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16">
                                Tranche {i + 1}:
                              </span>
                              <input
                                type="number"
                                value={fee.amounts[i] || 0}
                                onChange={(e) => {
                                  const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                                  updateTuitionAmount(actualIndex, i, parseInt(e.target.value) || 0);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right text-sm"
                                placeholder="Montant"
                                aria-label={`Montant tranche ${i + 1} pour ${fee.level}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Primaire */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
                  <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Niveau Primaire</h5>
                  <div className="space-y-3">
                    {tuitionFees.filter(fee => ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total: {formatAmount(fee.amounts.reduce((sum, amount) => sum + amount, 0))} F CFA
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={fee.installments}
                            onChange={(e) => {
                              const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                              updateInstallments(actualIndex, parseInt(e.target.value) || 1);
                            }}
                            className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                            placeholder="Tranches"
                            aria-label={`Nombre de tranches pour ${fee.level}`}
                            min="1"
                            max="12"
                          />
                        </div>
                        
                        {/* Champs de configuration des tranches */}
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                          {Array.from({ length: fee.installments }, (_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16">
                                Tranche {i + 1}:
                              </span>
                              <input
                                type="number"
                                value={fee.amounts[i] || 0}
                                onChange={(e) => {
                                  const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                                  updateTuitionAmount(actualIndex, i, parseInt(e.target.value) || 0);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right text-sm"
                                placeholder="Montant"
                                aria-label={`Montant tranche ${i + 1} pour ${fee.level}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau Secondaire */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg p-4 border border-green-200 dark:border-green-900/30">
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-3">Niveau Secondaire</h5>
                  <div className="space-y-3">
                    {tuitionFees.filter(fee => ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'].includes(fee.level)).map((fee) => (
                      <div key={fee.level} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fee.level}</span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total: {formatAmount(fee.amounts.reduce((sum, amount) => sum + amount, 0))} F CFA
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={fee.installments}
                            onChange={(e) => {
                              const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                              updateInstallments(actualIndex, parseInt(e.target.value) || 1);
                            }}
                            className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                            placeholder="Tranches"
                            aria-label={`Nombre de tranches pour ${fee.level}`}
                            min="1"
                            max="12"
                          />
                        </div>
                        
                        {/* Champs de configuration des tranches */}
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-green-200 dark:border-green-800">
                          {Array.from({ length: fee.installments }, (_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16">
                                Tranche {i + 1}:
                              </span>
                              <input
                                type="number"
                                value={fee.amounts[i] || 0}
                                onChange={(e) => {
                                  const actualIndex = tuitionFees.findIndex(f => f.level === fee.level);
                                  updateTuitionAmount(actualIndex, i, parseInt(e.target.value) || 0);
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right text-sm"
                                placeholder="Montant"
                                aria-label={`Montant tranche ${i + 1} pour ${fee.level}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Résumé de la configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frais d'inscription */}
            <div>
              <h5 className="font-medium text-pink-700 dark:text-pink-300 mb-3">Frais d'inscription</h5>
              <div className="space-y-1 text-sm">
                {inscriptionFees.map((fee) => (
                  <div key={fee.level} className="flex justify-between">
                    <span>{fee.level}:</span>
                    <span className="font-medium">{formatAmount(fee.amount)} F CFA</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Frais de réinscription */}
            <div>
              <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-3">Frais de réinscription</h5>
              <div className="space-y-1 text-sm">
                {reinscriptionFees.map((fee) => (
                  <div key={fee.level} className="flex justify-between">
                    <span>{fee.level}:</span>
                    <span className="font-medium">{formatAmount(fee.amount)} F CFA</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Frais de scolarité */}
            <div>
              <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3">Frais de scolarité (Total)</h5>
              <div className="space-y-1 text-sm">
                {tuitionFees.map((fee) => (
                  <div key={fee.level} className="flex justify-between">
                    <span>{fee.level}:</span>
                    <span className="font-medium">{formatAmount(fee.amounts.reduce((sum, amount) => sum + amount, 0))} F CFA</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Important:</strong> Cette configuration sera appliquée automatiquement à tous les élèves 
              pour l'année scolaire {schoolYear} à partir de la date d'application.
            </p>
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default FeeConfigurationModal;