import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/api/query-client';
import { useAppStateRefresh } from '@/hooks/use-app-state-refresh';

const queryClient = createQueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useAppStateRefresh();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
