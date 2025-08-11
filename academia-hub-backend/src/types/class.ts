import { UserDTO } from './user';
import { StudentDTO } from './student';
import { TeacherDTO } from './teacher';
import { SubjectDTO } from './subject';

export interface ClassDTO {
  id: string;
  name: string;
  grade: string;
  level?: string;
  section?: string;
  academicYear: string;
  schoolId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  teacher?: TeacherDTO;
  students: StudentDTO[];
  subjects: SubjectDTO[];
}

export interface CreateClassDTO {
  name: string;
  grade: string;
  level?: string;
  section?: string;
  academicYear: string;
  schoolId: string;
  status?: string;
  teacherId?: string;
}

export interface UpdateClassDTO {
  name?: string;
  grade?: string;
  level?: string;
  section?: string;
  academicYear?: string;
  schoolId?: string;
  status?: string;
  teacherId?: string;
}
