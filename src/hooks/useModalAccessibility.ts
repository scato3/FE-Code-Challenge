import { useCallback, useEffect, useRef } from 'react';

interface UseModalAccessibilityProps {
  isOpen: boolean;
  onClose: () => void;
  // 동일한 종류의 모달 간 재오픈 시 상태(스크롤/포커스)를 복구하기 위한 키
  storageKey?: string;
}

// 포커스 가능한 요소들을 찾는 셀렉터
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';

// 모달 상태를 언마운트 이후에도 유지하기 위한 모듈 레벨 저장소
const modalState = new Map<string, { scrollTop: number; lastFocusedName?: string }>();

export const useModalAccessibility = ({
  isOpen,
  onClose,
  storageKey,
}: UseModalAccessibilityProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);
  // 모달 내부 스크롤/포커스 상태 저장용
  const lastScrollTop = useRef(0);
  const lastFocusedInModal = useRef<HTMLElement | null>(null);

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

  // 모달 내부에서 포커스 이동을 추적하여 다음 오픈 때 복원 가능하게 함
  const handleFocusIn = useCallback((e: Event) => {
    const target = e.target as HTMLElement | null;
    if (target && modalRef.current && modalRef.current.contains(target)) {
      lastFocusedInModal.current = target;
      // 마지막 포커스된 요소의 name을 저장해 다음 오픈 때 복구
      if (storageKey) {
        const nameAttr = target.getAttribute('name') || undefined;
        // name이 있는 폼 필드에 포커스 되었을 때만 저장 (취소 버튼 등은 무시)
        if (nameAttr) {
          const current = modalState.get(storageKey) ?? { scrollTop: 0 };
          modalState.set(storageKey, { ...current, lastFocusedName: nameAttr });
        }
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (isOpen) {
      previousFocusedElement.current = document.activeElement as HTMLElement;

      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      const node = modalRef.current;
      node?.addEventListener('focusin', handleFocusIn as EventListener, true);

      requestAnimationFrame(() => {
        // 스크롤 위치 복원
        if (modalRef.current) {
          const savedScroll = storageKey
            ? modalState.get(storageKey)?.scrollTop ?? 0
            : lastScrollTop.current || 0;
          modalRef.current.scrollTop = savedScroll;
        }

        // 포커스 복원 우선순위: 마지막 포커스 요소 > 제목 > 첫 포커스 가능 요소
        const dialogEl = modalRef.current?.querySelector('[role="dialog"]') as
          | HTMLElement
          | null;
        const labelledby = dialogEl?.getAttribute('aria-labelledby');
        const titleEl = labelledby
          ? (modalRef.current?.querySelector(`#${labelledby}`) as
              | HTMLElement
              | null)
          : null;

        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];

        // 저장된 name으로 요소를 우선 탐색
        let candidate: HTMLElement | null | undefined = null;
        if (storageKey) {
          const savedName = modalState.get(storageKey)?.lastFocusedName;
          if (savedName && modalRef.current) {
            candidate = modalRef.current.querySelector(
              `[name="${CSS.escape(savedName)}"]`,
            ) as HTMLElement | null;
          }
        }

        // 현재 인스턴스에서 추적한 마지막 포커스 > 저장된 name > 제목 > 첫 요소
        candidate =
          (lastFocusedInModal.current &&
          modalRef.current?.contains(lastFocusedInModal.current)
            ? lastFocusedInModal.current
            : null) || candidate || titleEl || firstElement;

        candidate?.focus();
      });
    } else {
      // 스크롤 위치 저장
      if (modalRef.current) {
        const currentTop = modalRef.current.scrollTop;
        lastScrollTop.current = currentTop;
        if (storageKey) {
          const current = modalState.get(storageKey) ?? { scrollTop: 0 };
          const lastName = lastFocusedInModal.current?.getAttribute('name') || current.lastFocusedName;
          modalState.set(storageKey, { scrollTop: currentTop, lastFocusedName: lastName });
        }
      }

      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);

      if (previousFocusedElement.current) {
        previousFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      modalRef.current?.removeEventListener(
        'focusin',
        handleFocusIn as EventListener,
        true,
      );
    };
  }, [isOpen, handleKeyDown, getFocusableElements, handleFocusIn, storageKey]);

  return {
    modalRef,
  };
};
