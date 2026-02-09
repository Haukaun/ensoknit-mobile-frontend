import { apiClient } from '@/lib/api/client';
import type { YarnRequest, YarnResponse } from './types';

export interface YarnFilters {
  category?: string;
  folderId?: number;
  unsorted?: boolean;
  brand?: string;
}

export const yarnApi = {
  getAll: async (filters?: YarnFilters) => {
    const { data } = await apiClient.get<YarnResponse[]>('/api/yarn', { params: filters });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<YarnResponse>(`/api/yarn/${id}`);
    return data;
  },

  create: async (request: YarnRequest) => {
    const { data } = await apiClient.post<YarnResponse>('/api/yarn', request);
    return data;
  },

  update: async (id: number, request: YarnRequest) => {
    const { data } = await apiClient.put<YarnResponse>(`/api/yarn/${id}`, request);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/yarn/${id}`);
  },

  moveToFolder: async (id: number, folderId: number) => {
    const { data } = await apiClient.put<YarnResponse>(`/api/yarn/${id}/folder/${folderId}`);
    return data;
  },

  removeFromFolder: async (id: number) => {
    const { data } = await apiClient.delete<YarnResponse>(`/api/yarn/${id}/folder`);
    return data;
  },
};
