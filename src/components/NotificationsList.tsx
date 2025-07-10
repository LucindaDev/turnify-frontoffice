import React from 'react';

// UI
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePhoneValidationModal } from '@/components/PhoneValidationWrapper';
import {
  Bell,
  CheckCheck
} from 'lucide-react';

// Hooks
import { useNotifications } from '@/hooks/useNotifications';

// Components
import NotificationsItem from './NotificationItem';
import checkPhoneValidation from '@/utils/phoneValidation';

interface NotificationsListProps {
  onClose: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  console.log('NotificationsList.tsx',notifications);
  const { openPhoneValidation } = usePhoneValidationModal();


  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Manejar acciones especiales para notificaciones call-to-action
    if (notification.type === 'call-to-action' && notification.data?.action === 'validate_phone') {
      // Verificar si el teléfono ya está validado
      const isPhoneValidated = await checkPhoneValidation();
      if (!isPhoneValidated) {
        openPhoneValidation();
      }
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7 px-2"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              console.log('NotificationItem',notification);
              return (
                <NotificationsItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationsList;