import type React from 'react';

interface CenteredButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export const CenteredButton = ({
  children,
  onClick,
  ref,
}: CenteredButtonProps) => {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        color: 'white',
        backgroundColor: '#007bff',
        border: '2px solid #007bff',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid #ffc107';
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {children}
    </button>
  );
};