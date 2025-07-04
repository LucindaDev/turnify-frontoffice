type ReservationStatus =
  | 'scheduled'
  | 'cancelled'
  | 'arrival_to_restaurant'
  | 'seated'
  | 'has_ordered'
  | 'is_served'
  | 'asked_for_bill'
  | 'no_show'
  | 'finished';

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
  status: ReservationStatus;
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