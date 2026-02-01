import { apiClient } from '@/lib/api/client';
import type { AuthResponse, SignInRequest, SignUpRequest, UserResponse } from './types';

export const authApi = {
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  signUp: async (data: SignUpRequest): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/register', data);
    return response.data;
  },

  signOut: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/logout');
    return response.data;
  },
};
