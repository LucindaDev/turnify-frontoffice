
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table } from '@/types/branch'; // Assuming you have a Table type defined

export const useTables = (branch_id: number) => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {

      // Delay de 3 segundos
      //await new Promise((resolve) => setTimeout(resolve, 3000));

      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('status', 'active')
        .eq('branch_id', branch_id);

      if (error) {
        console.error('Error fetching tables:', error);
        throw error;
      }
      
      return data as Table[];
    },
  });
};
