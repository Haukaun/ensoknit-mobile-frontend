export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;  // ISO date string from backend
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
}
