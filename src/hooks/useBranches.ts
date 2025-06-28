
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      console.log('Fetching branches from Supabase...');
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching branches:', error);
        throw error;
      }

      console.log('Branches fetched successfully:', data);
      return data;
    },
  });
};
