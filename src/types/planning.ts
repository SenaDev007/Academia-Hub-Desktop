export interface PlanningClass {
  id: string;
  name: string;
  level: string;
  students: number;
  mainTeacher: string;
  room: string;
  teacherId?: string;
  roomId?: string;
}

export interface PlanningRoom {
  id: string;
  name: string;
  type: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
}

export interface PlanningSubject {
  id: string;
  name: string;
  code: string;
  level: string;
  coefficient: number;
}

export interface PlanningTeacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  hoursPerWeek: number;
  userId?: string;
}

export interface PlanningSchedule {
  id: string;
  day: string;
  time: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
  duration: string;
  dayOfWeek: number;
  durationMinutes: number;
  subjectId: string;
  teacherId: string;
  classId: string;
  roomId?: string;
}

export interface PlanningBreak {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  levels: string[];
}

export interface WorkHoursConfig {
  id: string;
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  courseDuration: number;
  breakBetweenCourses: number;
  workDays: number[];
}

export interface RoomReservation {
  id: string;
  roomId: string;
  teacherId: string;
  title: string;
  description?: string;
  startDatetime: string;
  endDatetime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface PlanningStats {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  hoursPerWeek: number;
}

export interface TeacherAvailability {
  id: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
