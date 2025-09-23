import type React from "react";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { modalStyles } from "../styles/modalStyles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnmount?: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, onUnmount, children }: ModalProps) => {
  const { modalRef } = useModalAccessibility({
    isOpen,
    onClose,
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === "opacity" && !isOpen && onUnmount) {
      onUnmount();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onTransitionEnd={handleTransitionEnd}
      style={{
        ...modalStyles.overlay,
        opacity: isOpen ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
      }}
    >
      <div
        ref={modalRef}
        className="modal-container"
        style={{
          ...modalStyles.modal,
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          transition: "transform 300ms ease-in-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};
