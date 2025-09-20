import type React from 'react';

type CenteredButtonProps = React.ComponentPropsWithoutRef<'button'>;

export const CenteredButton = ({
  children,
  onClick,
  ...props
}: CenteredButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      {...props}
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