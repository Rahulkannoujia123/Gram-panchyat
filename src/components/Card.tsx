import React from 'react';
import { colors } from '../utils/colors';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Card = React.memo(function Card({
  children,
  elevated = false,
  padding = 'medium',
  onClick,
  style,
  className = '',
}: CardProps) {
  const paddingSizes = {
    small: '12px',
    medium: '16px',
    large: '20px',
  };

  const baseStyle: React.CSSProperties = {
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: paddingSizes[padding],
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  if (elevated) {
    baseStyle.boxShadow = `0 4px 12px ${colors.shadow}`;
  }

  return (
    <div
      style={baseStyle}
      onClick={onClick}
      className={className}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 16px ${colors.shadow}`;
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = elevated ? `0 4px 12px ${colors.shadow}` : 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
});

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const CardHeader = React.memo(function CardHeader({ title, subtitle, icon }: CardHeaderProps) {
  return (
    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '8px' }}>
      {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{title}</h3>
        {subtitle && (
          <p style={{ margin: 0, fontSize: '12px', color: colors.text.secondary }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
});

interface CardBodyProps {
  children: React.ReactNode;
}

export const CardBody = React.memo(function CardBody({ children }: CardBodyProps) {
  return (
    <div style={{ fontSize: '14px', color: colors.text.primary, lineHeight: '1.6' }}>
      {children}
    </div>
  );
});

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = React.memo(function CardFooter({ children, align = 'between' }: CardFooterProps) {
  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    between: 'space-between',
  };

  return (
    <div
      style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: alignMap[align] as any,
        gap: '8px',
      }}
    >
      {children}
    </div>
  );
});
