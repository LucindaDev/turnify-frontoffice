
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reservation {
  id: number;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  user_id?: string;
  branch_id: number;
  table_id?: number;
  reservation_type: 'traditional' | 'time_limited';
  reservation_date: string;
  reservation_time: string;
  arrival_time?: string;
  seated_at?: string;
  finished_at?: string;
  number_of_guests: number;
  status: 'scheduled' | 'seated' | 'finished' | 'cancelled' | 'no_show';
  estimated_duration_minutes?: number;
  actual_duration_minutes?: number;
  wait_time_minutes?: number;
  late_arrival: boolean;
  no_show: boolean;
  cancelled_by?: string;
  cancellation_reason?: string;
  notes?: string;
  branches?: {
    name: string;
    location: string;
    images: string[];
  };
}

export interface CreateReservationData {
  branch_id: number;
  reservation_type: 'traditional' | 'time_limited';
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
}

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      console.log('Fetching user reservations...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          branches (
            name,
            location,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }

      console.log('Reservations fetched successfully:', data);
      return data as Reservation[];
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {
      console.log('Creating reservation:', reservationData);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            ...reservationData,
            user_id: user.id,
            status: 'scheduled'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating reservation:', error);
        throw error;
      }

      console.log('Reservation created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservación confirmada",
        description: "Tu reservación ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      toast({
        variant: "destructive",
        title: "Error al crear reservación",
        description: "Hubo un problema al crear tu reservación. Inténtalo de nuevo.",
      });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Reservation> }) => {
      console.log('Updating reservation:', id, updates);

      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reservation:', error);
        throw error;
      }

      console.log('Reservation updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservación actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating reservation:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "Hubo un problema al actualizar tu reservación.",
      });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      console.log('Cancelling reservation:', id, reason);

      const { data, error } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          cancelled_by: 'customer',
          cancellation_reason: reason
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling reservation:', error);
        throw error;
      }

      console.log('Reservation cancelled successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservación cancelada",
        description: "Tu reservación ha sido cancelada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error cancelling reservation:', error);
      toast({
        variant: "destructive",
        title: "Error al cancelar",
        description: "Hubo un problema al cancelar tu reservación.",
      });
    },
  });
};
