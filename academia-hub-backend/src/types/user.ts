import { Role } from '../prisma/schema';

export interface UserDTO {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: string;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDTO extends Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  status?: string;
  password?: string;
}
