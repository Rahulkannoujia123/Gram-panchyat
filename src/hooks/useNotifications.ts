import { useState, useCallback } from 'react';
import { Notification } from '../types';

export function useNotifications(initialNotifications: Notification[] = []) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'date'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now(),
        date: new Date().toLocaleString('hi-IN'),
      };
      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification.id;
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };
}
