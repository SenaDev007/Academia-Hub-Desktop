export interface SchoolDTO {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
  website?: string;
  description?: string;
  academicYear: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSchoolDTO {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  logo?: string;
  website?: string;
  description?: string;
  academicYear?: string;
  status?: string;
}
