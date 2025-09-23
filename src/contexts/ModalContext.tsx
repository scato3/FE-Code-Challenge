// ModalContext.tsx
import React from "react";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useCallback,
  useState,
  useRef,
} from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";

interface ModalContextType {
  openModal: <T = unknown>(factory: ModalFactory) => Promise<T | null>;
  closeModal: () => void;
  submitModal: (data: unknown) => void;
  isOpen: boolean;
}

type ModalFactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  onUnmount: () => void;
};

type ModalFactory = (props: ModalFactoryProps) => ReactElement | null;

type ModalItem = {
  id: string;
  isOpen: boolean;
  isClosing: boolean;
  factory: ModalFactory;
  resolvePromise: ((value: unknown) => void) | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal(): ModalContextType {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}

interface ModalProviderProps {
  children: ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const modalIdCounter = useRef(0);

  function openModal<T = unknown>(factory: ModalFactory): Promise<T | null> {
    return new Promise<T | null>((resolve) => {
      const id = `modal-${++modalIdCounter.current}`;

      const newModal: ModalItem = {
        id,
        isOpen: true,
        isClosing: false,
        factory,
        resolvePromise: resolve as (value: unknown) => void,
      };

      setModals((prev) => [...prev, newModal]);
    });
  }

  const closeModal = useCallback(() => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.isOpen ? { ...modal, isOpen: false, isClosing: true } : modal
      )
    );
  }, []);

  const submitModal = useCallback((data: unknown) => {
    setModals((prev) => {
      const activeModal = prev.find((m) => m.isOpen && !m.isClosing);
      if (activeModal?.resolvePromise) {
        activeModal.resolvePromise(data);
      }
      return prev.map((modal) =>
        modal.isOpen ? { ...modal, isOpen: false, isClosing: true } : modal
      );
    });
  }, []);

  const handleModalUnmount = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.resolvePromise && modal.isClosing) {
        modal.resolvePromise(null);
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  // 현재 활성 모달이 있는지 확인
  const isOpen = modals.some((modal) => modal.isOpen);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, submitModal }}
    >
      {children}
      {/* Always render all modal items; no conditional null rendering */}
      {modals.map((modal) => (
        <ErrorBoundary
          key={modal.id}
          fallback={
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                textAlign: "center",
                zIndex: 1000,
              }}
            >
              <h3>모달 로딩 중 오류가 발생했습니다</h3>
              <button
                onClick={() => handleModalUnmount(modal.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                닫기
              </button>
            </div>
          }
        >
          {modal.factory({
            isOpen: modal.isOpen,
            onClose: closeModal,
            onSubmit: submitModal,
            onUnmount: () => handleModalUnmount(modal.id),
          })}
        </ErrorBoundary>
      ))}
    </ModalContext.Provider>
  );
}
