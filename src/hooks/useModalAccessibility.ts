import { useCallback, useEffect, useRef } from 'react';

interface UseModalAccessibilityProps {
  isOpen: boolean;
  onClose: () => void;
}

// 포커스 가능한 요소들을 찾는 셀렉터
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';

export const useModalAccessibility = ({
  isOpen,
  onClose,
}: UseModalAccessibilityProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

  // 모달 내 포커스 가능한 요소들 조회
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
    ) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose, getFocusableElements],
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusedElement.current = document.activeElement as HTMLElement;

      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      requestAnimationFrame(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      });
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);

      if (previousFocusedElement.current) {
        previousFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, getFocusableElements]);

  return {
    modalRef,
  };
};
