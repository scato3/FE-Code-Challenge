export const COLORS = {
  primary: '#007bff',
  primaryHover: '#0056b3',
  secondary: '#6c757d',
  danger: '#dc3545',
  text: {
    primary: '#333',
    secondary: '#666',
    inverse: '#fff',
  },
  border: {
    default: '#ddd',
    focus: '#007bff',
    error: '#dc3545',
  },
  background: {
    overlay: 'rgba(0, 0, 0, 0.5)',
    modal: '#fff',
    transparent: 'transparent',
  },
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
} as const;

export const TYPOGRAPHY = {
  fontSize: {
    sm: '14px',
    base: '16px',
    lg: '1.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
  },
} as const;

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
} as const;

export const Z_INDEX = {
  modal: 1000,
} as const;

export const BREAKPOINTS = {
  mobile: '768px',
} as const;

export const TRANSITIONS = {
  fast: '0.2s',
  ease: 'ease-out',
  all: 'all 0.2s',
} as const;
