// Utilitaire de débogage pour vérifier l'accès aux APIs Electron
export const debugElectronAPI = () => {
  console.log('=== Debug Electron API ===');
  console.log('window.electronAPI exists:', !!window.electronAPI);
  
  if (window.electronAPI) {
    console.log('Available methods:');
    console.log('- planning:', !!window.electronAPI.planning);
    console.log('- db:', !!window.electronAPI.db);
    console.log('- file:', !!window.electronAPI.file);
    console.log('- validation:', !!window.electronAPI.validation);
    
    if (window.electronAPI.planning) {
      console.log('Planning methods:');
      console.log('- getClasses:', typeof window.electronAPI.planning.getClasses);
      console.log('- getRooms:', typeof window.electronAPI.planning.getRooms);
      console.log('- getSubjects:', typeof window.electronAPI.planning.getSubjects);
    }
  } else {
    console.error('window.electronAPI is undefined!');
    console.log('window object:', Object.keys(window));
  }
};

// Test function to check IPC communication
export const testIPCCommunication = async () => {
  try {
    debugElectronAPI();
    
    if (window.electronAPI?.planning) {
      console.log('Testing IPC call...');
      const result = await window.electronAPI.planning.getClasses('test-school-id');
      console.log('IPC test result:', result);
      return true;
    } else {
      console.error('Cannot test IPC - planning API not available');
      return false;
    }
  } catch (error) {
    console.error('IPC test failed:', error);
    return false;
  }
};
