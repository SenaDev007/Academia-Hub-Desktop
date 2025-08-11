import { UserDTO } from './user';
import { ClassDTO } from './class';
import { SubjectDTO } from './subject';

export interface TeacherDTO {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId: string;
  department?: string;
  specialization?: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDTO;
  classes: ClassDTO[];
  subjects: SubjectDTO[];
}

export interface CreateTeacherDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId: string;
  department?: string;
  specialization?: string;
  status?: string;
  userId: string;
}

export interface UpdateTeacherDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId?: string;
  department?: string;
  specialization?: string;
  status?: string;
  userId?: string;
}
