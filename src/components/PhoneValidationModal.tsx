import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { Phone, MessageSquare } from 'lucide-react';

interface PhoneValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const PhoneValidationModal: React.FC<PhoneValidationModalProps> = ({
  isOpen,
  onClose,
  title = "Validación de teléfono",
  description = "Para continuar con la reservación, primero debes configurar y validar tu número de teléfono celular."
}) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { sendVerificationCode, verifyCode, isLoading, isValidating } = usePhoneValidation();

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) return;
    
    const result = await sendVerificationCode(phoneNumber);
    if (result.success) {
      setStep('code');
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) return;
    
    const result = await verifyCode(verificationCode);
    if (result.success) {
      onClose();
      // Reset state
      setStep('phone');
      setPhoneNumber('');
      setVerificationCode('');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state when closing
    setStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'phone' ? <Phone className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 'phone' ? (
            <>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSendCode} 
                  disabled={!phoneNumber.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Enviando...' : 'Enviar código'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Hemos enviado un código de 4 dígitos a <strong>{phoneNumber}</strong>
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={4} 
                    value={verificationCode}
                    onChange={setVerificationCode}
                    disabled={isValidating}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('phone')}
                  className="flex-1"
                  disabled={isValidating}
                >
                  Cambiar número
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 4 || isValidating}
                  className="flex-1"
                >
                  {isValidating ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneValidationModal;