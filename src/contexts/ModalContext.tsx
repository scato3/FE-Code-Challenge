// ModalContext.tsx
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useRef,
  useState,
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
};

type ModalFactory = (props: ModalFactoryProps) => ReactElement | null;

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [factory, setFactory] = useState<ModalFactory | null>(null);
  const resolvePromiseRef = useRef<((value: unknown) => void) | null>(null);

  function openModal<T = unknown>(f: ModalFactory): Promise<T | null> {
    return new Promise<T | null>((resolve) => {
      setIsOpen(true);
      setFactory(() => f);
      resolvePromiseRef.current = resolve as unknown as (
        value: unknown
      ) => void;
    });
  }

  function closeModal(): void {
    setIsOpen(false);
    setFactory(null);
    if (resolvePromiseRef.current) {
      // 사용자가 취소한 경우 null 반환
      resolvePromiseRef.current(null);
      resolvePromiseRef.current = null;
    }
  }

  function submitModal(data: unknown): void {
    setIsOpen(false);
    setFactory(null);
    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(data);
      resolvePromiseRef.current = null;
    }
  }

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, submitModal }}
    >
      {children}
      {factory && (
        <ErrorBoundary
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
                onClick={closeModal}
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
          {factory({
            isOpen,
            onClose: closeModal,
            onSubmit: submitModal,
          })}
        </ErrorBoundary>
      )}
    </ModalContext.Provider>
  );
}
