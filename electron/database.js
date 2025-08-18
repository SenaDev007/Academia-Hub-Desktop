const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  initialize() {
    try {
      // Get user data path
      const userDataPath = require('electron').app.getPath('userData');
      this.dbPath = path.join(userDataPath, 'academia-hub.db');

      // Ensure directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Initialize database
      this.db = new Database(this.dbPath);
      
      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');
      
      // Create tables
      this.createTables();
      
      console.log('Database initialized at:', this.dbPath);
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  }

  createTables() {
    try {
      // Users table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          role TEXT NOT NULL,
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Schools table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS schools (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT,
          logo TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Students table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          matricule TEXT UNIQUE,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          birth_date DATE,
          gender TEXT,
          address TEXT,
          class_id TEXT,
          enrollment_date DATE DEFAULT CURRENT_DATE,
          status TEXT DEFAULT 'active',
          parent_name TEXT,
          parent_phone TEXT,
          medical_info TEXT,
          photo TEXT,
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (class_id) REFERENCES classes(id)
        )
      `);

      // Classes table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS classes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          level TEXT,
          capacity INTEGER,
          teacher_id TEXT,
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacher_id) REFERENCES users(id)
        )
      `);

      // Teachers table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          user_id TEXT UNIQUE,
          matricule TEXT UNIQUE,
          specialization TEXT,
          hire_date DATE,
          salary REAL,
          status TEXT DEFAULT 'active',
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Validation workflows table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS validation_workflows (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          reference_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          current_step INTEGER DEFAULT 1,
          total_steps INTEGER DEFAULT 1,
          created_by TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          school_id TEXT
        )
      `);

      // Validation steps table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS validation_steps (
          id TEXT PRIMARY KEY,
          workflow_id TEXT NOT NULL,
          step_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          validator_role TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          validator_id TEXT,
          comment TEXT,
          validated_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workflow_id) REFERENCES validation_workflows(id) ON DELETE CASCADE
        )
      `);

      // Finance tables
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS fee_structures (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          class_id TEXT,
          academic_year_id TEXT,
          term_id TEXT,
          description TEXT,
          due_date DATE,
          is_active BOOLEAN DEFAULT 1,
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL,
          amount REAL NOT NULL,
          payment_method TEXT NOT NULL,
          reference TEXT,
          status TEXT DEFAULT 'pending',
          date DATE DEFAULT CURRENT_DATE,
          description TEXT,
          school_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id)
        )
      `);

      // Indexes for performance
      this.createIndexes();
      
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id)',
      'CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id)',
      'CREATE INDEX IF NOT EXISTS idx_students_status ON students(status)',
      'CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id)',
      'CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id)',
      'CREATE INDEX IF NOT EXISTS idx_validation_workflows_status ON validation_workflows(status)',
      'CREATE INDEX IF NOT EXISTS idx_validation_workflows_type ON validation_workflows(type)',
      'CREATE INDEX IF NOT EXISTS idx_validation_steps_workflow ON validation_steps(workflow_id)',
      'CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id)',
      'CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date)',
    ];

    indexes.forEach(index => {
      try {
        this.db.exec(index);
      } catch (error) {
        console.warn('Failed to create index:', index, error);
      }
    });
  }

  query(sql, params = []) {
    try {
      return this.db.prepare(sql).all(...params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  run(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      return { 
        lastInsertRowid: result.lastInsertRowid,
        changes: result.changes 
      };
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  get(sql, params = []) {
    try {
      return this.db.prepare(sql).get(...params);
    } catch (error) {
      console.error('Database get error:', error);
      throw error;
    }
  }

  insert(table, data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    return this.run(sql, Object.values(data));
  }

  update(table, data, where = {}) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(',');
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const sql = `UPDATE ${table} SET ${setClause}${whereClause ? ' WHERE ' + whereClause : ''}`;
    return this.run(sql, [...Object.values(data), ...Object.values(where)]);
  }

  delete(table, where = {}) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const sql = `DELETE FROM ${table}${whereClause ? ' WHERE ' + whereClause : ''}`;
    return this.run(sql, Object.values(where));
  }

  select(table, where = {}, orderBy = null) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const orderByClause = orderBy ? ` ORDER BY ${orderBy}` : '';
    const sql = `SELECT * FROM ${table}${whereClause ? ' WHERE ' + whereClause : ''}${orderByClause}`;
    return this.query(sql, Object.values(where));
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }

  backup(backupPath) {
    try {
      const backup = new Database(backupPath);
      this.db.backup(backup, {
        progress({ totalPages, remainingPages }) {
          console.log(`Backup progress: ${totalPages - remainingPages}/${totalPages} pages`);
        }
      });
      backup.close();
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  getDatabasePath() {
    return this.dbPath;
  }

  getDatabaseSize() {
    try {
      const stats = fs.statSync(this.dbPath);
      return stats.size;
    } catch (error) {
      console.error('Failed to get database size:', error);
      return 0;
    }
  }
}

module.exports = DatabaseManager;
