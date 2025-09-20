import { createContext, useContext, useState, useRef } from "react";
import type { ReactNode } from "react";

interface ModalContextType {
  openModal: <T = unknown>(modalComponent: ReactNode) => Promise<T | null>;
  closeModal: () => void;
  submitModal: (data: unknown) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<ReactNode>(null);
  const resolvePromiseRef = useRef<Function | null>(null);

  function openModal<T = unknown>(
    modalComponent: ReactNode
  ): Promise<T | null> {
    return new Promise<T | null>((resolve) => {
      setIsModalOpen(true);
      setCurrentModal(modalComponent);
      resolvePromiseRef.current = resolve;
    });
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModal(null);
    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(null);
      resolvePromiseRef.current = null;
    }
  };

  const submitModal = (data: unknown) => {
    setIsModalOpen(false);
    setCurrentModal(null);
    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(data);
      resolvePromiseRef.current = null;
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, submitModal }}>
      {children}
      {currentModal}
    </ModalContext.Provider>
  );
};
