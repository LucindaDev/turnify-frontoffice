
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Reservation, CreateReservationData } from '@/types/reservation';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {

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

      return data as Reservation[];
    },
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: async () => {
      if (!id) throw new Error('ID de reservación requerido');

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          branches (
            name,
            location,
            images,
            opens_at,
            closes_at
          )
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) {
        console.error('Error fetching reservation:', error);
        throw error;
      }

      return data as Reservation & {
        branches: {
          name: string;
          location: string;
          images: string[];
          opens_at: string;
          closes_at: string;
        };
      };
    },
    enabled: !!id,
  });
};


export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reservationData: CreateReservationData) => {

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

      // Exclude 'id' from updates to avoid type error
      const { id: _id, ...updatesWithoutId } = updates as Partial<Reservation> & { id?: number };
      const { data, error } = await supabase
        .from('reservations')
        .update(updatesWithoutId)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reservation:', error);
        throw error;
      }

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
