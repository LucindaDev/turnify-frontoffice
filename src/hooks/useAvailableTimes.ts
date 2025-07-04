import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useTables } from '@/hooks/useTables';

interface AvailableTime {
  time: string;
  available: boolean;
  availableTables: number;
}

/**
 * Custom React hook to retrieve available reservation times for a specific branch.
 *
 * @param branch_id - The ID of the branch for which to check available reservation slots.
 * @param reservation_date - The date for which to check available reservation slots.
 * @param number_of_guests - The number of guests for the reservation.
 * @returns An array representing the available times for the given parameters.
 */
export const useAvailableTimes = (branch_id: number, reservation_date: Date | null, number_of_guests: number) => {
  const { data: branches } = useBranches(branch_id);
  const { data: tables } = useTables(branch_id);
  
  const branch = branches && branches.length > 0 ? branches[0] : null;

  return useQuery({
    queryKey: ['availableTimes', branch_id, reservation_date?.toISOString(), number_of_guests],
    queryFn: async () => {
      console.log('Fetching available times for:', { branch_id, reservation_date, number_of_guests });

      if (!branch || !tables || !reservation_date) {
        console.log('Branch, tables, or reservation_date not available yet');
        return [];
      }

      // Get suitable tables for the number of guests
      const suitableTables = tables.filter(table => 
        table.status === 'active' && table.places >= number_of_guests
      );

      console.log('Suitable tables found:', suitableTables);

      if (suitableTables.length === 0) {
        console.log('No suitable tables found for guest count:', number_of_guests);
        return [];
      }

      // Generate time slots based on branch hours
      const timeSlots = generateTimeSlots(branch.opens_at, branch.closes_at, reservation_date);

      console.log('Generated time slots:', timeSlots);

      // Get existing reservations for the date
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('branch_id', branch_id)
        .eq('reservation_date', reservation_date.toISOString().split('T')[0])
        .in('status', ['scheduled', 'seated']);

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }

      console.log('Found reservations:', reservations);

      // Calculate available times
      const availableTimes = timeSlots.map(timeSlot => {
        const occupiedTables = getOccupiedTablesForTime(reservations || [], timeSlot);
        const availableTablesForSlot = suitableTables.filter(table => 
          !occupiedTables.includes(table.id)
        );

        return {
          time: timeSlot,
          available: availableTablesForSlot.length > 0,
          availableTables: availableTablesForSlot.length
        };
      });

      console.log('Available times calculated:', availableTimes);
      return availableTimes.filter(slot => slot.available).map(slot => slot.time);
    },
    // Solo ejecutar cuando tenemos todos los parámetros válidos
    enabled: !!(
      branch_id && 
      branch_id > 0 && 
      branch && 
      tables && 
      tables.length > 0 && 
      reservation_date && 
      number_of_guests && 
      number_of_guests > 0
    ),
  });
};

function generateTimeSlots(opensAt: string | null, closesAt: string | null, reservationDate: Date): string[] {
  console.log(opensAt, closesAt, reservationDate);
  if (!opensAt || !closesAt) return [];

  const slots: string[] = [];
  const now = new Date();
  const isToday = reservationDate.toDateString() === now.toDateString();

  console.log(isToday)

  // Parse opening and closing times
  const [openHour, openMinute] = opensAt.split(':').map(Number);
  const [closeHour, closeMinute] = closesAt.split(':').map(Number);

  // Create time slots every 30 minutes
  let currentHour = openHour;
  let currentMinute = openMinute;

  while (currentHour < closeHour || (currentHour === closeHour && currentMinute <= closeMinute)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // If it's today, only include times that are at least 30 minutes from now
    if (isToday) {
      const slotTime = new Date(reservationDate);
      slotTime.setHours(currentHour, currentMinute, 0, 0);
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      
      if (slotTime >= thirtyMinutesFromNow) {
        slots.push(timeString);
      }
    } else {
      slots.push(timeString);
    }

    // Increment by 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return slots;
}

function getOccupiedTablesForTime(reservations: any[], timeSlot: string): number[] {
  const occupiedTables: number[] = [];
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
  const slotTimeInMinutes = slotHour * 60 + slotMinute;

  reservations.forEach(reservation => {
    if (!reservation.table_id) return;

    const [resHour, resMinute] = reservation.reservation_time.split(':').map(Number);
    const reservationTimeInMinutes = resHour * 60 + resMinute;
    
    // Default duration if not specified (2 hours for traditional, use estimated for time_limited)
    const defaultDuration = reservation.reservation_type === 'time_limited' ? 90 : 120;
    const duration = reservation.estimated_duration_minutes || defaultDuration;
    
    const reservationEndTime = reservationTimeInMinutes + duration;

    // Check if the slot overlaps with this reservation
    // Overlap occurs if slot starts before reservation ends and slot ends after reservation starts
    const slotEndTime = slotTimeInMinutes + 120; // Assume 2 hour slots for checking
    
    if (slotTimeInMinutes < reservationEndTime && slotEndTime > reservationTimeInMinutes) {
      occupiedTables.push(reservation.table_id);
    }
  });

  return occupiedTables;
}
