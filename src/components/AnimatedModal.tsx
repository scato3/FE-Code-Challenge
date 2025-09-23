import { type ReactNode } from 'react';
import { type ModalRenderProps, useModal } from '../contexts/ModalContext';

interface AnimatedModalProps {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  title?: string;
  children?: ReactNode;
}

export const AnimatedModal = ({
  isOpen,
  close,
  unmount,
  title = 'Modal',
  children
}: AnimatedModalProps) => {
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'opacity' && !isOpen) {
      unmount();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      onTransitionEnd={handleTransitionEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
        zIndex: 1000
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms ease-in-out'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>{title}</h2>
          <button
            onClick={close}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              color: '#666',
              lineHeight: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const useAnimatedModal = () => {
  const { open } = useModal();

  const openModal = (id: string, props: Omit<AnimatedModalProps, 'isOpen' | 'close' | 'unmount'>) => {
    open(id, (controls: ModalRenderProps) => (
      <AnimatedModal {...props} {...controls} />
    ));
  };

  return { openModal };
};