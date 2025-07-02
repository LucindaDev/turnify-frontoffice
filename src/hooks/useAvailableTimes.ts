

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table } from '@/types/branch';

/**
 * Custom React hook to retrieve available reservation times for a specific branch.
 *
 * @param opens_at - The opening time of the branch in HH:mm format.
 * @param closes_at - The closing time of the branch in HH:mm format.
 * @param reservation_date - The date for which to check available reservation slots.
 * @param number_of_guests - The number of guests for the reservation.
 * @returns An array representing the available times for the given parameters.
 */
export const useAvailableTimes = (opens_at: string, closes_at: string, reservation_date: Date, number_of_guests: number) => {
    
}