import { createClient } from '@/utils/supabase/client';

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
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 1,
  });

  // Return orders data
  return {
    orders: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
} 