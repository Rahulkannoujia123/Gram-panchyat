import React from 'react';
import { Page } from '../types';
import { colors } from '../utils/colors';

interface BottomNavProps {
  active: Page;
  onChange: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: 'home', label: 'मुख्य', icon: '🏠' },
  { page: 'news', label: 'खबरें', icon: '📰' },
  { page: 'complaints', label: 'शिकायतें', icon: '📝' },
  { page: 'schemes', label: 'योजनाएं', icon: '💼' },
  { page: 'workers', label: 'कामगार', icon: '🛠️' },
  { page: 'members', label: 'सदस्य', icon: '👥' },
];

export const BottomNav = React.memo(function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.neutral.white,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: `0 -2px 4px ${colors.shadow}`,
        zIndex: 200,
      }}
    >
      {navItems.map(({ page, label, icon }) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          style={{
            flex: 1,
            padding: '12px 8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: active === page ? colors.primary.main : colors.text.secondary,
            transition: 'all 0.3s ease',
            fontSize: '10px',
          }}
          aria-label={label}
          aria-current={active === page ? 'page' : undefined}
        >
          <span style={{ fontSize: '24px' }}>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
});
