import React from 'react';
import { colors } from '../utils/colors';
import { Village } from '../types';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  rightAction?: React.ReactNode;
  notificationCount?: number;
  selectedVillage?: Village | 'All';
  onVillageChange?: (village: Village | 'All') => void;
}

const VILLAGES: (Village | 'All')[] = ['All', 'Babiracha', 'Rampur', 'Hibranpur', 'Bharawar'];

export const Header = React.memo(function Header({
  title,
  showBack = false,
  onBack,
  onNotificationsClick,
  onProfileClick,
  rightAction,
  notificationCount = 0,
  selectedVillage,
  onVillageChange,
}: HeaderProps) {
  return (
    <header
      style={{
        padding: '12px 16px',
        backgroundColor: colors.primary.main,
        color: colors.neutral.white,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: `0 2px 4px ${colors.shadow}`,
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: colors.neutral.white,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            onClick={onNotificationsClick}
            style={{
              background: 'none',
              border: 'none',
              color: colors.neutral.white,
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
            }}
            aria-label="Notifications"
          >
            🔔
          </button>
          {notificationCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: colors.status.error,
                color: colors.neutral.white,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                border: `2px solid ${colors.primary.main}`,
              }}
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
        </div>

        <button
          onClick={onProfileClick}
          style={{
            background: 'none',
            border: 'none',
            color: colors.neutral.white,
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Profile"
        >
          👤
        </button>

        {rightAction && rightAction}
      </div>
      </div>

      {onVillageChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>ग्राम:</span>
          <select
            value={selectedVillage}
            onChange={(e) => onVillageChange(e.target.value as Village | 'All')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.neutral.white,
              fontSize: '13px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            {VILLAGES.map((v) => (
              <option key={v} value={v} style={{ color: colors.text.primary }}>
                {v === 'All' ? 'सभी गांव' : v}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
});
