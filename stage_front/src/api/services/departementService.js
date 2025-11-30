// src/api/services/departementService.js
import axiosInstance from '../axios';
import { ADMIN } from '../endpoints';

/**
 * Service pour gérer les départements (Admin uniquement)
 */
const departementService = {
    /**
     * Récupérer tous les départements
     * @param {Object} filters - { search, page, per_page }
     * @returns {Promise}
     */
    getAllDepartements: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `${ADMIN.DEPARTEMENTS}?${params}` : ADMIN.DEPARTEMENTS;
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer un département par ID
     * @param {number} id
     * @returns {Promise}
     */
    getDepartementById: async (id) => {
        return await axiosInstance.get(ADMIN.DEPARTEMENTS_BY_ID(id));
    },

    /**
     * Créer un nouveau département
     * @param {Object} data - { nom, description, responsable }
     * @returns {Promise}
     */
    createDepartement: async (data) => {
        return await axiosInstance.post(ADMIN.DEPARTEMENTS, data);
    },

    /**
     * Modifier un département
     * @param {number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateDepartement: async (id, data) => {
        return await axiosInstance.put(ADMIN.DEPARTEMENTS_BY_ID(id), data);
    },

    /**
     * Supprimer un département
     * @param {number} id
     * @returns {Promise}
     */
    deleteDepartement: async (id) => {
        return await axiosInstance.delete(ADMIN.DEPARTEMENTS_BY_ID(id));
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Formater un département pour affichage
     * @param {Object} departement
     * @returns {Object}
     */
    formatDepartement: (departement) => {
        return {
            ...departement,
            encadrants_count: departement.encadrants_count || 0,
            offres_count: departement.offres_count || 0,
            stagiaires_count: departement.stagiaires_count || 0,
            created_at_formatted: new Date(departement.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        };
    },

    /**
     * Valider les données d'un département
     * @param {Object} data
     * @returns {Object} { valid: boolean, errors: object }
     */
    validateDepartement: (data) => {
        const errors = {};

        // Validation nom
        if (!data.nom || data.nom.trim().length < 3) {
            errors.nom = 'Le nom doit contenir au moins 3 caractères';
        }

        // Validation description (optionnelle mais si fournie, min 10 caractères)
        if (data.description && data.description.trim().length < 10) {
            errors.description = 'La description doit contenir au moins 10 caractères';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    },

    /**
     * Obtenir les statistiques d'un département
     * @param {Object} departement
     * @returns {Object}
     */
    getStatsDepartement: (departement) => {
        return {
            encadrants: departement.encadrants_count || 0,
            offres_actives: departement.offres_actives_count || 0,
            offres_total: departement.offres_count || 0,
            stagiaires_actuels: departement.stagiaires_count || 0,
            candidatures_en_attente: departement.candidatures_en_attente_count || 0,
        };
    },

    /**
     * Trier les départements par nombre d'encadrants
     * @param {Array} departements
     * @param {string} order - 'asc' ou 'desc'
     * @returns {Array}
     */
    sortByEncadrantsCount: (departements, order = 'desc') => {
        return [...departements].sort((a, b) => {
            const countA = a.encadrants_count || 0;
            const countB = b.encadrants_count || 0;
            return order === 'asc' ? countA - countB : countB - countA;
        });
    },

    /**
     * Trier les départements par nombre d'offres
     * @param {Array} departements
     * @param {string} order - 'asc' ou 'desc'
     * @returns {Array}
     */
    sortByOffresCount: (departements, order = 'desc') => {
        return [...departements].sort((a, b) => {
            const countA = a.offres_count || 0;
            const countB = b.offres_count || 0;
            return order === 'asc' ? countA - countB : countB - countA;
        });
    },

    /**
     * Rechercher des départements
     * @param {Array} departements
     * @param {string} query
     * @returns {Array}
     */
    search: (departements, query) => {
        if (!query || query.trim() === '') return departements;

        const lowerQuery = query.toLowerCase().trim();

        return departements.filter((dept) => {
            const nom = dept.nom?.toLowerCase() || '';
            const description = dept.description?.toLowerCase() || '';
            const responsable = dept.responsable?.toLowerCase() || '';

            return nom.includes(lowerQuery) || description.includes(lowerQuery) || responsable.includes(lowerQuery);
        });
    },

    /**
     * Obtenir les départements avec le plus d'activité
     * @param {Array} departements
     * @param {number} limit
     * @returns {Array}
     */
    getTopDepartements: (departements, limit = 5) => {
        // Trier par combinaison : encadrants + offres + stagiaires
        return [...departements]
            .sort((a, b) => {
                const scoreA = (a.encadrants_count || 0) + (a.offres_count || 0) + (a.stagiaires_count || 0);
                const scoreB = (b.encadrants_count || 0) + (b.offres_count || 0) + (b.stagiaires_count || 0);
                return scoreB - scoreA;
            })
            .slice(0, limit);
    },

    /**
     * Obtenir les données pour graphique de répartition
     * @param {Array} departements
     * @returns {Array} Data pour Recharts (PieChart)
     */
    getChartData: (departements) => {
        return departements.map((dept) => ({
            name: dept.nom,
            value: dept.stagiaires_count || 0,
            encadrants: dept.encadrants_count || 0,
            offres: dept.offres_count || 0,
        }));
    },

    /**
     * Obtenir les couleurs pour les graphiques par département
     * @returns {Array}
     */
    getChartColors: () => {
        return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    },
};

export default departementService;