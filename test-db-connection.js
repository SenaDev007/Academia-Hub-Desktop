import { ipcRenderer } from 'electron';

// Simuler ipcRenderer pour le test
const mockIpcRenderer = {
  invoke: async (channel, ...args) => {
    console.log(`Mock IPC call: ${channel}`, args);
    
    // Mock responses for different channels
    switch (channel) {
      case 'database-query':
        const [query, params] = args;
        console.log('Query:', query);
        console.log('Params:', params);
        
        // Mock student data
        if (query.includes('FROM students')) {
          return [
            {
              id: 'stu-001',
              firstName: 'Marie',
              lastName: 'Dubois',
              email: 'marie.dubois@email.com',
              phone: '06 12 34 56 78',
              dateOfBirth: '2010-05-15',
              className: '3ème A',
              enrollmentDate: '2023-09-01',
              status: 'active',
              parentName: 'Jean Dubois',
              parentPhone: '06 98 76 54 32',
              medicalInfo: 'Aucune allergie connue',
              registrationNumber: 'MAT-2024-00001',
              fees: 'paid',
              age: 14
            },
            {
              id: 'stu-002',
              firstName: 'Pierre',
              lastName: 'Martin',
              email: 'pierre.martin@email.com',
              phone: '06 11 22 33 44',
              dateOfBirth: '2009-08-22',
              className: '2nde B',
              enrollmentDate: '2023-09-01',
              status: 'active',
              parentName: 'Sophie Martin',
              parentPhone: '06 55 66 77 88',
              medicalInfo: 'Asthme léger',
              registrationNumber: 'MAT-2024-00002',
              fees: 'pending',
              age: 15
            }
          ];
        }
        
        // Mock classes data
        if (query.includes('FROM classes')) {
          return [
            { id: 'class-001', name: '6ème A', level: '6ème' },
            { id: 'class-002', name: '5ème B', level: '5ème' },
            { id: 'class-003', name: '4ème C', level: '4ème' },
            { id: 'class-004', name: '3ème A', level: '3ème' },
            { id: 'class-005', name: '2nde B', level: '2nde' },
            { id: 'class-006', name: '1ère C', level: '1ère' }
          ];
        }
        
        return [];
        
      case 'database-get':
        return {
          id: 'stu-001',
          firstName: 'Marie',
          lastName: 'Dubois',
          email: 'marie.dubois@email.com',
          phone: '06 12 34 56 78',
          dateOfBirth: '2010-05-15',
          className: '3ème A',
          enrollmentDate: '2023-09-01',
          status: 'active',
          parentName: 'Jean Dubois',
          parentPhone: '06 98 76 54 32',
          medicalInfo: 'Aucune allergie connue',
          registrationNumber: 'MAT-2024-00001'
        };
        
      case 'database-run':
        console.log('Database run:', args);
        return { lastID: 1, changes: 1 };
        
      default:
        return null;
    }
  }
};

// Test the student service
async function testStudentService() {
  console.log('Testing student service...');
  
  try {
    // Mock the ipcRenderer for testing
    global.ipcRenderer = mockIpcRenderer;
    
    // Import the service
    const { studentService } = await import('./src/services/studentService.js');
    
    console.log('Testing getAllStudents...');
    const students = await studentService.getAllStudents();
    console.log('Students:', students);
    
    console.log('Testing getClasses...');
    const classes = await studentService.getClasses();
    console.log('Classes:', classes);
    
    console.log('Testing getEnrollmentStats...');
    const stats = await studentService.getEnrollmentStats();
    console.log('Stats:', stats);
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
if (typeof window === 'undefined') {
  testStudentService();
}
