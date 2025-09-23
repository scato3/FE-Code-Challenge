import type React from "react";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { modalStyles } from "../styles/modalStyles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnmount?: () => void;
  children: React.ReactNode;
  // 동일 모달 재오픈 시 상태 복구용 키(선택)
  stateKey?: string;
}

export const Modal = ({ isOpen, onClose, onUnmount, children, stateKey }: ModalProps) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { modalRef } = useModalAccessibility({
    isOpen,
    onClose,
    storageKey: stateKey,
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
        transition: prefersReducedMotion ? "none" : "opacity 300ms ease-in-out",
      }}
    >
      <div
        ref={modalRef}
        className="modal-container"
        style={{
          ...modalStyles.modal,
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          transition: prefersReducedMotion
            ? "none"
            : "transform 300ms ease-in-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};
