// src/components/notifications/NotificationDropdown.jsx
import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/common';

/**
 * Dropdown de notifications dans la Navbar
 */
const NotificationDropdown = () => {
    const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    // Afficher seulement les 5 dernières
    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-600" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">
                                Notifications {unreadCount > 0 && `(${unreadCount})`}
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Tout marquer lu
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Chargement...
                                </div>
                            ) : recentNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p>Aucune notification</p>
                                </div>
                            ) : (
                                recentNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 5 && (
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={() => {
                                        setIsOpen(false);
                                        // Navigate to notifications page
                                    }}
                                >
                                    Voir toutes les notifications
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;