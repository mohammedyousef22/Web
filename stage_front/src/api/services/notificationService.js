// src/api/services/notificationService.js
import axiosInstance from '../axios';
import { NOTIFICATIONS } from '../endpoints';

/**
 * Service pour gérer les notifications
 */
const notificationService = {
    /**
     * Récupérer toutes mes notifications
     * @param {Object} filters - { is_read, page, per_page }
     * @returns {Promise}
     */
    getAllNotifications: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `${NOTIFICATIONS.ALL}?${params}` : NOTIFICATIONS.ALL;
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer une notification par ID
     * @param {number} id
     * @returns {Promise}
     */
    getNotificationById: async (id) => {
        return await axiosInstance.get(NOTIFICATIONS.BY_ID(id));
    },

    /**
     * Marquer une notification comme lue
     * @param {number} id
     * @returns {Promise}
     */
    markAsRead: async (id) => {
        return await axiosInstance.patch(NOTIFICATIONS.MARK_AS_READ(id));
    },

    /**
     * Marquer toutes les notifications comme lues
     * @returns {Promise}
     */
    markAllAsRead: async () => {
        return await axiosInstance.post(NOTIFICATIONS.MARK_ALL_AS_READ);
    },

    /**
     * Supprimer une notification
     * @param {number} id
     * @returns {Promise}
     */
    deleteNotification: async (id) => {
        return await axiosInstance.delete(NOTIFICATIONS.DELETE(id));
    },

    /**
     * Récupérer le nombre de notifications non lues
     * @returns {Promise}
     */
    getUnreadCount: async () => {
        return await axiosInstance.get(NOTIFICATIONS.UNREAD_COUNT);
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir l'icône selon le type de notification
     * @param {string} type
     * @returns {Object} { icon: string, color: string }
     */
    getNotificationIcon: (type) => {
        const icons = {
            nouvelle_candidature: { icon: 'FileText', color: 'text-blue-600' },
            candidature_acceptee: { icon: 'CheckCircle', color: 'text-green-600' },
            candidature_refusee: { icon: 'XCircle', color: 'text-red-600' },
            nouveau_stagiaire: { icon: 'UserPlus', color: 'text-purple-600' },
            rapport_depose: { icon: 'Upload', color: 'text-orange-600' },
            rapport_valide: { icon: 'CheckCircle2', color: 'text-green-600' },
            rapport_a_corriger: { icon: 'AlertCircle', color: 'text-yellow-600' },
            evaluation_disponible: { icon: 'Star', color: 'text-amber-600' },
            rappel_fin_stage: { icon: 'Clock', color: 'text-red-600' },
        };

        return icons[type] || { icon: 'Bell', color: 'text-gray-600' };
    },

    /**
     * Formater une notification pour affichage
     * @param {Object} notification
     * @returns {Object}
     */
    formatNotification: (notification) => {
        return {
            ...notification,
            icon_data: notificationService.getNotificationIcon(notification.type),
            created_at_formatted: notificationService.formatDate(notification.created_at),
            time_ago: notificationService.timeAgo(notification.created_at),
        };
    },

    /**
     * Formater une date en format lisible
     * @param {string} date
     * @returns {string}
     */
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    /**
     * Calculer le temps écoulé (ex: "Il y a 2 heures")
     * @param {string} date
     * @returns {string}
     */
    timeAgo: (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) {
            return 'À l\'instant';
        } else if (diffMins < 60) {
            return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else {
            return notificationService.formatDate(date);
        }
    },

    /**
     * Trier les notifications par date (plus récentes d'abord)
     * @param {Array} notifications
     * @returns {Array}
     */
    sortByDate: (notifications) => {
        return [...notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    /**
     * Filtrer les notifications non lues
     * @param {Array} notifications
     * @returns {Array}
     */
    filterUnread: (notifications) => {
        return notifications.filter((n) => !n.is_read);
    },

    /**
     * Filtrer les notifications lues
     * @param {Array} notifications
     * @returns {Array}
     */
    filterRead: (notifications) => {
        return notifications.filter((n) => n.is_read);
    },

    /**
     * Filtrer par type de notification
     * @param {Array} notifications
     * @param {string} type
     * @returns {Array}
     */
    filterByType: (notifications, type) => {
        if (!type) return notifications;
        return notifications.filter((n) => n.type === type);
    },

    /**
     * Obtenir les statistiques des notifications
     * @param {Array} notifications
     * @returns {Object}
     */
    getStatsNotifications: (notifications) => {
        const total = notifications.length;
        const unread = notificationService.filterUnread(notifications).length;
        const read = total - unread;

        // Répartition par type
        const parType = {};
        notifications.forEach((n) => {
            const type = n.type || 'Autre';
            parType[type] = (parType[type] || 0) + 1;
        });

        return {
            total,
            unread,
            read,
            par_type: parType,
            taux_lecture: total > 0 ? ((read / total) * 100).toFixed(1) : 0,
        };
    },

    /**
     * Grouper les notifications par date (aujourd'hui, hier, cette semaine, etc.)
     * @param {Array} notifications
     * @returns {Object}
     */
    groupByDate: (notifications) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const groups = {
            today: [],
            yesterday: [],
            this_week: [],
            older: [],
        };

        notifications.forEach((notification) => {
            const notifDate = new Date(notification.created_at);
            const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

            if (notifDay.getTime() === today.getTime()) {
                groups.today.push(notification);
            } else if (notifDay.getTime() === yesterday.getTime()) {
                groups.yesterday.push(notification);
            } else if (notifDate >= lastWeek) {
                groups.this_week.push(notification);
            } else {
                groups.older.push(notification);
            }
        });

        return groups;
    },

    /**
     * Obtenir le label du groupe de date
     * @param {string} group - 'today', 'yesterday', 'this_week', 'older'
     * @returns {string}
     */
    getGroupLabel: (group) => {
        const labels = {
            today: 'Aujourd\'hui',
            yesterday: 'Hier',
            this_week: 'Cette semaine',
            older: 'Plus ancien',
        };
        return labels[group] || 'Autres';
    },
};

export default notificationService;
