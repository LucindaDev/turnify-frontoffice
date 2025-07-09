export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reservation' | 'call-to-action' | 'promotional';
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationCreateInput {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'reservation' | 'call-to-action';
  data?: Record<string, any>;
}