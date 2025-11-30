// src/components/notifications/NotificationItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { notificationService } from '@/api/services';

/**
 * Item de notification individuel
 */
const NotificationItem = ({ notification, onClick }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();

  const formatted = notificationService.formatNotification(notification);
  const Icon = Icons[formatted.icon_data.icon] || Icons.Bell;

  const handleClick = async () => {
    // Marquer comme lu
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Naviguer si lien disponible
    if (notification.lien) {
      navigate(notification.lien);
    }

    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 border-b border-gray-100 cursor-pointer transition-colors
        hover:bg-gray-50
        ${!notification.is_read ? 'bg-blue-50' : ''}
      `}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.is_read ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Icon className={`w-5 h-5 ${formatted.icon_data.color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
            {notification.titre}
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatted.time_ago}
          </p>
        </div>

        {/* Unread Indicator */}
        {!notification.is_read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;