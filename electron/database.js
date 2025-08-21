const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
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
        this.db = new sqlite3.Database(this.dbPath, (err) => {
          if (err) {
            console.error('Database initialization error:', err);
            reject(err);
          } else {
            console.log('Database initialized at:', this.dbPath);
            this.createTables().then(() => {
              resolve(true);
            }).catch(reject);
          }
        });
      } catch (error) {
        console.error('Failed to initialize database:', error);
        reject(error);
      }
    });
  }

  createTables() {
    return new Promise((resolve, reject) => {
      try {
        // Enable foreign keys
        this.db.run('PRAGMA foreign_keys = ON');

        // Users table
        this.db.run(`
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
        this.db.run(`
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
        this.db.run(`
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
        this.db.run(`
          CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            level TEXT,
            capacity INTEGER,
            teacher_id TEXT,
            school_id TEXT,
            room_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES users(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
          )
        `);

        // Teachers table
        this.db.run(`
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

        // Rooms table for planning
        this.db.run(`
          CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            capacity INTEGER,
            equipment TEXT,
            status TEXT DEFAULT 'available',
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Subjects table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE,
            level TEXT,
            coefficient INTEGER DEFAULT 1,
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Schedule entries table (emploi du temps)
        this.db.run(`
          CREATE TABLE IF NOT EXISTS schedule_entries (
            id TEXT PRIMARY KEY,
            day_of_week INTEGER NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            subject_id TEXT NOT NULL,
            teacher_id TEXT NOT NULL,
            class_id TEXT NOT NULL,
            room_id TEXT,
            duration_minutes INTEGER,
            week_type TEXT DEFAULT 'all',
            academic_year_id TEXT,
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects(id),
            FOREIGN KEY (teacher_id) REFERENCES teachers(id),
            FOREIGN KEY (class_id) REFERENCES classes(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
          )
        `);

        // Breaks configuration
        this.db.run(`
          CREATE TABLE IF NOT EXISTS breaks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            duration_minutes INTEGER,
            levels TEXT,
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Work hours configuration
        this.db.run(`
          CREATE TABLE IF NOT EXISTS work_hours_config (
            id TEXT PRIMARY KEY,
            school_id TEXT,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            lunch_break_start TIME,
            lunch_break_end TIME,
            course_duration_minutes INTEGER DEFAULT 60,
            break_between_courses_minutes INTEGER DEFAULT 5,
            work_days TEXT DEFAULT '[1,2,3,4,5]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Room reservations
        this.db.run(`
          CREATE TABLE IF NOT EXISTS room_reservations (
            id TEXT PRIMARY KEY,
            room_id TEXT NOT NULL,
            teacher_id TEXT,
            title TEXT NOT NULL,
            description TEXT,
            start_datetime DATETIME NOT NULL,
            end_datetime DATETIME NOT NULL,
            status TEXT DEFAULT 'pending',
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms(id),
            FOREIGN KEY (teacher_id) REFERENCES teachers(id)
          )
        `);

        // Teacher assignments
        this.db.run(`
          CREATE TABLE IF NOT EXISTS teacher_assignments (
            id TEXT PRIMARY KEY,
            teacher_id TEXT NOT NULL,
            subject_id TEXT NOT NULL,
            class_id TEXT NOT NULL,
            hours_per_week INTEGER,
            academic_year_id TEXT,
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES teachers(id),
            FOREIGN KEY (subject_id) REFERENCES subjects(id),
            FOREIGN KEY (class_id) REFERENCES classes(id)
          )
        `);

        // Teacher availability
        this.db.run(`
          CREATE TABLE IF NOT EXISTS teacher_availability (
            id TEXT PRIMARY KEY,
            teacher_id TEXT NOT NULL,
            day_of_week INTEGER NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            is_available BOOLEAN DEFAULT 1,
            school_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (teacher_id) REFERENCES teachers(id)
          )
        `);

        // Validation workflows table
        this.db.run(`
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
        this.db.run(`
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
        this.db.run(`
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

        this.db.run(`
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

        // Create indexes
        this.createIndexes().then(() => {
          console.log('Database tables created successfully');
          resolve();
        }).catch(reject);

      } catch (error) {
        console.error('Failed to create tables:', error);
        reject(error);
      }
    });
  }

  createIndexes() {
    return new Promise((resolve, reject) => {
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id)',
        'CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_students_status ON students(status)',
        'CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id)',
        'CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_classes_room ON classes(room_id)',
        'CREATE INDEX IF NOT EXISTS idx_validation_workflows_status ON validation_workflows(status)',
        'CREATE INDEX IF NOT EXISTS idx_validation_workflows_type ON validation_workflows(type)',
        'CREATE INDEX IF NOT EXISTS idx_validation_steps_workflow ON validation_steps(workflow_id)',
        'CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id)',
        'CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date)',
        // Planning indexes
        'CREATE INDEX IF NOT EXISTS idx_rooms_school ON rooms(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status)',
        'CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_schedule_entries_school ON schedule_entries(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_schedule_entries_class ON schedule_entries(class_id)',
        'CREATE INDEX IF NOT EXISTS idx_schedule_entries_teacher ON schedule_entries(teacher_id)',
        'CREATE INDEX IF NOT EXISTS idx_schedule_entries_room ON schedule_entries(room_id)',
        'CREATE INDEX IF NOT EXISTS idx_schedule_entries_day ON schedule_entries(day_of_week)',
        'CREATE INDEX IF NOT EXISTS idx_breaks_school ON breaks(school_id)',
        'CREATE INDEX IF NOT EXISTS idx_room_reservations_room ON room_reservations(room_id)',
        'CREATE INDEX IF NOT EXISTS idx_room_reservations_teacher ON room_reservations(teacher_id)',
        'CREATE INDEX IF NOT EXISTS idx_room_reservations_status ON room_reservations(status)',
        'CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher ON teacher_assignments(teacher_id)',
        'CREATE INDEX IF NOT EXISTS idx_teacher_assignments_subject ON teacher_assignments(subject_id)',
        'CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class ON teacher_assignments(class_id)',
        'CREATE INDEX IF NOT EXISTS idx_teacher_availability_teacher ON teacher_availability(teacher_id)',
        'CREATE INDEX IF NOT EXISTS idx_work_hours_config_school ON work_hours_config(school_id)'
      ];

      let completed = 0;
      indexes.forEach(index => {
        this.db.run(index, (err) => {
          if (err) console.warn('Failed to create index:', index, err);
          completed++;
          if (completed === indexes.length) resolve();
        });
      });
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database run error:', err);
          reject(err);
        } else {
          resolve({ 
            lastInsertRowid: this.lastID,
            changes: this.changes 
          });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
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
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) console.error('Error closing database:', err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getDatabasePath() {
    return this.dbPath;
  }

  async getDatabaseSize() {
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
