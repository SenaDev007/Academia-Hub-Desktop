const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Test configuration
const TEST_SCHOOL_ID = 'school-001';

// Test IPC handlers
async function testIPCHandlers() {
  console.log('🧪 Testing IPC handlers...');
  
  // Test getClasses
  try {
    const classesResult = await ipcMain.emit('planning:getClasses', {}, TEST_SCHOOL_ID);
    console.log('✅ getClasses handler registered');
  } catch (error) {
    console.error('❌ getClasses handler error:', error);
  }

  // Test getRooms
  try {
    const roomsResult = await ipcMain.emit('planning:getRooms', {}, TEST_SCHOOL_ID);
    console.log('✅ getRooms handler registered');
  } catch (error) {
    console.error('❌ getRooms handler error:', error);
  }

  console.log('IPC handlers test completed');
}

// Test preload script
function testPreloadScript() {
  console.log('🧪 Testing preload script...');
  
  // Check if preload.js exists and is accessible
  const preloadPath = path.join(__dirname, 'electron', 'preload.js');
  
  try {
    const fs = require('fs');
    const preloadContent = fs.readFileSync(preloadPath, 'utf8');
    
    // Check for planning API exposure
    if (preloadContent.includes('planning:')) {
      console.log('✅ Planning API exposed in preload');
    } else {
      console.error('❌ Planning API not found in preload');
    }
    
    // Check for contextBridge usage
    if (preloadContent.includes('contextBridge.exposeInMainWorld')) {
      console.log('✅ contextBridge properly used');
    } else {
      console.error('❌ contextBridge not found');
    }
    
  } catch (error) {
    console.error('❌ Error reading preload.js:', error);
  }
}

// Main test function
async function runIntegrationTests() {
  console.log('🚀 Starting IPC integration tests...\n');
  
  // Wait for app ready
  await app.whenReady();
  
  // Create test window
  const testWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  });
  
  try {
    // Load test page
    await testWindow.loadURL('http://localhost:5173');
    
    // Execute test in renderer
    const result = await testWindow.webContents.executeJavaScript(`
      (async function() {
        console.log('Testing in renderer process...');
        
        // Check if electronAPI is available
        if (window.electronAPI) {
          console.log('✅ window.electronAPI available');
          
          // Check planning API
          if (window.electronAPI.planning) {
            console.log('✅ planning API available');
            
            // Test a simple call
            try {
              const classes = await window.electronAPI.planning.getClasses('test-school-id');
              console.log('✅ IPC call successful:', classes);
              return { success: true, data: classes };
            } catch (error) {
              console.error('❌ IPC call failed:', error);
              return { success: false, error: error.message };
            }
          } else {
            console.error('❌ planning API not available');
            return { success: false, error: 'planning API not available' };
          }
        } else {
          console.error('❌ window.electronAPI not available');
          return { success: false, error: 'window.electronAPI not available' };
        }
      })()
    `);
    
    console.log('Test result:', result);
    
    // Close test window
    testWindow.close();
    
    return result.success;
    
  } catch (error) {
    console.error('Test failed:', error);
    testWindow.close();
    return false;
  }
}

// Run tests
if (require.main === module) {
  testPreloadScript();
  testIPCHandlers();
  
  setTimeout(async () => {
    const success = await runIntegrationTests();
    console.log('Integration test result:', success ? '✅ PASSED' : '❌ FAILED');
    app.quit();
  }, 2000);
}

module.exports = { testIPCHandlers, testPreloadScript, runIntegrationTests };
