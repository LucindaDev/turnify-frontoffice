import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneValidation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const sendVerificationCode = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-sms-verification', {
        body: { phone_number: "+52" + phoneNumber }
      });

      if (error) throw error;

      toast({
        title: "Código enviado",
        description: "Te hemos enviado un código de verificación por SMS",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el código de verificación",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    setIsValidating(true);
    try {
      const { error } = await supabase.functions.invoke('verify-phone-code', {
        body: { verification_code: code }
      });

      if (error) throw error;

      toast({
        title: "¡Teléfono validado!",
        description: "Tu número de teléfono ha sido validado exitosamente",
        duration: 3000
      });

      // Disparar evento personalizado para notificar la validación exitosa
      window.dispatchEvent(new CustomEvent('phoneValidated'));

      return { success: true };
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Código incorrecto",
        description: error.message || "El código ingresado no es válido",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    isLoading,
    isValidating
  };
};