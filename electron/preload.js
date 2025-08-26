const { contextBridge, ipcRenderer } = require('electron');

// Exposer l'API Electron de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
  // Stockage
  getStorageStats: () => ipcRenderer.invoke('get-storage-stats'),
  getFileStats: () => ipcRenderer.invoke('get-file-stats'),
  
  // Cache
  getCacheStats: () => ipcRenderer.invoke('get-cache-stats'),
  clearCache: () => ipcRenderer.invoke('clear-cache'),
  
  // Synchronisation
  getSyncStats: () => ipcRenderer.invoke('get-sync-stats'),
  forceSync: () => ipcRenderer.invoke('force-sync'),
  getSyncQueue: () => ipcRenderer.invoke('get-sync-queue'),
  
  // Fichiers
  analyzeDiskSpace: () => ipcRenderer.invoke('analyze-disk-space'),
  cleanupOldFiles: () => ipcRenderer.invoke('cleanup-old-files'),
  
  // Système
  checkIntegrity: () => ipcRenderer.invoke('check-integrity'),
  exportMetrics: () => ipcRenderer.invoke('export-metrics'),
  cleanupLogs: () => ipcRenderer.invoke('cleanup-logs'),
  getAdvancedSettings: () => ipcRenderer.invoke('get-advanced-settings'),
  
  // Utilitaires
  getEnvironmentInfo: () => 'Electron (Production)',
  isElectronEnvironment: () => true
});

// Gestion des erreurs
window.addEventListener('error', (event) => {
  console.error('Preload error:', event.error);
});

// Gestion des rejets de promesses non gérés
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
