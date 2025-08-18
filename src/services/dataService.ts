import { v4 as uuidv4 } from 'uuid';

// Types pour le service dataService
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  classId: string;
  registrationNumber: string;
  medicalInfo?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjectId: string;
  qualification: string;
  experience: number;
  hireDate: string;
  salary: number;
  address: string;
  emergencyContact: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  capacity: number;
  teacherId?: string;
  roomId?: string;
  academicYear: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  date: string;
  duration: number;
  maxScore: number;
  passingScore: number;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  examId: string;
  score: number;
  grade: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CahierJournalEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  scheduleId?: string;
  date: string;
  startTime: string;
  endTime: string;
  content: string;
  homework?: string;
  observations?: string;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mobile_money';
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalPayments: number;
  totalRevenue: number;
}

// Interface pour les appels IPC
interface ElectronAPI {
  database: {
    query: (sql: string, params?: any[]) => Promise<any[]>;
    get: (sql: string, params?: any[]) => Promise<any>;
    run: (sql: string, params?: any[]) => Promise<any>;
  };
}

// Vérifier si nous sommes dans Electron
const isElectron = !!(window as any).electronAPI;

class DataService {
  private isInitialized = false;
  private electronAPI: ElectronAPI | null = null;

  constructor() {
    if (isElectron) {
      this.electronAPI = (window as any).electronAPI;
    }
  }

  async init() {
    if (!isElectron) {
      console.warn('DataService: Running in web mode, using mock data');
      return;
    }
    this.isInitialized = true;
    console.log('DataService initialized');
  }

  private generateId(): string {
    return uuidv4();
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // === STUDENTS ===
  async getStudents(filters: any = {}): Promise<Student[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockStudents(filters);
    }

    let sql = 'SELECT * FROM students WHERE 1=1';
    const params: any[] = [];

    if (filters.classId) {
      sql += ' AND classId = ?';
      params.push(filters.classId);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY lastName, firstName';

    return this.electronAPI.database.query(sql, params);
  }

  async getStudent(id: string): Promise<Student | null> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockStudents().find(s => s.id === id) || null;
    }

    const sql = 'SELECT * FROM students WHERE id = ?';
    return this.electronAPI.database.get(sql, [id]);
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    if (!isElectron || !this.electronAPI) {
      const mockStudent = {
        id: this.generateId(),
        ...data,
        status: 'active' as const,
        createdAt: this.getCurrentTimestamp(),
        updatedAt: this.getCurrentTimestamp(),
      } as Student;
      return mockStudent;
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO students (id, firstName, lastName, email, phone, dateOfBirth, 
                           gender, address, parentName, parentPhone, parentEmail, 
                           classId, registrationNumber, medicalInfo, notes, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.dateOfBirth,
      data.gender,
      data.address,
      data.parentName,
      data.parentPhone,
      data.parentEmail,
      data.classId,
      data.registrationNumber,
      data.medicalInfo,
      data.notes,
      'active',
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return this.getStudent(id);
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
    if (!isElectron || !this.electronAPI) {
      return null;
    }

    const sql = `
      UPDATE students 
      SET firstName = ?, lastName = ?, email = ?, phone = ?, dateOfBirth = ?,
          gender = ?, address = ?, parentName = ?, parentPhone = ?, parentEmail = ?,
          classId = ?, registrationNumber = ?, medicalInfo = ?, notes = ?, updatedAt = ?
      WHERE id = ?
    `;
    
    const params = [
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.dateOfBirth,
      data.gender,
      data.address,
      data.parentName,
      data.parentPhone,
      data.parentEmail,
      data.classId,
      data.registrationNumber,
      data.medicalInfo,
      data.notes,
      this.getCurrentTimestamp(),
      id
    ];

    await this.electronAPI.database.run(sql, params);
    return this.getStudent(id);
  }

  async deleteStudent(id: string): Promise<void> {
    if (!isElectron || !this.electronAPI) {
      return;
    }

    const sql = 'DELETE FROM students WHERE id = ?';
    await this.electronAPI.database.run(sql, [id]);
  }

  // === TEACHERS ===
  async getTeachers(filters: any = {}): Promise<Teacher[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockTeachers(filters);
    }

    let sql = 'SELECT * FROM teachers WHERE 1=1';
    const params: any[] = [];

    if (filters.subjectId) {
      sql += ' AND subjectId = ?';
      params.push(filters.subjectId);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY lastName, firstName';
    return this.electronAPI.database.query(sql, params);
  }

  async getTeacher(id: string): Promise<Teacher | null> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockTeachers().find(t => t.id === id) || null;
    }

    const sql = 'SELECT * FROM teachers WHERE id = ?';
    return this.electronAPI.database.get(sql, [id]);
  }

  async createTeacher(data: Partial<Teacher>): Promise<Teacher> {
    if (!isElectron || !this.electronAPI) {
      const mockTeacher = {
        id: this.generateId(),
        ...data,
        status: 'active' as const,
        createdAt: this.getCurrentTimestamp(),
        updatedAt: this.getCurrentTimestamp(),
      } as Teacher;
      return mockTeacher;
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO teachers (id, firstName, lastName, email, phone, subjectId, 
                           qualification, experience, hireDate, salary, address, 
                           emergencyContact, notes, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.subjectId,
      data.qualification,
      data.experience,
      data.hireDate,
      data.salary,
      data.address,
      data.emergencyContact,
      data.notes,
      'active',
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return this.getTeacher(id);
  }

  // === CLASSES ===
  async getClasses(): Promise<Class[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockClasses();
    }

    const sql = 'SELECT * FROM classes ORDER BY name';
    return this.electronAPI.database.query(sql);
  }

  async getClass(id: string): Promise<Class | null> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockClasses().find(c => c.id === id) || null;
    }

    const sql = 'SELECT * FROM classes WHERE id = ?';
    return this.electronAPI.database.get(sql, [id]);
  }

  async createClass(data: Partial<Class>): Promise<Class> {
    if (!isElectron || !this.electronAPI) {
      const mockClass = {
        id: this.generateId(),
        ...data,
        createdAt: this.getCurrentTimestamp(),
        updatedAt: this.getCurrentTimestamp(),
      } as Class;
      return mockClass;
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO classes (id, name, level, capacity, teacherId, roomId, academicYear, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.name,
      data.level,
      data.capacity,
      data.teacherId,
      data.roomId,
      data.academicYear,
      data.description,
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return this.getClass(id);
  }

  // === EXAMS ===
  async getExams(filters: any = {}): Promise<Exam[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockExams(filters);
    }

    let sql = `
      SELECT e.*, s.name as subjectName, c.name as className, 
             t.firstName || ' ' || t.lastName as teacherName
      FROM exams e
      LEFT JOIN subjects s ON e.subjectId = s.id
      LEFT JOIN classes c ON e.classId = c.id
      LEFT JOIN teachers t ON e.teacherId = t.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.classId) {
      sql += ' AND e.classId = ?';
      params.push(filters.classId);
    }

    if (filters.subjectId) {
      sql += ' AND e.subjectId = ?';
      params.push(filters.subjectId);
    }

    if (filters.teacherId) {
      sql += ' AND e.teacherId = ?';
      params.push(filters.teacherId);
    }

    sql += ' ORDER BY e.date DESC';
    return this.electronAPI.database.query(sql, params);
  }

  async getExam(id: string): Promise<Exam | null> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockExams().find(e => e.id === id) || null;
    }

    const sql = 'SELECT * FROM exams WHERE id = ?';
    return this.electronAPI.database.get(sql, [id]);
  }

  async createExam(data: Partial<Exam>): Promise<Exam> {
    if (!isElectron || !this.electronAPI) {
      const mockExam = {
        id: this.generateId(),
        ...data,
        createdAt: this.getCurrentTimestamp(),
        updatedAt: this.getCurrentTimestamp(),
      } as Exam;
      return mockExam;
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO exams (id, name, subjectId, classId, teacherId, date, duration, 
                       maxScore, passingScore, type, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.name,
      data.subjectId,
      data.classId,
      data.teacherId,
      data.date,
      data.duration,
      data.maxScore,
      data.passingScore,
      data.type,
      data.description,
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return this.getExam(id);
  }

  // === GRADES ===
  async getGrades(examId: string): Promise<Grade[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockGrades().filter(g => g.examId === examId);
    }

    const sql = `
      SELECT g.*, s.firstName || ' ' || s.lastName as studentName
      FROM grades g
      JOIN students s ON g.studentId = s.id
      WHERE g.examId = ?
      ORDER BY s.lastName, s.firstName
    `;
    return this.electronAPI.database.query(sql, [examId]);
  }

  async createGrade(data: Partial<Grade>): Promise<string> {
    if (!isElectron || !this.electronAPI) {
      return this.generateId();
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO grades (id, studentId, examId, score, grade, remarks, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.studentId,
      data.examId,
      data.score,
      data.grade,
      data.remarks,
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return id;
  }

  // === SCHEDULES ===
  async getSchedules(filters: any = {}): Promise<Schedule[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockSchedules(filters);
    }

    let sql = `
      SELECT s.*, c.name as className, sub.name as subjectName, 
             t.firstName || ' ' || t.lastName as teacherName, r.name as roomName
      FROM schedules s
      LEFT JOIN classes c ON s.classId = c.id
      LEFT JOIN subjects sub ON s.subjectId = sub.id
      LEFT JOIN teachers t ON s.teacherId = t.id
      LEFT JOIN rooms r ON s.roomId = r.id
      WHERE s.isActive = 1
    `;
    const params: any[] = [];

    if (filters.classId) {
      sql += ' AND s.classId = ?';
      params.push(filters.classId);
    }

    if (filters.teacherId) {
      sql += ' AND s.teacherId = ?';
      params.push(filters.teacherId);
    }

    if (filters.dayOfWeek) {
      sql += ' AND s.dayOfWeek = ?';
      params.push(filters.dayOfWeek);
    }

    sql += ' ORDER BY s.dayOfWeek, s.startTime';
    return this.electronAPI.database.query(sql, params);
  }

  // === CAHIER JOURNAL ===
  async getCahierJournalEntries(filters: any = {}): Promise<CahierJournalEntry[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockCahierJournalEntries(filters);
    }

    let sql = `
      SELECT cj.*, cl.name as className, sub.name as subjectName,
             t.firstName || ' ' || t.lastName as teacherName
      FROM cahier_journal cj
      LEFT JOIN classes cl ON cj.classId = cl.id
      LEFT JOIN subjects sub ON cj.subjectId = sub.id
      LEFT JOIN teachers t ON cj.teacherId = t.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.classId) {
      sql += ' AND cj.classId = ?';
      params.push(filters.classId);
    }

    if (filters.teacherId) {
      sql += ' AND cj.teacherId = ?';
      params.push(filters.teacherId);
    }

    if (filters.date) {
      sql += ' AND cj.date = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY cj.date DESC, cj.startTime';
    return this.electronAPI.database.query(sql, params);
  }

  async createCahierJournalEntry(data: Partial<CahierJournalEntry>): Promise<string> {
    if (!isElectron || !this.electronAPI) {
      return this.generateId();
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO cahier_journal (id, classId, subjectId, teacherId, scheduleId, 
                                date, startTime, endTime, content, homework, observations, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.classId,
      data.subjectId,
      data.teacherId,
      data.scheduleId,
      data.date,
      data.startTime,
      data.endTime,
      data.content,
      data.homework,
      data.observations,
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return id;
  }

  // === PAYMENTS ===
  async getPayments(filters: any = {}): Promise<Payment[]> {
    if (!isElectron || !this.electronAPI) {
      return this.getMockPayments(filters);
    }

    let sql = `
      SELECT p.*, s.firstName || ' ' || s.lastName as studentName
      FROM payments p
      JOIN students s ON p.studentId = s.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.studentId) {
      sql += ' AND p.studentId = ?';
      params.push(filters.studentId);
    }

    if (filters.status) {
      sql += ' AND p.status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY p.date DESC';
    return this.electronAPI.database.query(sql, params);
  }

  async createPayment(data: Partial<Payment>): Promise<string> {
    if (!isElectron || !this.electronAPI) {
      return this.generateId();
    }

    const id = this.generateId();
    const sql = `
      INSERT INTO payments (id, studentId, amount, paymentMethod, reference, 
                          status, date, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      data.studentId,
      data.amount,
      data.paymentMethod,
      data.reference,
      data.status,
      data.date,
      data.description,
      this.getCurrentTimestamp(),
      this.getCurrentTimestamp()
    ];

    await this.electronAPI.database.run(sql, params);
    return id;
  }

  // === DASHBOARD ===
  async getDashboardStats(): Promise<DashboardStats> {
    if (!isElectron || !this.electronAPI) {
      return {
        totalStudents: 150,
        totalTeachers: 12,
        totalClasses: 8,
        totalPayments: 245,
        totalRevenue: 1250000
      };
    }

    const stats: DashboardStats = {} as DashboardStats;

    // Statistiques étudiants
    const studentsCount = await this.electronAPI.database.get('SELECT COUNT(*) as count FROM students WHERE status = "active"');
    stats.totalStudents = studentsCount?.count || 0;

    // Statistiques enseignants
    const teachersCount = await this.electronAPI.database.get('SELECT COUNT(*) as count FROM teachers WHERE status = "active"');
    stats.totalTeachers = teachersCount?.count || 0;

    // Statistiques classes
    const classesCount = await this.electronAPI.database.get('SELECT COUNT(*) as count FROM classes');
    stats.totalClasses = classesCount?.count || 0;

    // Statistiques paiements
    const paymentsStats = await this.electronAPI.database.get(`
      SELECT 
        COUNT(*) as totalPayments,
        SUM(amount) as totalAmount
      FROM payments 
      WHERE status = 'completed'
    `);
    stats.totalPayments = paymentsStats?.totalPayments || 0;
    stats.totalRevenue = paymentsStats?.totalAmount || 0;

    return stats;
  }

  // === MOCK DATA ===
  private getMockStudents(filters: any = {}): Student[] {
    const mockStudents: Student[] = [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@school.com',
        phone: '0123456789',
        dateOfBirth: '2005-03-15',
        gender: 'M',
        address: '123 Rue de Paris',
        parentName: 'Marie Dupont',
        parentPhone: '0698765432',
        parentEmail: 'marie.dupont@email.com',
        classId: '1',
        registrationNumber: '2024001',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@school.com',
        phone: '0123456790',
        dateOfBirth: '2005-06-20',
        gender: 'F',
        address: '456 Rue de Lyon',
        parentName: 'Pierre Martin',
        parentPhone: '0698765433',
        parentEmail: 'pierre.martin@email.com',
        classId: '1',
        registrationNumber: '2024002',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    return mockStudents.filter(student => {
      if (filters.classId && student.classId !== filters.classId) return false;
      if (filters.status && student.status !== filters.status) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return student.firstName.toLowerCase().includes(search) ||
               student.lastName.toLowerCase().includes(search) ||
               student.email.toLowerCase().includes(search);
      }
      return true;
    });
  }

  private getMockTeachers(filters: any = {}): Teacher[] {
    return [
      {
        id: '1',
        firstName: 'Pierre',
        lastName: 'Dubois',
        email: 'pierre.dubois@school.com',
        phone: '0123456788',
        subjectId: '1',
        qualification: 'Licence Mathématiques',
        experience: 5,
        hireDate: '2019-09-01',
        salary: 2500000,
        address: '789 Rue de Marseille',
        emergencyContact: 'Sophie Dubois: 0698765431',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockClasses(): Class[] {
    return [
      {
        id: '1',
        name: '6ème A',
        level: '6ème',
        capacity: 30,
        teacherId: '1',
        roomId: '1',
        academicYear: '2024-2025',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockExams(filters: any = {}): Exam[] {
    return [
      {
        id: '1',
        name: 'Contrôle 1',
        subjectId: '1',
        classId: '1',
        teacherId: '1',
        date: '2024-03-15',
        duration: 60,
        maxScore: 20,
        passingScore: 10,
        type: 'exam',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockGrades(): Grade[] {
    return [
      {
        id: '1',
        studentId: '1',
        examId: '1',
        score: 15,
        grade: 'Bien',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        studentId: '2',
        examId: '1',
        score: 18,
        grade: 'Très Bien',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockSchedules(filters: any = {}): Schedule[] {
    return [
      {
        id: '1',
        classId: '1',
        subjectId: '1',
        teacherId: '1',
        roomId: '1',
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '09:00',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockCahierJournalEntries(filters: any = {}): CahierJournalEntry[] {
    return [
      {
        id: '1',
        classId: '1',
        subjectId: '1',
        teacherId: '1',
        scheduleId: '1',
        date: '2024-03-15',
        startTime: '08:00',
        endTime: '09:00',
        content: 'Introduction aux fractions',
        homework: 'Exercices 1-5 page 45',
        isValidated: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  private getMockPayments(filters: any = {}): Payment[] {
    return [
      {
        id: '1',
        studentId: '1',
        amount: 50000,
        paymentMethod: 'cash',
        reference: 'PAY-2024-001',
        status: 'completed',
        date: '2024-03-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }
}

// Export singleton
const dataService = new DataService();
export default dataService;
