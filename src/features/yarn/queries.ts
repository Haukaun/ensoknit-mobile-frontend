import { useQuery } from '@tanstack/react-query';
import { yarnApi, type YarnFilters } from './api';

export const yarnKeys = {
  all: ['yarn'] as const,
  lists: () => [...yarnKeys.all, 'list'] as const,
  list: (filters?: YarnFilters) => [...yarnKeys.lists(), filters] as const,
  details: () => [...yarnKeys.all, 'detail'] as const,
  detail: (id: number) => [...yarnKeys.details(), id] as const,
};

export function useGetYarns(filters?: YarnFilters) {
  return useQuery({
    queryKey: yarnKeys.list(filters),
    queryFn: () => yarnApi.getAll(filters),
  });
}

export function useGetYarn(id: number | undefined) {
  return useQuery({
    queryKey: yarnKeys.detail(id!),
    queryFn: () => yarnApi.getById(id!),
    enabled: !!id,
  });
}
