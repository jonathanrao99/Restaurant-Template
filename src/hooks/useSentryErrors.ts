import { useQuery } from '@tanstack/react-query';

export interface SentryStats {
  total: number;
  stats: [number, number][]; // [timestamp, count]
}

export function useSentryErrors() {
  const { data, isLoading, error } = useQuery<SentryStats, Error>({
    queryKey: ['sentryErrors'],
    queryFn: async () => {
      const res = await fetch('/api/sentry-errors');
      if (!res.ok) throw new Error('Failed to fetch Sentry error stats');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    total: data?.total ?? 0,
    stats: data?.stats ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
} 