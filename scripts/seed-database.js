import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// For testing purposes, use a local file
const dbPath = path.join(__dirname, '../test-database.db');

class DatabaseSeeder {
  constructor() {
    this.db = null;
    sqlite3.verbose();
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      try {
        // Ensure directory exists
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }

        // Initialize database
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('Database initialization error:', err);
            reject(err);
          } else {
            console.log('Database initialized at:', dbPath);
            this.createTables().then(() => {
              this.seedData().then(() => {
                console.log('Database seeded successfully');
                resolve(true);
              }).catch(reject);
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

        // Payments table
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

        setTimeout(resolve, 1000);
      } catch (error) {
        console.error('Failed to create tables:', error);
        reject(error);
      }
    });
  }

  seedData() {
    return new Promise((resolve, reject) => {
      try {
        // Insert classes
        const classes = [
          { id: 'class-001', name: '6ème A', level: '6ème' },
          { id: 'class-002', name: '5ème B', level: '5ème' },
          { id: 'class-003', name: '4ème C', level: '4ème' },
          { id: 'class-004', name: '3ème A', level: '3ème' },
          { id: 'class-005', name: '2nde B', level: '2nde' },
          { id: 'class-006', name: '1ère C', level: '1ère' },
          { id: 'class-007', name: 'Terminale D', level: 'Terminale' }
        ];

        const insertClass = this.db.prepare(`
          INSERT OR IGNORE INTO classes (id, name, level) VALUES (?, ?, ?)
        `);

        classes.forEach(cls => {
          insertClass.run(cls.id, cls.name, cls.level);
        });
        insertClass.finalize();

        // Insert students
        const students = [
          {
            id: 'stu-001',
            matricule: 'MAT-2024-00001',
            first_name: 'Marie',
            last_name: 'Dubois',
            email: 'marie.dubois@email.com',
            phone: '06 12 34 56 78',
            birth_date: '2010-05-15',
            class_id: 'class-004',
            parent_name: 'Jean Dubois',
            parent_phone: '06 98 76 54 32',
            status: 'active',
            medical_info: 'Aucune allergie connue',
            enrollment_date: '2023-09-01'
          },
          {
            id: 'stu-002',
            matricule: 'MAT-2024-00002',
            first_name: 'Pierre',
            last_name: 'Martin',
            email: 'pierre.martin@email.com',
            phone: '06 11 22 33 44',
            birth_date: '2009-08-22',
            class_id: 'class-005',
            parent_name: 'Sophie Martin',
            parent_phone: '06 55 66 77 88',
            status: 'active',
            medical_info: 'Asthme léger',
            enrollment_date: '2023-09-01'
          },
          {
            id: 'stu-003',
            matricule: 'MAT-2024-00003',
            first_name: 'Sophie',
            last_name: 'Lambert',
            email: 'sophie.lambert@email.com',
            phone: '06 33 44 55 66',
            birth_date: '2008-03-10',
            class_id: 'class-006',
            parent_name: 'Michel Lambert',
            parent_phone: '06 77 88 99 00',
            status: 'active',
            medical_info: 'Allergie aux arachides',
            enrollment_date: '2023-09-01'
          },
          {
            id: 'stu-004',
            matricule: 'MAT-2024-00004',
            first_name: 'Lucas',
            last_name: 'Moreau',
            email: 'lucas.moreau@email.com',
            phone: '06 44 55 66 77',
            birth_date: '2011-12-05',
            class_id: 'class-001',
            parent_name: 'Claire Moreau',
            parent_phone: '06 22 33 44 55',
            status: 'active',
            medical_info: 'Aucune information médicale',
            enrollment_date: '2023-09-01'
          },
          {
            id: 'stu-005',
            matricule: 'MAT-2024-00005',
            first_name: 'Emma',
            last_name: 'Petit',
            email: 'emma.petit@email.com',
            phone: '06 55 66 77 88',
            birth_date: '2009-11-18',
            class_id: 'class-002',
            parent_name: 'David Petit',
            parent_phone: '06 33 44 55 66',
            status: 'active',
            medical_info: 'Lunettes nécessaires',
            enrollment_date: '2023-09-01'
          }
        ];

        const insertStudent = this.db.prepare(`
          INSERT OR IGNORE INTO students (
            id, matricule, first_name, last_name, email, phone, birth_date, 
            class_id, parent_name, parent_phone, status, medical_info, enrollment_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        students.forEach(student => {
          insertStudent.run(
            student.id,
            student.matricule,
            student.first_name,
            student.last_name,
            student.email,
            student.phone,
            student.birth_date,
            student.class_id,
            student.parent_name,
            student.parent_phone,
            student.status,
            student.medical_info,
            student.enrollment_date
          );
        });
        insertStudent.finalize();

        // Insert some payments
        const payments = [
          { id: 'pay-001', student_id: 'stu-001', amount: 50000, payment_method: 'Espèces', status: 'paid', description: 'Frais de scolarité trimestre 1' },
          { id: 'pay-002', student_id: 'stu-002', amount: 25000, payment_method: 'Virement', status: 'pending', description: 'Frais de scolarité trimestre 1 - moitié' },
          { id: 'pay-003', student_id: 'stu-003', amount: 50000, payment_method: 'Carte bancaire', status: 'paid', description: 'Frais de scolarité trimestre 1' }
        ];

        const insertPayment = this.db.prepare(`
          INSERT OR IGNORE INTO payments (id, student_id, amount, payment_method, status, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        payments.forEach(payment => {
          insertPayment.run(
            payment.id,
            payment.student_id,
            payment.amount,
            payment.payment_method,
            payment.status,
            payment.description
          );
        });
        insertPayment.finalize();

        setTimeout(resolve, 1000);
      } catch (error) {
        console.error('Failed to seed data:', error);
        reject(error);
      }
    });
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
}

// Run the seeder
const seeder = new DatabaseSeeder();
seeder.initialize()
  .then(() => {
    console.log('Database seeding completed successfully');
    return seeder.close();
  })
  .catch(error => {
    console.error('Database seeding failed:', error);
    return seeder.close();
  });
