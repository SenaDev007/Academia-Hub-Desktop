const { v4: uuidv4 } = require('uuid');

class PlanningService {
  constructor(databaseManager) {
    this.db = databaseManager;
  }

  // Classes
  async getClasses(schoolId) {
    try {
      const classes = await this.db.query(
        'SELECT * FROM classes WHERE school_id = ? ORDER BY name',
        [schoolId]
      );
      return classes;
    } catch (error) {
      console.error('Error getting classes:', error);
      throw error;
    }
  }

  async getClassById(classId) {
    try {
      const cls = await this.db.get(
        'SELECT * FROM classes WHERE id = ?',
        [classId]
      );
      return cls;
    } catch (error) {
      console.error('Error getting class:', error);
      throw error;
    }
  }

  async createClass(classData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO classes (id, name, level, capacity, teacher_id, room_id, school_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, classData.name, classData.level, classData.capacity || 30, 
         classData.teacher_id, classData.room_id, classData.school_id, now]
      );
      
      return { id, ...classData, created_at: now };
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  async updateClass(classId, classData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE classes SET name = ?, level = ?, capacity = ?, teacher_id = ?, 
         room_id = ?, updated_at = ? WHERE id = ?`,
        [classData.name, classData.level, classData.capacity, 
         classData.teacher_id, classData.room_id, now, classId]
      );
      
      return { id: classId, ...classData, updated_at: now };
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  async deleteClass(classId) {
    try {
      await this.db.run('DELETE FROM classes WHERE id = ?', [classId]);
      return { success: true, id: classId };
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  // Rooms
  async getRooms(schoolId) {
    try {
      const rooms = await this.db.query(
        'SELECT * FROM rooms WHERE school_id = ? ORDER BY name',
        [schoolId]
      );
      return rooms;
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw error;
    }
  }

  async getRoomById(roomId) {
    try {
      const room = await this.db.get(
        'SELECT * FROM rooms WHERE id = ?',
        [roomId]
      );
      return room;
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }

  async createRoom(roomData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO rooms (id, name, type, capacity, equipment, status, school_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, roomData.name, roomData.type, roomData.capacity, 
         JSON.stringify(roomData.equipment || []), roomData.status || 'available', 
         roomData.school_id, now]
      );
      
      return { id, ...roomData, created_at: now };
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async updateRoom(roomId, roomData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE rooms SET name = ?, type = ?, capacity = ?, equipment = ?, 
         status = ?, updated_at = ? WHERE id = ?`,
        [roomData.name, roomData.type, roomData.capacity, 
         JSON.stringify(roomData.equipment || []), roomData.status, now, roomId]
      );
      
      return { id: roomId, ...roomData, updated_at: now };
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async deleteRoom(roomId) {
    try {
      await this.db.run('DELETE FROM rooms WHERE id = ?', [roomId]);
      return { success: true, id: roomId };
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  // Subjects
  async getSubjects(schoolId) {
    try {
      const subjects = await this.db.query(
        'SELECT * FROM subjects WHERE school_id = ? ORDER BY name',
        [schoolId]
      );
      return subjects;
    } catch (error) {
      console.error('Error getting subjects:', error);
      throw error;
    }
  }

  async getSubjectById(subjectId) {
    try {
      const subject = await this.db.get(
        'SELECT * FROM subjects WHERE id = ?',
        [subjectId]
      );
      return subject;
    } catch (error) {
      console.error('Error getting subject:', error);
      throw error;
    }
  }

  async createSubject(subjectData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO subjects (id, name, code, level, coefficient, school_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, subjectData.name, subjectData.code, subjectData.level, 
         subjectData.coefficient || 1, subjectData.school_id, now]
      );
      
      return { id, ...subjectData, created_at: now };
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  async updateSubject(subjectId, subjectData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE subjects SET name = ?, code = ?, level = ?, coefficient = ?, 
         updated_at = ? WHERE id = ?`,
        [subjectData.name, subjectData.code, subjectData.level, 
         subjectData.coefficient, now, subjectId]
      );
      
      return { id: subjectId, ...subjectData, updated_at: now };
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  async deleteSubject(subjectId) {
    try {
      await this.db.run('DELETE FROM subjects WHERE id = ?', [subjectId]);
      return { success: true, id: subjectId };
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }

  // Teachers
  async getTeachers(schoolId) {
    try {
      const teachers = await this.db.query(`
        SELECT t.*, u.first_name, u.last_name, u.email
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.school_id = ?
        ORDER BY u.last_name, u.first_name
      `, [schoolId]);
      return teachers;
    } catch (error) {
      console.error('Error getting teachers:', error);
      throw error;
    }
  }

  async getTeacherById(teacherId) {
    try {
      const teacher = await this.db.get(`
        SELECT t.*, u.first_name, u.last_name, u.email
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `, [teacherId]);
      return teacher;
    } catch (error) {
      console.error('Error getting teacher:', error);
      throw error;
    }
  }

  // Schedule entries
  async getScheduleEntries(filters = {}) {
    try {
      const { schoolId, classId, teacherId, roomId, dayOfWeek } = filters;
      let sql = `
        SELECT se.*, 
               c.name as class_name,
               s.name as subject_name,
               s.code as subject_code,
               t.id as teacher_id,
               u.first_name as teacher_first_name,
               u.last_name as teacher_last_name,
               r.name as room_name
        FROM schedule_entries se
        LEFT JOIN classes c ON se.class_id = c.id
        LEFT JOIN subjects s ON se.subject_id = s.id
        LEFT JOIN teachers t ON se.teacher_id = t.id
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN rooms r ON se.room_id = r.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (schoolId) {
        sql += ' AND se.school_id = ?';
        params.push(schoolId);
      }
      if (classId) {
        sql += ' AND se.class_id = ?';
        params.push(classId);
      }
      if (teacherId) {
        sql += ' AND se.teacher_id = ?';
        params.push(teacherId);
      }
      if (roomId) {
        sql += ' AND se.room_id = ?';
        params.push(roomId);
      }
      if (dayOfWeek !== undefined) {
        sql += ' AND se.day_of_week = ?';
        params.push(dayOfWeek);
      }
      
      sql += ' ORDER BY se.day_of_week, se.start_time';
      
      const entries = await this.db.query(sql, params);
      return entries;
    } catch (error) {
      console.error('Error getting schedule entries:', error);
      throw error;
    }
  }

  async createScheduleEntry(entryData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO schedule_entries (id, day_of_week, start_time, end_time, subject_id, 
         teacher_id, class_id, room_id, duration_minutes, week_type, school_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, entryData.day_of_week, entryData.start_time, entryData.end_time,
         entryData.subject_id, entryData.teacher_id, entryData.class_id, 
         entryData.room_id, entryData.duration_minutes, entryData.week_type || 'all',
         entryData.school_id, now]
      );
      
      return { id, ...entryData, created_at: now };
    } catch (error) {
      console.error('Error creating schedule entry:', error);
      throw error;
    }
  }

  async updateScheduleEntry(entryId, entryData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE schedule_entries SET day_of_week = ?, start_time = ?, end_time = ?, 
         subject_id = ?, teacher_id = ?, class_id = ?, room_id = ?, duration_minutes = ?, 
         week_type = ?, updated_at = ? WHERE id = ?`,
        [entryData.day_of_week, entryData.start_time, entryData.end_time,
         entryData.subject_id, entryData.teacher_id, entryData.class_id,
         entryData.room_id, entryData.duration_minutes, entryData.week_type, now, entryId]
      );
      
      return { id: entryId, ...entryData, updated_at: now };
    } catch (error) {
      console.error('Error updating schedule entry:', error);
      throw error;
    }
  }

  async deleteScheduleEntry(entryId) {
    try {
      await this.db.run('DELETE FROM schedule_entries WHERE id = ?', [entryId]);
      return { success: true, id: entryId };
    } catch (error) {
      console.error('Error deleting schedule entry:', error);
      throw error;
    }
  }

  // Breaks
  async getBreaks(schoolId) {
    try {
      const breaks = await this.db.query(
        'SELECT * FROM breaks WHERE school_id = ? ORDER BY start_time',
        [schoolId]
      );
      return breaks;
    } catch (error) {
      console.error('Error getting breaks:', error);
      throw error;
    }
  }

  async createBreak(breakData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO breaks (id, name, type, start_time, end_time, duration_minutes, 
         levels, school_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, breakData.name, breakData.type, breakData.start_time, 
         breakData.end_time, breakData.duration_minutes, 
         JSON.stringify(breakData.levels || []), breakData.school_id, now]
      );
      
      return { id, ...breakData, created_at: now };
    } catch (error) {
      console.error('Error creating break:', error);
      throw error;
    }
  }

  async updateBreak(breakId, breakData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE breaks SET name = ?, type = ?, start_time = ?, end_time = ?, 
         duration_minutes = ?, levels = ?, updated_at = ? WHERE id = ?`,
        [breakData.name, breakData.type, breakData.start_time, breakData.end_time,
         breakData.duration_minutes, JSON.stringify(breakData.levels || []), now, breakId]
      );
      
      return { id: breakId, ...breakData, updated_at: now };
    } catch (error) {
      console.error('Error updating break:', error);
      throw error;
    }
  }

  async deleteBreak(breakId) {
    try {
      await this.db.run('DELETE FROM breaks WHERE id = ?', [breakId]);
      return { success: true, id: breakId };
    } catch (error) {
      console.error('Error deleting break:', error);
      throw error;
    }
  }

  // Work hours configuration
  async getWorkHoursConfig(schoolId) {
    try {
      const config = await this.db.get(
        'SELECT * FROM work_hours_config WHERE school_id = ?',
        [schoolId]
      );
      return config;
    } catch (error) {
      console.error('Error getting work hours config:', error);
      throw error;
    }
  }

  async createWorkHoursConfig(configData) {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await this.db.run(
        `INSERT INTO work_hours_config (id, school_id, start_time, end_time, 
         lunch_break_start, lunch_break_end, course_duration_minutes, 
         break_between_courses_minutes, work_days, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, configData.school_id, configData.start_time, configData.end_time,
         configData.lunch_break_start, configData.lunch_break_end,
         configData.course_duration_minutes, configData.break_between_courses_minutes,
         JSON.stringify(configData.work_days || [1, 2, 3, 4, 5]), now]
      );
      
      return { id, ...configData, created_at: now };
    } catch (error) {
      console.error('Error creating work hours config:', error);
      throw error;
    }
  }

  async updateWorkHoursConfig(configId, configData) {
    try {
      const now = new Date().toISOString();
      
      await this.db.run(
        `UPDATE work_hours_config SET start_time = ?, end_time = ?, 
         lunch_break_start = ?, lunch_break_end = ?, course_duration_minutes = ?, 
         break_between_courses_minutes = ?, work_days = ?, updated_at = ? WHERE id = ?`,
        [configData.start_time, configData.end_time, configData.lunch_break_start,
         configData.lunch_break_end, configData.course_duration_minutes,
         configData.break_between_courses_minutes, JSON.stringify(configData.work_days || [1, 2, 3, 4, 5]), now, configId]
      );
      
      return { id: configId, ...configData, updated_at: now };
    } catch (error) {
      console.error('Error updating work hours config:', error);
      throw error;
    }
  }

  // Statistics
  async getPlanningStats(schoolId) {
    try {
      const stats = {};
      
      // Active classes count
      const classesCount = await this.db.get(
        'SELECT COUNT(*) as count FROM classes WHERE school_id = ?',
        [schoolId]
      );
      stats.activeClasses = classesCount.count;

      // Active teachers count
      const teachersCount = await this.db.get(
        'SELECT COUNT(*) as count FROM teachers WHERE school_id = ? AND status = "active"',
        [schoolId]
      );
      stats.activeTeachers = teachersCount.count;

      // Available rooms count
      const roomsCount = await this.db.get(
        'SELECT COUNT(*) as count FROM rooms WHERE school_id = ? AND status = "available"',
        [schoolId]
      );
      stats.availableRooms = roomsCount.count;

      // Occupation rate calculation
      const totalRooms = await this.db.get(
        'SELECT COUNT(*) as count FROM rooms WHERE school_id = ?',
        [schoolId]
      );
      
      const occupiedRooms = await this.db.get(
        'SELECT COUNT(*) as count FROM rooms WHERE school_id = ? AND status = "occupied"',
        [schoolId]
      );
      
      stats.occupationRate = totalRooms.count > 0 
        ? Math.round((occupiedRooms.count / totalRooms.count) * 100) 
        : 0;

      return stats;
    } catch (error) {
      console.error('Error getting planning stats:', error);
      throw error;
    }
  }
}

module.exports = PlanningService;
