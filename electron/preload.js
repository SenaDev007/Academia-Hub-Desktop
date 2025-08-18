const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialogs
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:open', options),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:save', options),
  showMessageBox: (options) => ipcRenderer.invoke('dialog:message', options),

  // Database operations
  db: {
    query: (sql, params) => ipcRenderer.invoke('db:query', sql, params),
    insert: (table, data) => ipcRenderer.invoke('db:insert', table, data),
    update: (table, data, where) => ipcRenderer.invoke('db:update', table, data, where),
    delete: (table, where) => ipcRenderer.invoke('db:delete', table, where),
    select: (table, where, orderBy) => ipcRenderer.invoke('db:select', table, where, orderBy),
  },

  // File operations
  file: {
    read: (filePath) => ipcRenderer.invoke('file:read', filePath),
    write: (filePath, data) => ipcRenderer.invoke('file:write', filePath, data),
    exists: (filePath) => ipcRenderer.invoke('file:exists', filePath),
    delete: (filePath) => ipcRenderer.invoke('file:delete', filePath),
    getPath: (name) => ipcRenderer.invoke('file:get-path', name),
  },

  // App operations
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getName: () => ipcRenderer.invoke('app:get-name'),
    quit: () => ipcRenderer.invoke('app:quit'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
  },

  // Window operations
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    setFullScreen: (flag) => ipcRenderer.invoke('window:set-fullscreen', flag),
    isFullScreen: () => ipcRenderer.invoke('window:is-fullscreen'),
  },

  // Print operations
  print: {
    printPDF: (options) => ipcRenderer.invoke('print:pdf', options),
    printHTML: (html, options) => ipcRenderer.invoke('print:html', html, options),
  },

  // Update operations
  update: {
    check: () => ipcRenderer.invoke('update:check'),
    download: () => ipcRenderer.invoke('update:download'),
    install: () => ipcRenderer.invoke('update:install'),
    onUpdateAvailable: (callback) => ipcRenderer.on('update:available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update:downloaded', callback),
  },

  // Validation workflows
  validation: {
    getPending: () => ipcRenderer.invoke('validation:get-pending'),
    getHistory: () => ipcRenderer.invoke('validation:get-history'),
    getStats: () => ipcRenderer.invoke('validation:get-stats'),
    approve: (workflowId, stepId, comment) => ipcRenderer.invoke('validation:approve', workflowId, stepId, comment),
    reject: (workflowId, stepId, comment) => ipcRenderer.invoke('validation:reject', workflowId, stepId, comment),
    retry: (workflowId) => ipcRenderer.invoke('validation:retry', workflowId),
  },

  // Offline sync
  sync: {
    getStatus: () => ipcRenderer.invoke('sync:get-status'),
    startSync: () => ipcRenderer.invoke('sync:start'),
    stopSync: () => ipcRenderer.invoke('sync:stop'),
    onStatusChange: (callback) => ipcRenderer.on('sync:status-change', callback),
  },

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Security: Prevent direct access to node modules
delete window.require;
delete window.exports;
delete window.module;
