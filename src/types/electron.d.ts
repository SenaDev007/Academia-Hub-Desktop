// Déclaration globale pour les APIs Electron exposées
export interface ElectronAPI {
  // Dialogs
  showOpenDialog: (options: any) => Promise<any>;
  showSaveDialog: (options: any) => Promise<any>;
  showMessageBox: (options: any) => Promise<any>;

  // Database operations
  db: {
    query: (sql: string, params?: any[]) => Promise<any>;
    insert: (table: string, data: any) => Promise<any>;
    update: (table: string, data: any, where: any) => Promise<any>;
    delete: (table: string, where: any) => Promise<any>;
    select: (table: string, where?: any, orderBy?: string) => Promise<any>;
  };

  // File operations
  file: {
    read: (filePath: string) => Promise<any>;
    write: (filePath: string, data: string) => Promise<any>;
    exists: (filePath: string) => Promise<any>;
    delete: (filePath: string) => Promise<any>;
    getPath: (name: string) => Promise<any>;
  };

  // App operations
  app: {
    getVersion: () => Promise<any>;
    getName: () => Promise<any>;
    quit: () => Promise<any>;
    relaunch: () => Promise<any>;
  };

  // Window operations
  window: {
    minimize: () => Promise<any>;
    maximize: () => Promise<any>;
    close: () => Promise<any>;
    setFullScreen: (flag: boolean) => Promise<any>;
    isFullScreen: () => Promise<any>;
  };

  // Print operations
  print: {
    printPDF: (options: any) => Promise<any>;
    printHTML: (html: string, options: any) => Promise<any>;
  };

  // Update operations
  update: {
    check: () => Promise<any>;
    download: () => Promise<any>;
    install: () => Promise<any>;
    onUpdateAvailable: (callback: any) => void;
    onUpdateDownloaded: (callback: any) => void;
  };

  // Validation workflows
  validation: {
    getPending: () => Promise<any>;
    getHistory: () => Promise<any>;
    getStats: () => Promise<any>;
    approve: (workflowId: string, stepId: string, comment: string) => Promise<any>;
    reject: (workflowId: string, stepId: string, comment: string) => Promise<any>;
    retry: (workflowId: string) => Promise<any>;
  };

  // Planning Service
  planning: {
    getClasses: (schoolId: string) => Promise<any>;
    getClassById: (classId: string) => Promise<any>;
    createClass: (classData: any) => Promise<any>;
    updateClass: (classId: string, classData: any) => Promise<any>;
    deleteClass: (classId: string) => Promise<any>;
    
    getRooms: (schoolId: string) => Promise<any>;
    getRoomById: (roomId: string) => Promise<any>;
    createRoom: (roomData: any) => Promise<any>;
    updateRoom: (roomId: string, roomData: any) => Promise<any>;
    deleteRoom: (roomId: string) => Promise<any>;
    
    getSubjects: (schoolId: string) => Promise<any>;
    getSubjectById: (subjectId: string) => Promise<any>;
    createSubject: (subjectData: any) => Promise<any>;
    updateSubject: (subjectId: string, subjectData: any) => Promise<any>;
    deleteSubject: (subjectId: string) => Promise<any>;
    
    getTeachers: (schoolId: string) => Promise<any>;
    getTeacherById: (teacherId: string) => Promise<any>;
    
    getScheduleEntries: (filters: any) => Promise<any>;
    createScheduleEntry: (entryData: any) => Promise<any>;
    updateScheduleEntry: (entryId: string, entryData: any) => Promise<any>;
    deleteScheduleEntry: (entryId: string) => Promise<any>;
    
    getBreaks: (schoolId: string) => Promise<any>;
    createBreak: (breakData: any) => Promise<any>;
    updateBreak: (breakId: string, breakData: any) => Promise<any>;
    deleteBreak: (breakId: string) => Promise<any>;
    
    getWorkHoursConfig: (schoolId: string) => Promise<any>;
    createWorkHoursConfig: (configData: any) => Promise<any>;
    updateWorkHoursConfig: (configId: string, configData: any) => Promise<any>;
    
    getPlanningStats: (schoolId: string) => Promise<any>;
  };

  // Offline sync
  sync: {
    getStatus: () => Promise<any>;
    startSync: () => Promise<any>;
    stopSync: () => Promise<any>;
    onStatusChange: (callback: any) => void;
  };

  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
