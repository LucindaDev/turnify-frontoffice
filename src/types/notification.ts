import { Database } from "@/integrations/supabase/types";

export type Notification = Database['public']['Tables']['notifications']['Row'];
export interface NotificationCreateInput {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'reservation' | 'call-to-action';
  data?: Record<string, any>;
}