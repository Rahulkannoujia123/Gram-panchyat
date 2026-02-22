import React, { useState, useCallback } from 'react';
import { Notification } from '../types';
import { colors } from '../utils/colors';

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'नई खबर',
    message: 'नए स्वास्थ्य शिविर की घोषणा की गई है',
    type: 'info',
    date: new Date().toLocaleDateString('hi-IN'),
    read: false,
  },
  {
    id: 2,
    title: 'शिकायत की स्थिति',
    message: 'आपकी शिकायत को स्वीकार कर लिया गया है',
    type: 'success',
    date: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN'),
    read: false,
  },
  {
    id: 3,
    title: 'पोल सूचना',
    message: 'नए विकास पोल में मत देने के लिए आमंत्रित हैं',
    type: 'warning',
    date: new Date(Date.now() - 172800000).toLocaleDateString('hi-IN'),
    read: true,
  },
];

interface NotificationsPageProps {
  onNotificationUpdate?: (count: number) => void;
}

export const NotificationsPage = React.memo(function NotificationsPage({
  onNotificationUpdate,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onNotificationUpdate?.(0);
  }, [onNotificationUpdate]);

  const deleteNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notificationTypeConfig = {
    info: { bg: '#E3F2FD', text: '#1976D2', icon: 'ℹ️' },
    success: { bg: '#F1F8E9', text: '#558B2F', icon: '✓' },
    warning: { bg: '#FFF3E0', text: '#E65100', icon: '⚠️' },
    error: { bg: '#FFEBEE', text: '#C62828', icon: '✕' },
  };

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Header with Mark All as Read */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>सूचनाएं</h2>
          <p style={{ margin: 0, fontSize: '12px', color: colors.text.secondary }}>
            {unreadCount > 0 ? `${unreadCount} नई सूचनाएं` : 'सभी पढ़ी जा चुकी हैं'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              padding: '8px 16px',
              backgroundColor: colors.primary.main,
              color: colors.neutral.white,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            सभी को पढ़ा हुआ मार्क करें
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ padding: '16px' }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const config = notificationTypeConfig[notification.type];

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  marginBottom: '12px',
                  padding: '12px 16px',
                  backgroundColor: notification.read ? colors.neutral.white : config.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: config.text,
                      borderRadius: '8px 0 0 8px',
                    }}
                  />
                )}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        fontWeight: notification.read ? '500' : '600',
                        color: colors.text.primary,
                      }}
                    >
                      {notification.title}
                    </h4>
                    <p
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '13px',
                        color: colors.text.secondary,
                        lineHeight: '1.4',
                      }}
                    >
                      {notification.message}
                    </p>
                    <span style={{ fontSize: '11px', color: colors.text.secondary }}>
                      📅 {notification.date}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                    aria-label="Delete notification"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: colors.text.secondary }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <p style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '600' }}>
              कोई सूचनाएं नहीं
            </p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              जब आपके पास नई गतिविधि होगी तो आप यहाँ अलर्ट पाएंगे
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
