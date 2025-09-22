import type React from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { modalStyles } from '../styles/modalStyles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const { modalRef } = useModalAccessibility({
    isOpen,
    onClose,
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={modalStyles.overlay}
    >
      <div ref={modalRef} className="modal-container" style={modalStyles.modal}>
        {children}
      </div>
    </div>
  );
};
