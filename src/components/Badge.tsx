import React from 'react';
import { colors } from '../utils/colors';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'small' | 'medium';
}

const variantStyles = {
  primary: {
    backgroundColor: colors.primary.light,
    color: colors.primary.dark,
  },
  success: {
    backgroundColor: '#F1F8E9',
    color: '#558B2F',
  },
  warning: {
    backgroundColor: colors.accent.light,
    color: colors.accent.dark,
  },
  error: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  info: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
};

export const Badge = React.memo(function Badge({
  variant = 'primary',
  children,
  size = 'medium',
}: BadgeProps) {
  const style = variantStyles[variant];
  const padding = size === 'small' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'small' ? '11px' : '12px';

  return (
    <span
      style={{
        padding,
        borderRadius: '12px',
        fontSize,
        fontWeight: '600',
        ...style,
      }}
    >
      {children}
    </span>
  );
});
