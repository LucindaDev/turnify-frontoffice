import React, { createContext, useContext, useState } from 'react';
import PhoneValidationModal from './PhoneValidationModal';

interface PhoneValidationContextType {
  openPhoneValidation: (title?: string, description?: string) => void;
  closePhoneValidation: () => void;
}

const PhoneValidationContext = createContext<PhoneValidationContextType | undefined>(undefined);

export const usePhoneValidationModal = () => {
  const context = useContext(PhoneValidationContext);
  if (!context) {
    throw new Error('usePhoneValidationModal must be used within PhoneValidationProvider');
  }
  return context;
};

interface PhoneValidationProviderProps {
  children: React.ReactNode;
}

export const PhoneValidationProvider: React.FC<PhoneValidationProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalDescription, setModalDescription] = useState<string>();

  const openPhoneValidation = (title?: string, description?: string) => {
    setModalTitle(title);
    setModalDescription(description);
    setIsOpen(true);
  };

  const closePhoneValidation = () => {
    setIsOpen(false);
    setModalTitle(undefined);
    setModalDescription(undefined);
  };

  return (
    <PhoneValidationContext.Provider value={{ openPhoneValidation, closePhoneValidation }}>
      {children}
      <PhoneValidationModal
        isOpen={isOpen}
        onClose={closePhoneValidation}
        title={modalTitle}
        description={modalDescription}
      />
    </PhoneValidationContext.Provider>
  );
};