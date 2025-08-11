import { UserDTO } from './user';
import { ClassDTO } from './class';
import { TeacherDTO } from './teacher';

export interface SubjectDTO {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  schoolId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  teacher?: TeacherDTO;
  classes: ClassDTO[];
}

export interface CreateSubjectDTO {
  name: string;
  code: string;
  description?: string;
  credits: number;
  schoolId: string;
  status?: string;
  teacherId?: string;
}

export interface UpdateSubjectDTO {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  schoolId?: string;
  status?: string;
  teacherId?: string;
}
