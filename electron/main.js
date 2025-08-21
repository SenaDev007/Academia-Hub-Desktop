const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const DatabaseManager = require('./database');
const ValidationService = require('./services/validationService');
const SyncService = require('./services/syncService');
const PlanningService = require('./services/planningService');

// Initialize database and services
let db;
let validationService;
let syncService;
let planningService;

// Window reference
let mainWindow;

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../public/icons/icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(async () => {
  try {
    // Initialize database
    db = new DatabaseManager();
    await db.initialize();

    // Initialize services
    validationService = new ValidationService(db);
    syncService = new SyncService(db);
    planningService = new PlanningService(db);
    await syncService.initialize();

    console.log('Database and services initialized successfully');
    createWindow();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    dialog.showErrorBox('Erreur', 'Impossible de démarrer l\'application: ' + error.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for Database Operations
ipcMain.handle('db-query', async (event, sql, params = []) => {
  try {
    const result = db.query(sql, params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get', async (event, sql, params = []) => {
  try {
    const result = db.get(sql, params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database get error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-insert', async (event, table, data) => {
  try {
    const id = db.insert(table, data);
    return { success: true, id };
  } catch (error) {
    console.error('Database insert error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-update', async (event, table, data, where) => {
  try {
    const affected = db.update(table, data, where);
    return { success: true, affected };
  } catch (error) {
    console.error('Database update error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-delete', async (event, table, where) => {
  try {
    const affected = db.delete(table, where);
    return { success: true, affected };
  } catch (error) {
    console.error('Database delete error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-select', async (event, table, where = {}, orderBy = null) => {
  try {
    const result = db.select(table, where, orderBy);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database select error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for Planning Service
ipcMain.handle('planning:getClasses', async (event, schoolId) => {
  try {
    const result = await planningService.getClasses(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get classes error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getClassById', async (event, classId) => {
  try {
    const result = await planningService.getClassById(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get class by id error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createClass', async (event, classData) => {
  try {
    const result = await planningService.createClass(classData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create class error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateClass', async (event, classId, classData) => {
  try {
    const result = await planningService.updateClass(classId, classData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update class error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:deleteClass', async (event, classId) => {
  try {
    const result = await planningService.deleteClass(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Delete class error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getRooms', async (event, schoolId) => {
  try {
    const result = await planningService.getRooms(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get rooms error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getRoomById', async (event, roomId) => {
  try {
    const result = await planningService.getRoomById(roomId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get room by id error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createRoom', async (event, roomData) => {
  try {
    const result = await planningService.createRoom(roomData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create room error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateRoom', async (event, roomId, roomData) => {
  try {
    const result = await planningService.updateRoom(roomId, roomData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update room error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:deleteRoom', async (event, roomId) => {
  try {
    const result = await planningService.deleteRoom(roomId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Delete room error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getSubjects', async (event, schoolId) => {
  try {
    const result = await planningService.getSubjects(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get subjects error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getSubjectById', async (event, subjectId) => {
  try {
    const result = await planningService.getSubjectById(subjectId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get subject by id error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createSubject', async (event, subjectData) => {
  try {
    const result = await planningService.createSubject(subjectData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create subject error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateSubject', async (event, subjectId, subjectData) => {
  try {
    const result = await planningService.updateSubject(subjectId, subjectData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update subject error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:deleteSubject', async (event, subjectId) => {
  try {
    const result = await planningService.deleteSubject(subjectId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Delete subject error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getTeachers', async (event, schoolId) => {
  try {
    const result = await planningService.getTeachers(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get teachers error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getTeacherById', async (event, teacherId) => {
  try {
    const result = await planningService.getTeacherById(teacherId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get teacher by id error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getScheduleEntries', async (event, filters) => {
  try {
    const result = await planningService.getScheduleEntries(filters);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get schedule entries error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createScheduleEntry', async (event, entryData) => {
  try {
    const result = await planningService.createScheduleEntry(entryData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create schedule entry error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateScheduleEntry', async (event, entryId, entryData) => {
  try {
    const result = await planningService.updateScheduleEntry(entryId, entryData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update schedule entry error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:deleteScheduleEntry', async (event, entryId) => {
  try {
    const result = await planningService.deleteScheduleEntry(entryId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Delete schedule entry error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getBreaks', async (event, schoolId) => {
  try {
    const result = await planningService.getBreaks(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get breaks error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createBreak', async (event, breakData) => {
  try {
    const result = await planningService.createBreak(breakData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create break error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateBreak', async (event, breakId, breakData) => {
  try {
    const result = await planningService.updateBreak(breakId, breakData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update break error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:deleteBreak', async (event, breakId) => {
  try {
    const result = await planningService.deleteBreak(breakId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Delete break error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getWorkHoursConfig', async (event, schoolId) => {
  try {
    const result = await planningService.getWorkHoursConfig(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get work hours config error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:createWorkHoursConfig', async (event, configData) => {
  try {
    const result = await planningService.createWorkHoursConfig(configData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Create work hours config error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:updateWorkHoursConfig', async (event, configId, configData) => {
  try {
    const result = await planningService.updateWorkHoursConfig(configId, configData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Update work hours config error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('planning:getPlanningStats', async (event, schoolId) => {
  try {
    const result = await planningService.getPlanningStats(schoolId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Get planning stats error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for File Operations
ipcMain.handle('fs-read-file', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return { success: true, data };
  } catch (error) {
    console.error('File read error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-write-file', async (event, filePath, data) => {
  try {
    await fs.writeFile(filePath, data);
    return { success: true };
  } catch (error) {
    console.error('File write error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-delete-file', async (event, filePath) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error('File delete error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return { success: true, exists: true };
  } catch {
    return { success: true, exists: false };
  }
});

// IPC Handlers for Dialogs
ipcMain.handle('dialog-show-open', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return { success: true, result };
  } catch (error) {
    console.error('Open dialog error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('dialog-show-save', async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return { success: true, result };
  } catch (error) {
    console.error('Save dialog error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('dialog-show-message', async (event, options) => {
  try {
    const result = await dialog.showMessageBox(mainWindow, options);
    return { success: true, result };
  } catch (error) {
    console.error('Message dialog error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for Validation Workflows
ipcMain.handle('validation-create-workflow', async (event, type, referenceId, title, description, steps, createdBy, schoolId) => {
  try {
    const result = await validationService.createWorkflow(type, referenceId, title, description, steps, createdBy, schoolId);
    return result;
  } catch (error) {
    console.error('Validation workflow creation error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-get-pending', async (event, userRole, userId, schoolId) => {
  try {
    const result = await validationService.getPendingWorkflows(userRole, userId, schoolId);
    return result;
  } catch (error) {
    console.error('Get pending workflows error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-get-history', async (event, filters) => {
  try {
    const result = await validationService.getWorkflowHistory(filters);
    return result;
  } catch (error) {
    console.error('Get workflow history error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-get-stats', async (event, schoolId) => {
  try {
    const result = await validationService.getValidationStats(schoolId);
    return result;
  } catch (error) {
    console.error('Get validation stats error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-approve', async (event, workflowId, stepId, validatorId, comment) => {
  try {
    const result = await validationService.approveWorkflow(workflowId, stepId, validatorId, comment);
    return result;
  } catch (error) {
    console.error('Approve workflow error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-reject', async (event, workflowId, stepId, validatorId, comment) => {
  try {
    const result = await validationService.rejectWorkflow(workflowId, stepId, validatorId, comment);
    return result;
  } catch (error) {
    console.error('Reject workflow error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-retry', async (event, workflowId) => {
  try {
    const result = await validationService.retryWorkflow(workflowId);
    return result;
  } catch (error) {
    console.error('Retry workflow error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validation-get-details', async (event, workflowId) => {
  try {
    const result = await validationService.getWorkflowDetails(workflowId);
    return result;
  } catch (error) {
    console.error('Get workflow details error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for Sync Service
ipcMain.handle('sync-get-status', async (event, schoolId) => {
  try {
    const result = await syncService.getSyncStatus(schoolId);
    return result;
  } catch (error) {
    console.error('Get sync status error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-get-history', async (event, filters) => {
  try {
    const result = await syncService.getSyncHistory(filters);
    return result;
  } catch (error) {
    console.error('Get sync history error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-force', async (event, schoolId) => {
  try {
    const result = await syncService.forceSync(schoolId);
    return result;
  } catch (error) {
    console.error('Force sync error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-export', async (event, schoolId) => {
  try {
    const result = await syncService.exportSyncData(schoolId);
    return result;
  } catch (error) {
    console.error('Export sync data error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('sync-clear', async (event, schoolId, olderThanDays) => {
  try {
    const result = await syncService.clearSyncData(schoolId, olderThanDays);
    return result;
  } catch (error) {
    console.error('Clear sync data error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for App Controls
ipcMain.handle('app-get-version', async () => {
  return { success: true, version: app.getVersion() };
});

ipcMain.handle('app-get-path', async (event, name) => {
  try {
    const result = app.getPath(name);
    return { success: true, path: result };
  } catch (error) {
    console.error('Get app path error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('app-restart', async () => {
  try {
    app.relaunch();
    app.quit();
    return { success: true };
  } catch (error) {
    console.error('App restart error:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for Window Controls
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// IPC Handlers for Printing
ipcMain.handle('print', async (event, options) => {
  try {
    const result = await mainWindow.webContents.print(options);
    return { success: true, result };
  } catch (error) {
    console.error('Print error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('print-to-pdf', async (event, options) => {
  try {
    const data = await mainWindow.webContents.printToPDF(options);
    return { success: true, data };
  } catch (error) {
    console.error('Print to PDF error:', error);
    return { success: false, error: error.message };
  }
});

// Handle app updates (placeholder for future implementation)
ipcMain.handle('check-for-updates', async () => {
  return { success: true, updateAvailable: false };
});

ipcMain.handle('download-update', async () => {
  return { success: true, downloading: false };
});

ipcMain.handle('install-update', async () => {
  return { success: true, installed: false };
});

// Graceful shutdown
process.on('beforeExit', () => {
  if (syncService) {
    syncService.stopPeriodicSync();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('Erreur Critique', error.message);
  app.quit();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  dialog.showErrorBox('Erreur Critique', reason.toString());
  app.quit();
});
