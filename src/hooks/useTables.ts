
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table } from '@/types/branch'; // Assuming you have a Table type defined

export const useTables = (branch_id: number) => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      console.log('Fetching tables from Supabase...');
      
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('status', 'active')
        .eq('branch_id', branch_id);

      if (error) {
        console.error('Error fetching tables:', error);
        throw error;
      }

      console.log('Tables fetched successfully:', data);
      return data as Table[];
    },
  });
};
