import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationCreateInput } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allReaded, setAllReaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as Notification[];
      console.log(typedData);
      setNotifications(typedData);
      setUnreadCount(typedData.filter(n => !n.read).length);

      const isAllReaded = typedData.every(n => n.read);
      setAllReaded(isAllReaded);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, status: 'active' })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => {
        const updatedNotifications = prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        
        // Calcular allReaded con el estado actualizado
        const isAllReaded = updatedNotifications.every(n => n.read);
        setAllReaded(isAllReaded);
        
        return updatedNotifications;
      });
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, status: 'active' })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true})));
      setUnreadCount(0);
      setAllReaded(true);
    } catch (error) { 
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ status: 'inactive' })
        .eq('user_id', user.id)

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true, status: 'inactive' })));
      setAllReaded(true)
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  }

  // Create notification (for system use)
  const createNotification = async (notification: NotificationCreateInput) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({ ...notification, status: 'active' });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        fetchNotifications();
        
        // Subscribe to realtime changes
        const channel = supabase
          .channel('notifications-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const newNotification = payload.new as Notification;
              setNotifications(prev => [newNotification, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Show toast for new notification
              toast({
                title: newNotification.title,
                description: newNotification.message,
                variant: newNotification.type === 'error' ? 'destructive' : 'default',
              });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const updatedNotification = payload.new as Notification;
              setNotifications(prev => 
                prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
              );
              
              // Update unread count
              if (updatedNotification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    
    setupSubscription();
  }, [toast]);

  return {
    notifications,
    unreadCount,
    allReaded,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotifications,
    createNotification,
    refetch: fetchNotifications
  };
};