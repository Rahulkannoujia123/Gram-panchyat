import React from 'react';
import { colors } from '../utils/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    border: 'none',
  },
  secondary: {
    backgroundColor: colors.primary.light,
    color: colors.primary.dark,
    border: 'none',
  },
  outlined: {
    backgroundColor: 'transparent',
    color: colors.primary.main,
    border: `2px solid ${colors.primary.main}`,
  },
  text: {
    backgroundColor: 'transparent',
    color: colors.primary.main,
    border: 'none',
  },
  danger: {
    backgroundColor: colors.status.error,
    color: colors.neutral.white,
    border: 'none',
  },
};

const sizeStyles = {
  small: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '6px',
  },
  medium: {
    padding: '10px 16px',
    fontSize: '14px',
    borderRadius: '8px',
  },
  large: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '10px',
  },
};

export const Button = React.memo(function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      style={{
        ...variantStyle,
        ...sizeStyle,
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = `0 4px 12px ${colors.shadow}`;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
      {...props}
    >
      {loading && <span style={{ display: 'inline-block', animation: 'spin 0.6s linear infinite' }}>⏳</span>}
      {children}
    </button>
  );
});
