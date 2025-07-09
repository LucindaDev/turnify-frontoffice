import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneValidationNotification = () => {
  const [hasCreatedNotification, setHasCreatedNotification] = useState(false);
  const { toast } = useToast();

  const createPhoneValidationNotification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar si ya existe una notificación de validación de teléfono
      const { data: existingNotifications } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'call-to-action')
        .eq('title', 'Valida tu número de teléfono');

      if (existingNotifications && existingNotifications.length > 0) {
        setHasCreatedNotification(true);
        return;
      }

      // Crear la notificación
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Valida tu número de teléfono',
          message: 'Acción requerida para el correcto funcionamiento de la app: valida tu número de teléfono.',
          type: 'call-to-action',
          data: { action: 'validate_phone' }
        });

      if (error) {
        console.error('Error creating phone validation notification:', error);
      } else {
        setHasCreatedNotification(true);
      }
    } catch (error) {
      console.error('Error in createPhoneValidationNotification:', error);
    }
  };

  const removePhoneValidationNotification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('type', 'call-to-action')
        .eq('title', 'Valida tu número de teléfono');

      if (error) {
        console.error('Error removing phone validation notification:', error);
      }
    } catch (error) {
      console.error('Error in removePhoneValidationNotification:', error);
    }
  };

  const checkAndManageNotification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener el perfil del usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('phone_validated')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      if (!profile.phone_validated && !hasCreatedNotification) {
        // Crear notificación si el teléfono no está validado
        await createPhoneValidationNotification();
      } else if (profile.phone_validated) {
        // Eliminar notificación si el teléfono ya está validado
        await removePhoneValidationNotification();
      }
    } catch (error) {
      console.error('Error in checkAndManageNotification:', error);
    }
  };

  useEffect(() => {
    checkAndManageNotification();

    // Escuchar evento de validación exitosa
    const handlePhoneValidated = () => {
      removePhoneValidationNotification();
    };

    window.addEventListener('phoneValidated', handlePhoneValidated);

    return () => {
      window.removeEventListener('phoneValidated', handlePhoneValidated);
    };
  }, [hasCreatedNotification]);

  return {
    createPhoneValidationNotification,
    removePhoneValidationNotification,
    checkAndManageNotification
  };
};