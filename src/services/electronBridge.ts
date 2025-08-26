// Service de pont entre l'interface web et les services Electron
// Fonctionne en mode développement (simulation) et en production (vraies données)

export interface ElectronAPI {
  // Stockage
  getStorageStats: () => Promise<any>;
  getFileStats: () => Promise<any>;
  
  // Cache
  getCacheStats: () => Promise<any>;
  clearCache: () => Promise<void>;
  
  // Synchronisation
  getSyncStats: () => Promise<any>;
  forceSync: () => Promise<void>;
  getSyncQueue: () => Promise<any[]>;
  
  // Fichiers
  analyzeDiskSpace: () => Promise<any>;
  cleanupOldFiles: () => Promise<void>;
  
  // Système
  checkIntegrity: () => Promise<any>;
  exportMetrics: () => Promise<any>;
  cleanupLogs: () => Promise<void>;
  getAdvancedSettings: () => Promise<any>;
}

class ElectronBridge {
  private static instance: ElectronBridge;
  private isElectron: boolean;
  private electronAPI: ElectronAPI | null = null;

  private constructor() {
    this.isElectron = this.detectElectron();
    this.initializeAPI();
  }

  static getInstance(): ElectronBridge {
    if (!ElectronBridge.instance) {
      ElectronBridge.instance = new ElectronBridge();
    }
    return ElectronBridge.instance;
  }

  // Détecter si on est dans Electron
  private detectElectron(): boolean {
    return !!(window as any).electronAPI || 
           !!(window as any).require || 
           navigator.userAgent.includes('Electron');
  }

  // Initialiser l'API selon l'environnement
  private initializeAPI(): void {
    if (this.isElectron) {
      // En production Electron
      this.electronAPI = (window as any).electronAPI;
    } else {
      // En développement web
      this.electronAPI = this.createMockAPI();
    }
  }

  // Créer une API simulée pour le développement
  private createMockAPI(): ElectronAPI {
    return {
      getStorageStats: async () => ({
        sqlite: { totalSize: 2.1 * 1024 * 1024 * 1024, totalItems: 1547, tables: {} },
        files: { totalSize: 4.8 * 1024 * 1024 * 1024, totalFiles: 1890, categories: {} },
        overall: { totalSize: 6.9 * 1024 * 1024 * 1024, totalItems: 3437, compressionRatio: 0.32 }
      }),
      
      getFileStats: async () => ({
        studentPhotos: { count: 487, size: 2.1 * 1024 * 1024 * 1024, optimized: 487 },
        documents: { count: 1247, size: 1.8 * 1024 * 1024 * 1024, compressed: 1247 },
        reports: { count: 89, size: 0.9 * 1024 * 1024 * 1024, archived: 67 },
        attachments: { count: 156, size: 0.2 * 1024 * 1024 * 1024, pending: 12 }
      }),
      
      getCacheStats: async () => ({
        totalSize: 156 * 1024 * 1024,
        itemCount: 234,
        hitRate: 94.2,
        strategyStats: {
          frequent: { count: 87, size: 45 * 1024 * 1024 },
          normal: { count: 156, size: 98 * 1024 * 1024 },
          rare: { count: 23, size: 13 * 1024 * 1024 }
        }
      }),
      
      clearCache: async () => {
        console.log('Mock: Cache cleared');
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      
      getSyncStats: async () => ({
        totalItems: 24,
        pendingItems: 3,
        completedItems: 21,
        failedItems: 0,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        syncDuration: 45,
        conflicts: 0,
        errors: 0
      }),
      
      forceSync: async () => {
        console.log('Mock: Sync forced');
        await new Promise(resolve => setTimeout(resolve, 2000));
      },
      
      getSyncQueue: async () => [
        { id: 1, type: 'student', action: 'update', status: 'pending' },
        { id: 2, type: 'payment', action: 'create', status: 'pending' },
        { id: 3, type: 'attendance', action: 'sync', status: 'pending' }
      ],
      
      analyzeDiskSpace: async () => ({
        totalUsed: 6.9 * 1024 * 1024 * 1024,
        breakdown: {
          sqlite: 2.1 * 1024 * 1024 * 1024,
          cache: 156 * 1024 * 1024,
          files: 4.8 * 1024 * 1024 * 1024
        },
        recommendations: [
          'Le cache est presque plein. Considérez nettoyer les données anciennes.',
          'Les photos d\'élèves prennent beaucoup d\'espace. Activez la compression automatique.'
        ]
      }),
      
      cleanupOldFiles: async () => {
        console.log('Mock: Old files cleanup initiated');
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      
      checkIntegrity: async () => ({
        storage: { sqlite: true, cache: true, files: true },
        sync: { online: true, queueHealthy: true, lastSync: new Date() },
        overall: 'healthy'
      }),
      
      exportMetrics: async () => ({
        timestamp: new Date().toISOString(),
        storage: await this.createMockAPI().getStorageStats(),
        sync: await this.createMockAPI().getSyncStats(),
        performance: await this.createMockAPI().getCacheStats(),
        files: await this.createMockAPI().getFileStats()
      }),
      
      cleanupLogs: async () => {
        console.log('Mock: Logs cleanup initiated');
        await new Promise(resolve => setTimeout(resolve, 800));
      },
      
      getAdvancedSettings: async () => ({
        sync: { autoSync: true, syncInterval: 5 * 60 * 1000, retryAttempts: 3 },
        cache: { maxSize: 500 * 1024 * 1024, cleanupInterval: 30 * 60 * 1000, strategies: ['frequent', 'normal', 'rare'] },
        storage: { compressionEnabled: true, imageOptimization: true, maxFileSize: 100 * 1024 * 1024 }
      })
    };
  }

  // Méthodes publiques qui utilisent l'API appropriée
  async getStorageStats() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getStorageStats();
  }

  async getFileStats() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getFileStats();
  }

  async getCacheStats() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getCacheStats();
  }

  async clearCache() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.clearCache();
  }

  async getSyncStats() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getSyncStats();
  }

  async forceSync() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.forceSync();
  }

  async getSyncQueue() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getSyncQueue();
  }

  async analyzeDiskSpace() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.analyzeDiskSpace();
  }

  async cleanupOldFiles() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.cleanupOldFiles();
  }

  async checkIntegrity() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.checkIntegrity();
  }

  async exportMetrics() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.exportMetrics();
  }

  async cleanupLogs() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.cleanupLogs();
  }

  async getAdvancedSettings() {
    if (!this.electronAPI) {
      throw new Error('API not initialized');
    }
    return await this.electronAPI.getAdvancedSettings();
  }

  // Utilitaires
  isElectronEnvironment(): boolean {
    return this.isElectron;
  }

  getEnvironmentInfo(): string {
    return this.isElectron ? 'Electron (Production)' : 'Web Browser (Development)';
  }
}

export const electronBridge = ElectronBridge.getInstance();
