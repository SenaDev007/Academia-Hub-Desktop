import { ipcRenderer } from 'electron';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  classId?: string;
  className?: string;
  age?: number;
  enrollmentDate?: string;
  status: 'active' | 'inactive' | 'graduated';
  photo?: string;
  medicalInfo?: string;
  registrationNumber?: string;
  fees?: 'paid' | 'pending' | 'overdue';
}

export interface Class {
  id: string;
  name: string;
  level: string;
}

export interface EnrollmentStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  newThisWeek: number;
}

class StudentService {
  private async invokeIpc(channel: string, ...args: any[]): Promise<any> {
    try {
      return await ipcRenderer.invoke(channel, ...args);
    } catch (error) {
      console.error(`Error invoking ${channel}:`, error);
      throw error;
    }
  }

  async getAllStudents(filters?: {
    classId?: string;
    status?: string;
    search?: string;
  }): Promise<Student[]> {
    try {
      let query = `
        SELECT 
          s.id,
          s.first_name as firstName,
          s.last_name as lastName,
          s.email,
          s.phone,
          s.birth_date as dateOfBirth,
          s.address,
          s.parent_name as parentName,
          s.parent_phone as parentPhone,
          s.class_id as classId,
          c.name as className,
          s.enrollment_date as enrollmentDate,
          s.status,
          s.photo,
          s.medical_info as medicalInfo,
          s.matricule as registrationNumber,
          CASE 
            WHEN p.amount IS NULL THEN 'pending'
            WHEN p.amount > 0 THEN 'paid'
            ELSE 'overdue'
          END as fees
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN (
          SELECT student_id, SUM(amount) as amount
          FROM payments
          GROUP BY student_id
        ) p ON s.id = p.student_id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (filters?.search) {
        query += ` AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.matricule LIKE ?)`;
        params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters?.classId && filters.classId !== 'all') {
        query += ` AND c.name LIKE ?`;
        params.push(`%${filters.classId}%`);
      }

      if (filters?.status) {
        query += ` AND s.status = ?`;
        params.push(filters.status);
      }

      query += ` ORDER BY s.last_name, s.first_name`;

      const students = await this.invokeIpc('database-query', query, params);
      
      // Calculate age from birth_date
      return students.map((student: any) => ({
        ...student,
        age: student.dateOfBirth ? this.calculateAge(student.dateOfBirth) : undefined
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      return [];
    }
  }

  async getStudentById(id: string): Promise<Student | null> {
    try {
      const query = `
        SELECT 
          s.id,
          s.first_name as firstName,
          s.last_name as lastName,
          s.email,
          s.phone,
          s.birth_date as dateOfBirth,
          s.address,
          s.parent_name as parentName,
          s.parent_phone as parentPhone,
          s.class_id as classId,
          c.name as className,
          s.enrollment_date as enrollmentDate,
          s.status,
          s.photo,
          s.medical_info as medicalInfo,
          s.matricule as registrationNumber
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.id = ?
      `;
      
      const student = await this.invokeIpc('database-get', query, [id]);
      if (student) {
        return {
          ...student,
          age: student.dateOfBirth ? this.calculateAge(student.dateOfBirth) : undefined
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'élève:', error);
      return null;
    }
  }

  async getClasses(): Promise<Class[]> {
    try {
      const query = 'SELECT id, name, level FROM classes ORDER BY name';
      return await this.invokeIpc('database-query', query);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      return [];
    }
  }

  async getEnrollmentStats(): Promise<EnrollmentStats> {
    try {
      const totalQuery = 'SELECT COUNT(*) as total FROM students WHERE status = "active"';
      const totalResult = await this.invokeIpc('database-get', totalQuery);
      
      // Pour l'instant, on retourne des données mockées pour les autres stats
      // TODO: Implémenter les vraies statistiques avec les tables d'absences et d'inscriptions
      return {
        totalStudents: totalResult?.total || 0,
        presentToday: Math.max(0, (totalResult?.total || 0) - 5),
        absentToday: 5,
        newThisWeek: 2
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        newThisWeek: 0
      };
    }
  }

  async createStudent(data: Partial<Student>): Promise<string> {
    try {
      const id = this.generateId();
      const query = `
        INSERT INTO students (
          id, first_name, last_name, email, phone, birth_date, address,
          parent_name, parent_phone, class_id, status, medical_info, matricule
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const matricule = data.registrationNumber || this.generateMatricule();
      
      await this.invokeIpc('database-run', query, [
        id,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.dateOfBirth,
        data.address,
        data.parentName,
        data.parentPhone,
        data.classId,
        data.status || 'active',
        data.medicalInfo,
        matricule
      ]);
      
      return id;
    } catch (error) {
      console.error('Erreur lors de la création de l\'élève:', error);
      throw error;
    }
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<void> {
    try {
      const fields = [];
      const values = [];
      
      if (data.firstName) {
        fields.push('first_name = ?');
        values.push(data.firstName);
      }
      if (data.lastName) {
        fields.push('last_name = ?');
        values.push(data.lastName);
      }
      if (data.email !== undefined) {
        fields.push('email = ?');
        values.push(data.email);
      }
      if (data.phone !== undefined) {
        fields.push('phone = ?');
        values.push(data.phone);
      }
      if (data.dateOfBirth !== undefined) {
        fields.push('birth_date = ?');
        values.push(data.dateOfBirth);
      }
      if (data.address !== undefined) {
        fields.push('address = ?');
        values.push(data.address);
      }
      if (data.parentName !== undefined) {
        fields.push('parent_name = ?');
        values.push(data.parentName);
      }
      if (data.parentPhone !== undefined) {
        fields.push('parent_phone = ?');
        values.push(data.parentPhone);
      }
      if (data.classId !== undefined) {
        fields.push('class_id = ?');
        values.push(data.classId);
      }
      if (data.status) {
        fields.push('status = ?');
        values.push(data.status);
      }
      if (data.medicalInfo !== undefined) {
        fields.push('medical_info = ?');
        values.push(data.medicalInfo);
      }
      
      if (fields.length === 0) return;
      
      values.push(id);
      const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
      
      await this.invokeIpc('database-run', query, values);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'élève:', error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      const query = 'DELETE FROM students WHERE id = ?';
      await this.invokeIpc('database-run', query, [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élève:', error);
      throw error;
    }
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private generateId(): string {
    return 'STU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private generateMatricule(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `MAT-${year}-${random}`;
  }
}

export const studentService = new StudentService();
