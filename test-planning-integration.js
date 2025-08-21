const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Test database setup
const testDbPath = path.join(__dirname, 'test-academia-hub.db');

// Remove existing test database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

// Initialize test database
const db = new sqlite3.Database(testDbPath);

// Test data
const testData = {
  schoolId: 'school-123',
  classes: [
    { id: 'class-1', name: '6ème A', level: '6ème', capacity: 30, school_id: 'school-123' },
    { id: 'class-2', name: '5ème B', level: '5ème', capacity: 28, school_id: 'school-123' }
  ],
  rooms: [
    { id: 'room-1', name: 'Salle 101', type: 'classroom', capacity: 30, school_id: 'school-123' },
    { id: 'room-2', name: 'Labo Info', type: 'lab', capacity: 25, school_id: 'school-123' }
  ],
  subjects: [
    { id: 'subj-1', name: 'Mathématiques', code: 'MATH', color: '#FF6B6B', school_id: 'school-123' },
    { id: 'subj-2', name: 'Français', code: 'FR', color: '#4ECDC4', school_id: 'school-123' }
  ],
  teachers: [
    { id: 'teacher-1', first_name: 'Jean', last_name: 'Dupont', email: 'jean.dupont@school.com', school_id: 'school-123' },
    { id: 'teacher-2', first_name: 'Marie', last_name: 'Martin', email: 'marie.martin@school.com', school_id: 'school-123' }
  ]
};

// Create tables and insert test data
function setupTestDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Create tables
      db.run(`
        CREATE TABLE IF NOT EXISTS classes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          level TEXT NOT NULL,
          capacity INTEGER DEFAULT 30,
          school_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          capacity INTEGER DEFAULT 30,
          school_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS subjects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          code TEXT NOT NULL,
          color TEXT DEFAULT '#000000',
          school_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE,
          school_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS schedule_entries (
          id TEXT PRIMARY KEY,
          day_of_week INTEGER NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          class_id TEXT NOT NULL,
          subject_id TEXT NOT NULL,
          teacher_id TEXT NOT NULL,
          room_id TEXT,
          school_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (class_id) REFERENCES classes(id),
          FOREIGN KEY (subject_id) REFERENCES subjects(id),
          FOREIGN KEY (teacher_id) REFERENCES teachers(id),
          FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
      `);

      // Insert test data
      const insertClass = db.prepare('INSERT INTO classes (id, name, level, capacity, school_id) VALUES (?, ?, ?, ?, ?)');
      const insertRoom = db.prepare('INSERT INTO rooms (id, name, type, capacity, school_id) VALUES (?, ?, ?, ?, ?)');
      const insertSubject = db.prepare('INSERT INTO subjects (id, name, code, color, school_id) VALUES (?, ?, ?, ?, ?)');
      const insertTeacher = db.prepare('INSERT INTO teachers (id, first_name, last_name, email, school_id) VALUES (?, ?, ?, ?, ?)');

      testData.classes.forEach(cls => {
        insertClass.run(cls.id, cls.name, cls.level, cls.capacity, cls.school_id);
      });

      testData.rooms.forEach(room => {
        insertRoom.run(room.id, room.name, room.type, room.capacity, room.school_id);
      });

      testData.subjects.forEach(subject => {
        insertSubject.run(subject.id, subject.name, subject.code, subject.color, subject.school_id);
      });

      testData.teachers.forEach(teacher => {
        insertTeacher.run(teacher.id, teacher.first_name, teacher.last_name, teacher.email, teacher.school_id);
      });

      insertClass.finalize();
      insertRoom.finalize();
      insertSubject.finalize();
      insertTeacher.finalize();

      console.log('Test database setup complete');
      resolve();
    });
  });
}

// Test the PlanningService
async function testPlanningService() {
  try {
    // Import PlanningService
    const PlanningService = require('./electron/services/planningService');
    const DatabaseManager = require('./electron/database');

    // Create database manager with test database
    const testDb = new DatabaseManager();
    testDb.db = db;
    
    // Create planning service
    const planningService = new PlanningService(testDb);

    console.log('Testing PlanningService...');

    // Test getClasses
    const classes = await planningService.getClasses('school-123');
    console.log('Classes:', classes);

    // Test getRooms
    const rooms = await planningService.getRooms('school-123');
    console.log('Rooms:', rooms);

    // Test getSubjects
    const subjects = await planningService.getSubjects('school-123');
    console.log('Subjects:', subjects);

    // Test getTeachers
    const teachers = await planningService.getTeachers('school-123');
    console.log('Teachers:', teachers);

    // Test create new class
    const newClass = await planningService.createClass({
      name: '4ème A',
      level: '4ème',
      capacity: 32,
      school_id: 'school-123'
    });
    console.log('Created class:', newClass);

    // Test update class
    const updatedClass = await planningService.updateClass(newClass.id, {
      name: '4ème A - Updated',
      capacity: 35
    });
    console.log('Updated class:', updatedClass);

    // Test delete class
    const deletedClass = await planningService.deleteClass(newClass.id);
    console.log('Deleted class:', deletedClass);

    console.log('All tests passed successfully!');
    
    // Close database
    db.close();
    
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    db.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  }
}

// Run tests
setupTestDatabase()
  .then(() => testPlanningService())
  .catch(error => {
    console.error('Test setup failed:', error);
    db.close();
  });
