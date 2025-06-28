
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/branch'; 

export const useBranches = (branch_id?:number) => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      console.log('Fetching branches from Supabase...');

      let query = supabase
        .from('branches')
        .select('*')
        .eq('status', 'active');

      if (branch_id) {
        query = query.eq('id', branch_id);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching branches:', error);
        throw error;
      }

      console.log('Branches fetched successfully:', data);
      return data as Branch[];
    },
  });
};
