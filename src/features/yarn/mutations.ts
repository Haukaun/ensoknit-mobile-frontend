import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yarnApi } from './api';
import { yarnKeys } from './queries';
import type { YarnRequest } from './types';

export function useCreateYarn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: YarnRequest) => yarnApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yarnKeys.lists() });
    },
  });
}

export function useUpdateYarn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: YarnRequest }) => 
      yarnApi.update(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: yarnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: yarnKeys.detail(id) });
    },
  });
}

export function useDeleteYarn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => yarnApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yarnKeys.lists() });
    },
  });
}

export function useMoveYarnToFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, folderId }: { id: number; folderId: number }) => 
      yarnApi.moveToFolder(id, folderId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: yarnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: yarnKeys.detail(id) });
    },
  });
}

export function useRemoveYarnFromFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => yarnApi.removeFromFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yarnKeys.lists() });
    },
  });
}
