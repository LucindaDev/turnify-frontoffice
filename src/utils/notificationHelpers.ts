import { supabase } from '@/integrations/supabase/client';
import { NotificationCreateInput } from '@/types/notification';

// Función para crear notificaciones de reservaciones
export const createReservationNotification = async (
  userId: string,
  type: 'reservation_confirmed' | 'reservation_reminder' | 'reservation_cancelled',
  reservationData: {
    restaurantName: string;
    date: string;
    time: string;
    guests: number;
  }
) => {
  let title = '';
  let message = '';
  let notificationType: NotificationCreateInput['type'] = 'reservation';

  switch (type) {
    case 'reservation_confirmed':
      title = '✅ Reservación confirmada';
      message = `Tu reservación en ${reservationData.restaurantName} para ${reservationData.guests} persona(s) el ${reservationData.date} a las ${reservationData.time} ha sido confirmada.`;
      break;
    case 'reservation_reminder':
      title = '⏰ Recordatorio de reservación';
      message = `Recuerda que tienes una reservación en ${reservationData.restaurantName} hoy a las ${reservationData.time}.`;
      break;
    case 'reservation_cancelled':
      title = '❌ Reservación cancelada';
      message = `Tu reservación en ${reservationData.restaurantName} para el ${reservationData.date} ha sido cancelada.`;
      notificationType = 'warning';
      break;
  }

  const notification: NotificationCreateInput = {
    user_id: userId,
    title,
    message,
    type: notificationType,
    data: {
      type,
      reservation: reservationData
    }
  };

  try {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Función para crear notificaciones promocionales
export const createPromotionalNotification = async (
  userId: string,
  title: string,
  message: string,
  promoData?: Record<string, any>
) => {
  const notification: NotificationCreateInput = {
    user_id: userId,
    title,
    message,
    type: 'info',
    data: {
      type: 'promotional',
      promo: promoData
    }
  };

  try {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Función para enviar notificación de bienvenida
export const createWelcomeNotification = async (userId: string, userName: string) => {
  const notification: NotificationCreateInput = {
    user_id: userId,
    title: `¡Bienvenido a Turnify, ${userName}! 🎉`,
    message: 'Descubre los mejores restaurantes y haz tus reservaciones de manera fácil y rápida.',
    type: 'success',
    data: {
      type: 'welcome'
    }
  };

  try {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating welcome notification:', error);
  }
};