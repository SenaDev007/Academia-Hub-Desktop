import { useState, useEffect, useCallback } from 'react';
import { OfflineValidationService } from '../services/offlineValidationService';
import { ValidationWorkflow, ValidationStats, ValidationFilters } from '../types/validation';

const validationService = OfflineValidationService.getInstance();

export const useOfflineValidation = () => {
  const [queue, setQueue] = useState<ValidationWorkflow[]>([]);
  const [history, setHistory] = useState<ValidationWorkflow[]>([]);
  const [stats, setStats] = useState<ValidationStats>({
    totalWorkflows: 0,
    pendingValidations: 0,
    approvedWorkflows: 0,
    rejectedWorkflows: 0,
    averageValidationTime: 0,
    validationByRole: {},
    validationByType: {}
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Mettre à jour l'état de connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Charger les données initiales
  const loadData = useCallback(() => {
    setQueue(validationService.getQueue());
    setHistory(validationService.getHistory());
    setStats(validationService.getStats());
    setLastSync(validationService.getLastSync());
  }, []);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Écouter les événements du service
  useEffect(() => {
    const handleQueueUpdate = () => {
      setQueue(validationService.getQueue());
      setStats(validationService.getStats());
    };

    const handleHistoryUpdate = () => {
      setHistory(validationService.getHistory());
      setStats(validationService.getStats());
    };

    const handleSyncStart = () => setIsSyncing(true);
    const handleSyncEnd = () => {
      setIsSyncing(false);
      setLastSync(validationService.getLastSync());
      loadData();
    };

    validationService.on('queueUpdate', handleQueueUpdate);
    validationService.on('historyUpdate', handleHistoryUpdate);
    validationService.on('syncStart', handleSyncStart);
    validationService.on('syncEnd', handleSyncEnd);

    return () => {
      validationService.off('queueUpdate', handleQueueUpdate);
      validationService.off('historyUpdate', handleHistoryUpdate);
      validationService.off('syncStart', handleSyncStart);
      validationService.off('syncEnd', handleSyncEnd);
    };
  }, [loadData]);

  // Synchroniser automatiquement quand en ligne
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      const timer = setTimeout(() => {
        validationService.sync();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, queue.length]);

  const addValidation = useCallback(async (workflow: ValidationWorkflow, action: 'validate' | 'reject' | 'approve' | 'sign', comment?: string) => {
    try {
      await validationService.addValidation({
        id: workflow.id,
        type: workflow.type,
        itemId: workflow.itemId,
        action,
        userId: 'current-user-id', // À remplacer par l'utilisateur connecté
        userName: 'Utilisateur actuel', // À remplacer par le nom réel
        comment
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la validation:', error);
      throw error;
    }
  }, []);

  const retryValidation = useCallback(async (workflowId: string) => {
    try {
      await validationService.retry(workflowId);
      return true;
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
      throw error;
    }
  }, []);

  const forceSync = useCallback(async () => {
    try {
      await validationService.sync();
      return true;
    } catch (error) {
      console.error('Erreur lors de la synchronisation forcée:', error);
      throw error;
    }
  }, []);

  const clearQueue = useCallback(() => {
    validationService.clearQueue();
  }, []);

  const clearHistory = useCallback(() => {
    validationService.clearHistory();
  }, []);

  const getWorkflow = useCallback((id: string) => {
    return validationService.getWorkflow(id);
  }, []);

  const searchWorkflows = useCallback((filters: ValidationFilters) => {
    return validationService.searchWorkflows(filters);
  }, []);

  const exportData = useCallback(() => {
    return validationService.exportData();
  }, []);

  const importData = useCallback((data: any) => {
    return validationService.importData(data);
  }, []);

  return {
    queue,
    history,
    stats,
    isOnline,
    isSyncing,
    lastSync,
    addValidation,
    retryValidation,
    forceSync,
    clearQueue,
    clearHistory,
    getWorkflow,
    searchWorkflows,
    exportData,
    importData,
    loadData
  };
};
