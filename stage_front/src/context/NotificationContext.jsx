// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '@/api/services';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

/**
 * Provider de notifications
 */
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Charger les notifications
   */
  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
      setNotifications(response.notifications || []);

      // Compter les non lues
      const unread = response.notifications?.filter((n) => !n.is_read).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marquer une notification comme lue
   */
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur mark as read:', error);
    }
  };

  /**
   * Marquer toutes les notifications comme lues
   */
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur mark all as read:', error);
    }
  };

  /**
   * Supprimer une notification
   */
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);

      // Retirer localement
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        if (notification && !notification.is_read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  };

  /**
   * Ajouter une notification (pour temps réel)
   */
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  /**
   * Charger les notifications au montage et quand user change
   */
  useEffect(() => {
    if (user) {
      loadNotifications();

      // Optionnel : Polling toutes les 30 secondes
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte Notification
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return context;
};

export default NotificationContext;