import React from 'react';
import { colors } from '../utils/colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        color: colors.text.secondary,
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>{icon}</div>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: colors.text.primary,
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: colors.text.secondary,
          margin: '0 0 24px 0',
          lineHeight: '1.6',
        }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '10px 20px',
            backgroundColor: colors.primary.main,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
});
