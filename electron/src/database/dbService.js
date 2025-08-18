import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  init() {
    try {
      // Créer le dossier de données utilisateur si nécessaire
      const userDataPath = app.getPath('userData');
      const dbDir = join(userDataPath, 'database');
      
      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      this.dbPath = join(dbDir, 'academia-hub.db');
      
      // Initialiser la base de données
      this.db = new Database(this.dbPath);
      
      // Activer les contraintes de clés étrangères
      this.db.pragma('foreign_keys = ON');
      
      console.log('Database initialized at:', this.dbPath);
      
      // Créer les tables
      this.createTables();
      
      return this.db;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  createTables() {
    try {
      // Tables principales
      this.createStudentsTable();
      this.createTeachersTable();
      this.createClassesTable();
      this.createSubjectsTable();
      this.createRoomsTable();
      
      // Tables modules
      this.createExamsTables();
      this.createPlanningTables();
      this.createFinanceTables();
      this.createHealthTables();
      
      console.log('All tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  createStudentsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        dateOfBirth TEXT,
        gender TEXT CHECK(gender IN ('M', 'F')),
        address TEXT,
        parentName TEXT,
        parentPhone TEXT,
        parentEmail TEXT,
        classId TEXT,
        registrationNumber TEXT UNIQUE,
        admissionDate TEXT DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'graduated')),
        photo TEXT,
        medicalInfo TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classId) REFERENCES classes(id)
      )
    `;
    this.db.exec(sql);
  }

  createTeachersTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        subjectId TEXT,
        qualification TEXT,
        experience INTEGER,
        hireDate TEXT,
        salary REAL,
        status TEXT DEFAULT 'active',
        address TEXT,
        emergencyContact TEXT,
        photo TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subjectId) REFERENCES subjects(id)
      )
    `;
    this.db.exec(sql);
  }

  createClassesTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        capacity INTEGER,
        teacherId TEXT,
        roomId TEXT,
        academicYear TEXT,
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacherId) REFERENCES teachers(id),
        FOREIGN KEY (roomId) REFERENCES rooms(id)
      )
    `;
    this.db.exec(sql);
  }

  createSubjectsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT UNIQUE,
        description TEXT,
        credits INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.exec(sql);
  }

  createRoomsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        capacity INTEGER,
        type TEXT DEFAULT 'classroom',
        location TEXT,
        equipment TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.exec(sql);
  }

  createExamsTables() {
    // Tables pour le module examens
    const examsSql = `
      CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subjectId TEXT,
        classId TEXT,
        teacherId TEXT,
        date TEXT,
        duration INTEGER,
        maxScore REAL,
        passingScore REAL,
        type TEXT CHECK(type IN ('written', 'oral', 'practical', 'project')),
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subjectId) REFERENCES subjects(id),
        FOREIGN KEY (classId) REFERENCES classes(id),
        FOREIGN KEY (teacherId) REFERENCES teachers(id)
      )
    `;

    const gradesSql = `
      CREATE TABLE IF NOT EXISTS grades (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        examId TEXT,
        score REAL,
        grade TEXT,
        remarks TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id),
        FOREIGN KEY (examId) REFERENCES exams(id)
      )
    `;

    this.db.exec(examsSql);
    this.db.exec(gradesSql);
  }

  createPlanningTables() {
    // Tables pour le module planning
    const schedulesSql = `
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        classId TEXT,
        subjectId TEXT,
        teacherId TEXT,
        roomId TEXT,
        dayOfWeek INTEGER CHECK(dayOfWeek BETWEEN 1 AND 7),
        startTime TEXT,
        endTime TEXT,
        academicYear TEXT,
        term TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classId) REFERENCES classes(id),
        FOREIGN KEY (subjectId) REFERENCES subjects(id),
        FOREIGN KEY (teacherId) REFERENCES teachers(id),
        FOREIGN KEY (roomId) REFERENCES rooms(id)
      )
    `;

    const cahierJournalSql = `
      CREATE TABLE IF NOT EXISTS cahier_journal (
        id TEXT PRIMARY KEY,
        classId TEXT,
        subjectId TEXT,
        teacherId TEXT,
        scheduleId TEXT,
        date TEXT,
        startTime TEXT,
        endTime TEXT,
        content TEXT,
        homework TEXT,
        observations TEXT,
        isValidated INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classId) REFERENCES classes(id),
        FOREIGN KEY (subjectId) REFERENCES subjects(id),
        FOREIGN KEY (teacherId) REFERENCES teachers(id),
        FOREIGN KEY (scheduleId) REFERENCES schedules(id)
      )
    `;

    this.db.exec(schedulesSql);
    this.db.exec(cahierJournalSql);
  }

  createFinanceTables() {
    const paymentsSql = `
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        amount REAL,
        paymentMethod TEXT,
        reference TEXT,
        status TEXT DEFAULT 'pending',
        date TEXT,
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id)
      )
    `;

    this.db.exec(paymentsSql);
  }

  createHealthTables() {
    const medicalRecordsSql = `
      CREATE TABLE IF NOT EXISTS medical_records (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        bloodGroup TEXT,
        allergies TEXT,
        medications TEXT,
        medicalConditions TEXT,
        emergencyContact TEXT,
        doctorName TEXT,
        doctorPhone TEXT,
        notes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id)
      )
    `;

    this.db.exec(medicalRecordsSql);
  }

  // Méthodes de base de données
  query(sql, params = []) {
    try {
      return this.db.prepare(sql).all(params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  run(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.run(params);
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  get(sql, params = []) {
    try {
      return this.db.prepare(sql).get(params);
    } catch (error) {
      console.error('Database get error:', error);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Export singleton
const dbService = new DatabaseService();
export default dbService;
