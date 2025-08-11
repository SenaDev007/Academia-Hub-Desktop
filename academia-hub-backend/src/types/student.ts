import { ClassDTO } from './class';
import { UserDTO } from './user';
import { ParentDTO } from './parent';

export interface StudentDTO {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate: Date;
  gender: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId: string;
  classId?: string;
  enrollmentDate: Date;
  status: string;
  studentId?: string;
  medicalInfo?: string;
  allergies?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactAddress?: string;
  userId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserDTO;
  class?: ClassDTO;
  parent?: ParentDTO;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate: Date;
  gender: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId: string;
  classId?: string;
  enrollmentDate?: Date;
  status?: string;
  studentId?: string;
  medicalInfo?: string;
  allergies?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactAddress?: string;
  userId: string;
  parentId?: string;
}

export interface UpdateStudentDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  schoolId?: string;
  classId?: string;
  enrollmentDate?: Date;
  status?: string;
  studentId?: string;
  medicalInfo?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddress?: string;
  userId?: string;
  parentId?: string;
}
