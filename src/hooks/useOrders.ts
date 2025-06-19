import { useQuery } from '@tanstack/react-query';

export interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
  delivery_address: string | null;
  customer_phone?: string | null;
  order_type?: string | null;
}

export function useOrders() {
  const { data, isLoading, error } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 1,
  });

  return {
    orders: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
} 