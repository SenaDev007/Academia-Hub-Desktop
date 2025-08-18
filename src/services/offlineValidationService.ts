import { ValidationWorkflow, ValidationStep, ValidationStatus } from '../types/validation';
import { dataService } from './dataService';
import { useNotification } from '../hooks/useNotification';

interface OfflineValidationQueue {
  id: string;
  type: 'fiche_pedagogique' | 'cahier_journal' | 'bulletin' | 'attestation';
  itemId: string;
  action: 'validate' | 'reject' | 'approve' | 'sign';
  userId: string;
  userName: string;
  userRole: string;
  timestamp: number;
  data: any;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  error?: string;
}

interface ValidationHistory {
  id: string;
  itemId: string;
  type: string;
  action: string;
  userId: string;
  userName: string;
  role: string;
  timestamp: number;
  comment?: string;
  signature?: string;
  status: 'local' | 'synced';
}

class OfflineValidationService {
  private queue: OfflineValidationQueue[] = [];
  private history: ValidationHistory[] = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline = navigator.onLine;

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.startSyncInterval();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadFromStorage() {
    try {
      const storedQueue = localStorage.getItem('offlineValidationQueue');
      const storedHistory = localStorage.getItem('validationHistory');
      
      if (storedQueue) {
        this.queue = JSON.parse(storedQueue);
      }
      
      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de validation:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('offlineValidationQueue', JSON.stringify(this.queue));
      localStorage.setItem('validationHistory', JSON.stringify(this.history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données de validation:', error);
    }
  }

  private startSyncInterval() {
    // Synchroniser toutes les 30 secondes si en ligne
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.queue.length > 0) {
        this.processQueue();
      }
    }, 30000);
  }

  async addToQueue(
    type: OfflineValidationQueue['type'],
    itemId: string,
    action: OfflineValidationQueue['action'],
    userId: string,
    userName: string,
    userRole: string,
    data: any,
    comment?: string
  ): Promise<string> {
    const validationItem: OfflineValidationQueue = {
      id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      itemId,
      action,
      userId,
      userName,
      userRole,
      timestamp: Date.now(),
      data: {
        ...data,
        comment,
        timestamp: Date.now()
      },
      status: 'pending',
      retryCount: 0
    };

    this.queue.push(validationItem);
    this.saveToStorage();

    // Si en ligne, traiter immédiatement
    if (this.isOnline) {
      await this.processItem(validationItem);
    }

    return validationItem.id;
  }

  private async processQueue() {
    const pendingItems = this.queue.filter(item => item.status === 'pending');
    
    for (const item of pendingItems) {
      await this.processItem(item);
    }
  }

  private async processItem(item: OfflineValidationQueue) {
    try {
      let result;
      
      switch (item.type) {
        case 'fiche_pedagogique':
          result = await this.validateFichePedagogique(item);
          break;
        case 'cahier_journal':
          result = await this.validateCahierJournal(item);
          break;
        case 'bulletin':
          result = await this.validateBulletin(item);
          break;
        case 'attestation':
          result = await this.validateAttestation(item);
          break;
        default:
          throw new Error(`Type de validation non supporté: ${item.type}`);
      }

      if (result.success) {
        // Ajouter à l'historique
        this.addToHistory({
          id: item.id,
          itemId: item.itemId,
          type: item.type,
          action: item.action,
          userId: item.userId,
          userName: item.userName,
          role: item.userRole,
          timestamp: item.timestamp,
          comment: item.data.comment,
          status: 'synced'
        });

        // Retirer de la queue
        this.queue = this.queue.filter(q => q.id !== item.id);
        this.saveToStorage();

        // Notification de succès
        this.notifySuccess(item);
      } else {
        throw new Error(result.error || 'Erreur de validation');
      }
    } catch (error) {
      item.retryCount++;
      item.error = error.message;
      item.status = item.retryCount >= 3 ? 'failed' : 'pending';
      
      this.saveToStorage();
      this.notifyError(item, error.message);
    }
  }

  private async validateFichePedagogique(item: OfflineValidationQueue) {
    const endpoint = `/api/validation/fiche-pedagogique/${item.itemId}/${item.action}`;
    
    try {
      const response = await dataService.post(endpoint, item.data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async validateCahierJournal(item: OfflineValidationQueue) {
    const endpoint = `/api/validation/cahier-journal/${item.itemId}/${item.action}`;
    
    try {
      const response = await dataService.post(endpoint, item.data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async validateBulletin(item: OfflineValidationQueue) {
    const endpoint = `/api/validation/bulletin/${item.itemId}/${item.action}`;
    
    try {
      const response = await dataService.post(endpoint, item.data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async validateAttestation(item: OfflineValidationQueue) {
    const endpoint = `/api/validation/attestation/${item.itemId}/${item.action}`;
    
    try {
      const response = await dataService.post(endpoint, item.data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private addToHistory(historyItem: ValidationHistory) {
    this.history.unshift(historyItem);
    
    // Limiter l'historique aux 1000 dernières entrées
    if (this.history.length > 1000) {
      this.history = this.history.slice(0, 1000);
    }
    
    this.saveToStorage();
  }

  private notifySuccess(item: OfflineValidationQueue) {
    // Utiliser le système de notification
    const event = new CustomEvent('validationSuccess', {
      detail: {
        type: item.type,
        itemId: item.itemId,
        action: item.action,
        message: `${item.type} ${item.action} avec succès`
      }
    });
    
    window.dispatchEvent(event);
  }

  private notifyError(item: OfflineValidationQueue, error: string) {
    const event = new CustomEvent('validationError', {
      detail: {
        type: item.type,
        itemId: item.itemId,
        action: item.action,
        error,
        retryCount: item.retryCount
      }
    });
    
    window.dispatchEvent(event);
  }

  // Méthodes publiques
  getQueue(): OfflineValidationQueue[] {
    return [...this.queue];
  }

  getHistory(limit = 50): ValidationHistory[] {
    return this.history.slice(0, limit);
  }

  getPendingCount(): number {
    return this.queue.filter(item => item.status === 'pending').length;
  }

  getFailedCount(): number {
    return this.queue.filter(item => item.status === 'failed').length;
  }

  clearQueue() {
    this.queue = [];
    this.saveToStorage();
  }

  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }

  retryFailedItems() {
    const failedItems = this.queue.filter(item => item.status === 'failed');
    
    failedItems.forEach(item => {
      item.status = 'pending';
      item.retryCount = 0;
      item.error = undefined;
    });
    
    this.saveToStorage();
    
    if (this.isOnline) {
      this.processQueue();
    }
  }

  forceSync() {
    if (this.isOnline) {
      this.processQueue();
    }
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    window.removeEventListener('online', () => {});
    window.removeEventListener('offline', () => {});
  }
}

// Hook React pour utiliser le service
export const useOfflineValidation = () => {
  const [service] = useState(() => new OfflineValidationService());
  const [queue, setQueue] = useState<OfflineValidationQueue[]>([]);
  const [history, setHistory] = useState<ValidationHistory[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateState = () => {
    setQueue(service.getQueue());
    setHistory(service.getHistory());
    setPendingCount(service.getPendingCount());
    setFailedCount(service.getFailedCount());
  };

  React.useEffect(() => {
    updateState();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleValidationUpdate = () => updateState();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('validationSuccess', handleValidationUpdate);
    window.addEventListener('validationError', handleValidationUpdate);

    // Mise à jour périodique
    const interval = setInterval(updateState, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('validationSuccess', handleValidationUpdate);
      window.removeEventListener('validationError', handleValidationUpdate);
      clearInterval(interval);
      service.destroy();
    };
  }, [service]);

  return {
    service,
    queue,
    history,
    pendingCount,
    failedCount,
    isOnline,
    addToQueue: (type, itemId, action, userId, userName, userRole, data, comment) => 
      service.addToQueue(type, itemId, action, userId, userName, userRole, data, comment),
    retryFailed: () => service.retryFailedItems(),
    forceSync: () => service.forceSync(),
    clearQueue: () => service.clearQueue(),
    clearHistory: () => service.clearHistory()
  };
};

// Instance singleton pour l'utilisation globale
export const offlineValidationService = new OfflineValidationService();
