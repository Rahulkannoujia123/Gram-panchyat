import React, { useState } from 'react';
import { UserProfile } from '../types';
import { colors } from '../utils/colors';
import { useLocalStorage } from '../hooks/useLocalStorage';

const defaultProfile: UserProfile = {
  id: 1,
  name: 'राज कुमार',
  email: 'raj@example.com',
  phone: '+91 9876543210',
  ward: 'वार्ड 5',
  language: 'hi',
  theme: 'light',
  notifications: {
    enabled: true,
    byType: {
      news: true,
      complaints: true,
      schemes: true,
      polls: true,
      notices: true,
    },
  },
};

interface ProfilePageProps {
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onLanguageChange?: (language: 'hi' | 'en') => void;
}

export const ProfilePage = React.memo(function ProfilePage({
  onThemeChange,
  onLanguageChange,
}: ProfilePageProps) {
  const [profile, setProfile] = useLocalStorage<UserProfile>('panchayatProfile', defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleNotificationChange = (type: keyof typeof profile.notifications.byType) => {
    setEditedProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        byType: {
          ...prev.notifications.byType,
          [type]: !prev.notifications.byType[type],
        },
      },
    }));
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setEditedProfile((prev) => ({ ...prev, theme }));
    onThemeChange?.(theme);
  };

  const handleLanguageChange = (language: 'hi' | 'en') => {
    setEditedProfile((prev) => ({ ...prev, language }));
    onLanguageChange?.(language);
  };

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Profile Header */}
      <div
        style={{
          padding: '24px 16px',
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.neutral.white,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: colors.neutral.white,
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          👤
        </div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{editedProfile.name}</h2>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>{editedProfile.ward}</p>
      </div>

      {/* Profile Content */}
      <div style={{ padding: '16px' }}>
        {/* Personal Information */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>व्यक्तिगत जानकारी</h3>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: colors.primary.main,
                color: colors.neutral.white,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {isEditing ? '💾 सहेजें' : '✏️ संपादित करें'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: colors.text.secondary, fontWeight: '600' }}>नाम</label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: isEditing ? colors.neutral.white : colors.neutral.light,
                  cursor: isEditing ? 'text' : 'default',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: colors.text.secondary, fontWeight: '600' }}>ईमेल</label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: isEditing ? colors.neutral.white : colors.neutral.light,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: colors.text.secondary, fontWeight: '600' }}>फोन</label>
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile((prev) => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: isEditing ? colors.neutral.white : colors.neutral.light,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: colors.text.secondary, fontWeight: '600' }}>वार्ड</label>
              <input
                type="text"
                value={editedProfile.ward}
                onChange={(e) => setEditedProfile((prev) => ({ ...prev, ward: e.target.value }))}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '4px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: isEditing ? colors.neutral.white : colors.neutral.light,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>पसंद</h3>

          {/* Language */}
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              भाषा
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['hi', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as 'hi' | 'en')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: editedProfile.language === lang ? colors.primary.main : colors.neutral.white,
                    color: editedProfile.language === lang ? colors.neutral.white : colors.text.primary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                >
                  {lang === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              थीम
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['light', 'dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme as 'light' | 'dark')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: editedProfile.theme === theme ? colors.primary.main : colors.neutral.white,
                    color: editedProfile.theme === theme ? colors.neutral.white : colors.text.primary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                >
                  {theme === 'light' ? '☀️ हल्का' : '🌙 गहरा'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>सूचना सेटिंग्स</h3>

          <div
            style={{
              padding: '12px',
              backgroundColor: colors.neutral.light,
              borderRadius: '8px',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editedProfile.notifications.enabled}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, enabled: e.target.checked },
                  }))
                }
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>सूचनाएं सक्षम करें</span>
            </label>

            {editedProfile.notifications.enabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(editedProfile.notifications.byType).map(([type, enabled]) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleNotificationChange(type as keyof typeof editedProfile.notifications.byType)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px' }}>
                      {type === 'news' ? '📰 खबरें' :
                       type === 'complaints' ? '📝 शिकायतें' :
                       type === 'schemes' ? '💼 योजनाएं' :
                       type === 'polls' ? '🗳️ पोल' : '📢 नोटिस'}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Logout Button */}
        <button
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '12px',
            backgroundColor: colors.status.error,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          लॉग आउट करें
        </button>
      </div>
    </div>
  );
});
