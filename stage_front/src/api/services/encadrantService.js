// src/api/services/encadrantService.js
import axiosInstance from '../axios';
import { ADMIN, buildUrl } from '../endpoints';
import exportService from './exportService';

/**
 * Service pour gérer les encadrants (Admin uniquement)
 */
const encadrantService = {
    /**
     * Récupérer tous les encadrants
     * @param {Object} filters - { search, departement_id, page, per_page }
     * @returns {Promise}
     */
    getAllEncadrants: async (filters = {}) => {
        const url = buildUrl(ADMIN.ENCADRANTS, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer un encadrant par ID
     * @param {number} id
     * @returns {Promise}
     */
    getEncadrantById: async (id) => {
        return await axiosInstance.get(ADMIN.ENCADRANTS_BY_ID(id));
    },

    /**
     * Créer un nouvel encadrant
     * @param {Object} data - { name, email, departement_id, specialite, telephone }
     * @returns {Promise}
     */
    createEncadrant: async (data) => {
        return await axiosInstance.post(ADMIN.ENCADRANTS, data);
    },

    /**
     * Modifier un encadrant
     * @param {number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateEncadrant: async (id, data) => {
        return await axiosInstance.put(ADMIN.ENCADRANTS_BY_ID(id), data);
    },

    /**
     * Supprimer un encadrant
     * @param {number} id
     * @returns {Promise}
     */
    deleteEncadrant: async (id) => {
        return await axiosInstance.delete(ADMIN.ENCADRANTS_BY_ID(id));
    },

    /**
     * Exporter les encadrants (Admin)
     * @param {Object} filters
     * @returns {Promise}
     */
    exportEncadrants: async (filters = {}) => {
        return await exportService.exportEncadrantsExcel(filters);
    },

    /**
     * Récupérer les encadrants disponibles (sans filtre de disponibilité)
     * Pour dropdown lors d'acceptation de candidature
     * @param {number} departementId - Filtrer par département (optionnel)
     * @returns {Promise}
     */
    getEncadrantsDisponibles: async (departementId = null) => {
        const filters = {};
        if (departementId) {
            filters.departement_id = departementId;
        }
        return await encadrantService.getAllEncadrants(filters);
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Formater un encadrant pour affichage
     * @param {Object} encadrant
     * @returns {Object}
     */
    formatEncadrant: (encadrant) => {
        return {
            ...encadrant,
            full_name: encadrant.user?.name || 'N/A',
            email: encadrant.user?.email || 'N/A',
            departement_nom: encadrant.departement?.nom || 'Non assigné',
            stagiaires_count: encadrant.stagiaires_count || 0,
            created_at_formatted: new Date(encadrant.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        };
    },

    /**
     * Valider les données d'encadrant
     * @param {Object} data
     * @param {boolean} isUpdate
     * @returns {Object} { valid: boolean, errors: object }
     */
    validateEncadrant: (data, isUpdate = false) => {
        const errors = {};

        // Validation nom
        if (!data.name || data.name.trim().length < 3) {
            errors.name = 'Le nom doit contenir au moins 3 caractères';
        }

        // Validation email (seulement pour création)
        if (!isUpdate) {
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.email = 'Email invalide';
            }
        }

        // Validation département
        if (!data.departement_id) {
            errors.departement_id = 'Le département est requis';
        }

        // Validation spécialité
        if (!data.specialite || data.specialite.trim().length < 3) {
            errors.specialite = 'La spécialité doit contenir au moins 3 caractères';
        }

        // Validation téléphone
        if (data.telephone && !/^[0-9]{10}$/.test(data.telephone.replace(/\s/g, ''))) {
            errors.telephone = 'Le téléphone doit contenir 10 chiffres';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    },

    /**
     * Obtenir les statistiques d'un encadrant
     * @param {Object} encadrant
     * @returns {Object}
     */
    getStatsEncadrant: (encadrant) => {
        return {
            total_stagiaires: encadrant.stagiaires_count || 0,
            stages_en_cours: encadrant.stages_en_cours_count || 0,
            stages_termines: encadrant.stages_termines_count || 0,
            moyenne_evaluations: encadrant.moyenne_evaluations || 0,
        };
    },

    /**
     * Trier les encadrants par nombre de stagiaires
     * @param {Array} encadrants
     * @param {string} order - 'asc' ou 'desc'
     * @returns {Array}
     */
    sortByStagiairesCount: (encadrants, order = 'desc') => {
        return [...encadrants].sort((a, b) => {
            const countA = a.stagiaires_count || 0;
            const countB = b.stagiaires_count || 0;
            return order === 'asc' ? countA - countB : countB - countA;
        });
    },

    /**
     * Filtrer les encadrants par département
     * @param {Array} encadrants
     * @param {number} departementId
     * @returns {Array}
     */
    filterByDepartement: (encadrants, departementId) => {
        if (!departementId) return encadrants;
        return encadrants.filter((e) => e.departement_id === departementId);
    },

    /**
     * Rechercher des encadrants
     * @param {Array} encadrants
     * @param {string} query
     * @returns {Array}
     */
    search: (encadrants, query) => {
        if (!query || query.trim() === '') return encadrants;

        const lowerQuery = query.toLowerCase().trim();

        return encadrants.filter((encadrant) => {
            const name = encadrant.user?.name?.toLowerCase() || '';
            const email = encadrant.user?.email?.toLowerCase() || '';
            const specialite = encadrant.specialite?.toLowerCase() || '';
            const departement = encadrant.departement?.nom?.toLowerCase() || '';

            return (
                name.includes(lowerQuery) ||
                email.includes(lowerQuery) ||
                specialite.includes(lowerQuery) ||
                departement.includes(lowerQuery)
            );
        });
    },

    /**
     * Obtenir le top N encadrants par nombre de stagiaires
     * @param {Array} encadrants
     * @param {number} limit
     * @returns {Array}
     */
    getTopEncadrants: (encadrants, limit = 5) => {
        return encadrantService.sortByStagiairesCount(encadrants, 'desc').slice(0, limit);
    },
};

export default encadrantService;
