import { createContext, useContext, useEffect, useState } from 'react';
import { resolveModal } from '../services/modalManager';
import type { FormData } from '../utils/validation';

interface ModalContextType {
  isModalOpen: boolean;
  closeModal: () => void;
  submitModal: (data: FormData) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    resolveModal(null);
  };

  const submitModal = (data: FormData) => {
    setIsModalOpen(false);
    resolveModal(data);
  };

  useEffect(() => {
    const handleOpenEvent = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openModal', handleOpenEvent);

    return () => {
      window.removeEventListener('openModal', handleOpenEvent);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, closeModal, submitModal }}>
      {children}
    </ModalContext.Provider>
  );
};