import {
  PlanningClass,
  PlanningRoom,
  PlanningSubject,
  PlanningTeacher,
  PlanningSchedule,
  PlanningBreak,
  WorkHoursConfig,
  PlanningStats
} from '../types/planning';

class PlanningService {
  private async invokeIpc(method: string, ...args: any[]): Promise<any> {
    try {
      const response = await window.electronAPI.planning[method](...args);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de l\'opération');
      }
    } catch (error) {
      console.error(`Error in ${method}:`, error);
      throw error;
    }
  }

  // Classes
  async getClasses(): Promise<PlanningClass[]> {
    return this.invokeIpc('getClasses');
  }

  async createClass(classData: Partial<PlanningClass>): Promise<PlanningClass> {
    return this.invokeIpc('createClass', classData);
  }

  async updateClass(id: string, classData: Partial<PlanningClass>): Promise<PlanningClass> {
    return this.invokeIpc('updateClass', id, classData);
  }

  async deleteClass(id: string): Promise<void> {
    return this.invokeIpc('deleteClass', id);
  }

  // Rooms
  async getRooms(): Promise<PlanningRoom[]> {
    return this.invokeIpc('getRooms');
  }

  async createRoom(roomData: Partial<PlanningRoom>): Promise<PlanningRoom> {
    return this.invokeIpc('createRoom', roomData);
  }

  async updateRoom(id: string, roomData: Partial<PlanningRoom>): Promise<PlanningRoom> {
    return this.invokeIpc('updateRoom', id, roomData);
  }

  async deleteRoom(id: string): Promise<void> {
    return this.invokeIpc('deleteRoom', id);
  }

  // Subjects
  async getSubjects(): Promise<PlanningSubject[]> {
    return this.invokeIpc('getSubjects');
  }

  async createSubject(subjectData: Partial<PlanningSubject>): Promise<PlanningSubject> {
    return this.invokeIpc('createSubject', subjectData);
  }

  async updateSubject(id: string, subjectData: Partial<PlanningSubject>): Promise<PlanningSubject> {
    return this.invokeIpc('updateSubject', id, subjectData);
  }

  async deleteSubject(id: string): Promise<void> {
    return this.invokeIpc('deleteSubject', id);
  }

  // Teachers
  async getTeachers(): Promise<PlanningTeacher[]> {
    return this.invokeIpc('getTeachers');
  }

  // Schedule
  async getSchedule(): Promise<PlanningSchedule[]> {
    return this.invokeIpc('getSchedule');
  }

  async createScheduleEntry(scheduleData: Partial<PlanningSchedule>): Promise<PlanningSchedule> {
    return this.invokeIpc('createScheduleEntry', scheduleData);
  }

  async updateScheduleEntry(id: string, scheduleData: Partial<PlanningSchedule>): Promise<PlanningSchedule> {
    return this.invokeIpc('updateScheduleEntry', id, scheduleData);
  }

  async deleteScheduleEntry(id: string): Promise<void> {
    return this.invokeIpc('deleteScheduleEntry', id);
  }

  // Breaks
  async getBreaks(): Promise<PlanningBreak[]> {
    return this.invokeIpc('getBreaks');
  }

  async saveBreaks(breaks: PlanningBreak[]): Promise<void> {
    return this.invokeIpc('saveBreaks', breaks);
  }

  async createBreak(breakData: Partial<PlanningBreak>): Promise<PlanningBreak> {
    return this.invokeIpc('createBreak', breakData);
  }

  async updateBreak(id: string, breakData: Partial<PlanningBreak>): Promise<PlanningBreak> {
    return this.invokeIpc('updateBreak', id, breakData);
  }

  async deleteBreak(id: string): Promise<void> {
    return this.invokeIpc('deleteBreak', id);
  }

  // Work Hours Config
  async getWorkHoursConfig(): Promise<WorkHoursConfig | null> {
    return this.invokeIpc('getWorkHoursConfig');
  }

  async saveWorkHoursConfig(config: WorkHoursConfig): Promise<WorkHoursConfig> {
    return this.invokeIpc('saveWorkHoursConfig', config);
  }

  async createWorkHoursConfig(configData: Partial<WorkHoursConfig>): Promise<WorkHoursConfig> {
    return this.invokeIpc('createWorkHoursConfig', configData);
  }

  // Stats
  async getPlanningStats(): Promise<PlanningStats> {
    return this.invokeIpc('getPlanningStats');
  }

  // Utility methods
  async getPlanningData(): Promise<{
    classes: PlanningClass[];
    rooms: PlanningRoom[];
    subjects: PlanningSubject[];
    teachers: PlanningTeacher[];
    schedule: PlanningSchedule[];
    breaks: PlanningBreak[];
    workHours: WorkHoursConfig | null;
    stats: PlanningStats;
  }> {
    const [
      classes,
      rooms,
      subjects,
      teachers,
      schedule,
      breaks,
      workHours,
      stats
    ] = await Promise.all([
      this.getClasses(),
      this.getRooms(),
      this.getSubjects(),
      this.getTeachers(),
      this.getSchedule(),
      this.getBreaks(),
      this.getWorkHoursConfig(),
      this.getPlanningStats()
    ]);

    return {
      classes,
      rooms,
      subjects,
      teachers,
      schedule,
      breaks,
      workHours,
      stats
    };
  }
}

export const planningService = new PlanningService();
