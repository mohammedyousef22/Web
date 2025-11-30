// src/api/services/dashboardService.js
import axiosInstance from '../axios';
import { ADMIN, ENCADRANT } from '../endpoints';

/**
 * Service pour les dashboards et statistiques
 */
const dashboardService = {
    // ========================
    // ADMIN ENDPOINTS
    // ========================

    /**
     * Récupérer les statistiques du dashboard admin
     * @returns {Promise}
     */
    getAdminStats: async () => {
        return await axiosInstance.get(ADMIN.DASHBOARD_STATS);
    },

    // ========================
    // ENCADRANT ENDPOINTS
    // ========================

    /**
     * Récupérer les statistiques du dashboard encadrant
     * @returns {Promise}
     */
    getEncadrantStats: async () => {
        return await axiosInstance.get(ENCADRANT.DASHBOARD_STATS);
    },

    // ========================
    // HELPERS POUR DASHBOARD ADMIN
    // ========================

    /**
     * Formater les KPIs admin pour affichage
     * @param {Object} kpis
     * @returns {Array}
     */
    formatAdminKPIs: (kpis) => {
        return [
            {
                id: 'stagiaires',
                label: 'Total Stagiaires',
                value: kpis.total_stagiaires || 0,
                icon: 'Users',
                color: 'blue',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
            },
            {
                id: 'encadrants',
                label: 'Encadrants Actifs',
                value: kpis.total_encadrants || 0,
                icon: 'UserCheck',
                color: 'purple',
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-600',
            },
            {
                id: 'offres',
                label: 'Offres Actives',
                value: kpis.offres_actives || 0,
                icon: 'Briefcase',
                color: 'green',
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
            },
            {
                id: 'candidatures',
                label: 'Candidatures En Attente',
                value: kpis.candidatures_en_attente || 0,
                icon: 'FileText',
                color: 'yellow',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-600',
            },
            {
                id: 'stages_en_cours',
                label: 'Stages En Cours',
                value: kpis.stages_en_cours || 0,
                icon: 'PlayCircle',
                color: 'orange',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-600',
            },
            {
                id: 'stages_termines',
                label: 'Stages Terminés',
                value: kpis.stages_termines || 0,
                icon: 'CheckCircle',
                color: 'teal',
                bgColor: 'bg-teal-100',
                textColor: 'text-teal-600',
            },
        ];
    },

    /**
     * Formater les données de graphique candidatures par mois
     * @param {Array} data
     * @returns {Array} Data pour Recharts LineChart
     */
    formatCandidaturesParMois: (data) => {
        return data.map((item) => ({
            mois: dashboardService.formatMonthLabel(item.mois),
            total: item.total,
            date: item.mois, // Garder format original pour tri
        }));
    },

    /**
     * Formater label de mois (2025-01 → Janvier 2025)
     * @param {string} mois - Format YYYY-MM
     * @returns {string}
     */
    formatMonthLabel: (mois) => {
        const [year, month] = mois.split('-');
        const monthNames = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    },

    /**
     * Formater les données de répartition par département
     * @param {Array} data
     * @returns {Array} Data pour Recharts PieChart
     */
    formatRepartitionDepartements: (data) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        return data.map((item, index) => ({
            name: item.nom,
            value: item.total,
            fill: colors[index % colors.length],
        }));
    },

    /**
     * Formater les données des top encadrants
     * @param {Array} data
     * @returns {Array}
     */
    formatTopEncadrants: (data) => {
        return data.map((encadrant, index) => ({
            ...encadrant,
            rank: index + 1,
            name: encadrant.user?.name || 'N/A',
            email: encadrant.user?.email || 'N/A',
            stages_count: encadrant.stages_count || 0,
        }));
    },

    /**
     * Calculer le taux d'acceptation avec couleur
     * @param {number} taux
     * @returns {Object} { value, color, label }
     */
    getTauxAcceptationInfo: (taux) => {
        let color, label;

        if (taux >= 70) {
            color = 'text-green-600';
            label = 'Excellent';
        } else if (taux >= 50) {
            color = 'text-blue-600';
            label = 'Bon';
        } else if (taux >= 30) {
            color = 'text-yellow-600';
            label = 'Moyen';
        } else {
            color = 'text-red-600';
            label = 'Faible';
        }

        return {
            value: `${taux}%`,
            color,
            label,
        };
    },

    // ========================
    // HELPERS POUR DASHBOARD ENCADRANT
    // ========================

    /**
     * Formater les KPIs encadrant pour affichage
     * @param {Object} stats
     * @returns {Array}
     */
    formatEncadrantKPIs: (stats) => {
        return [
            {
                id: 'total_stagiaires',
                label: 'Mes Stagiaires',
                value: stats.total_stagiaires || 0,
                icon: 'Users',
                color: 'blue',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
            },
            {
                id: 'stages_en_cours',
                label: 'Stages En Cours',
                value: stats.stages_en_cours || 0,
                icon: 'PlayCircle',
                color: 'green',
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
            },
            {
                id: 'stages_termines',
                label: 'Stages Terminés',
                value: stats.stages_termines || 0,
                icon: 'CheckCircle',
                color: 'purple',
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-600',
            },
            {
                id: 'rapports_en_attente',
                label: 'Rapports À Valider',
                value: stats.rapports_en_attente || 0,
                icon: 'FileText',
                color: 'yellow',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-600',
            },
        ];
    },

    /**
     * Formater les données de graphique évolution stagiaires
     * @param {Array} data
     * @returns {Array} Data pour Recharts
     */
    formatEvolutionStagiaires: (data) => {
        return data.map((item) => ({
            mois: dashboardService.formatMonthLabel(item.mois),
            total: item.total,
            nouveaux: item.nouveaux || 0,
            termines: item.termines || 0,
        }));
    },

    /**
     * Calculer la moyenne des évaluations avec mention
     * @param {number} moyenne
     * @returns {Object}
     */
    getMoyenneEvaluationsInfo: (moyenne) => {
        const mention = dashboardService.getMention(moyenne);
        return {
            value: moyenne.toFixed(2),
            sur_20: `${moyenne.toFixed(2)}/20`,
            mention: mention.label,
            color: mention.color,
        };
    },

    /**
     * Obtenir la mention selon la note
     * @param {number} note
     * @returns {Object}
     */
    getMention: (note) => {
        if (note >= 16) return { label: 'Très Bien', color: 'text-green-600' };
        if (note >= 14) return { label: 'Bien', color: 'text-blue-600' };
        if (note >= 12) return { label: 'Assez Bien', color: 'text-yellow-600' };
        if (note >= 10) return { label: 'Passable', color: 'text-orange-600' };
        return { label: 'Insuffisant', color: 'text-red-600' };
    },

    // ========================
    // UTILITAIRES GÉNÉRAUX
    // ========================

    /**
     * Générer des données de tendance (croissance/décroissance)
     * @param {number} current
     * @param {number} previous
     * @returns {Object} { trend: 'up'|'down'|'stable', percentage: number }
     */
    calculateTrend: (current, previous) => {
        if (!previous || previous === 0) {
            return { trend: 'stable', percentage: 0 };
        }

        const diff = current - previous;
        const percentage = Math.abs((diff / previous) * 100).toFixed(1);

        let trend = 'stable';
        if (diff > 0) trend = 'up';
        else if (diff < 0) trend = 'down';

        return { trend, percentage: parseFloat(percentage) };
    },

    /**
     * Formater un grand nombre avec séparateur
     * @param {number} num
     * @returns {string}
     */
    formatNumber: (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    },

    /**
     * Obtenir les couleurs pour graphiques
     * @returns {Object}
     */
    getChartColors: () => {
        return {
            primary: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899',
            teal: '#14b8a6',
        };
    },
};

export default dashboardService;