export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  subdomain: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
