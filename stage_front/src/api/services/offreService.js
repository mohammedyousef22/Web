// src/api/services/offreService.js
import axiosInstance from '../axios';
import { ADMIN, STAGIAIRE, buildUrl } from '../endpoints';

/**
 * Service pour gérer les offres de stage
 */
const offreService = {
    // ========================
    // ADMIN ENDPOINTS
    // ========================

    /**
     * Récupérer toutes les offres (Admin)
     * @param {Object} filters - { search, departement_id, statut, page, per_page }
     * @returns {Promise}
     */
    getAllOffres: async (filters = {}) => {
        const url = buildUrl(ADMIN.OFFRES, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer une offre par ID (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    getOffreById: async (id) => {
        return await axiosInstance.get(ADMIN.OFFRES_BY_ID(id));
    },

    /**
     * Créer une nouvelle offre (Admin)
     * @param {Object} data - { titre, description, departement_id, duree_jours, date_debut, date_fin, competences_requises, nombre_places, statut }
     * @returns {Promise}
     */
    createOffre: async (data) => {
        return await axiosInstance.post(ADMIN.OFFRES, data);
    },

    /**
     * Modifier une offre (Admin)
     * @param {number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateOffre: async (id, data) => {
        return await axiosInstance.put(ADMIN.OFFRES_BY_ID(id), data);
    },

    /**
     * Supprimer une offre (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    deleteOffre: async (id) => {
        return await axiosInstance.delete(ADMIN.OFFRES_BY_ID(id));
    },

    /**
     * Changer le statut d'une offre (ouvert/fermé) (Admin)
     * @param {number} id
     * @param {string} statut - 'ouvert' ou 'ferme'
     * @returns {Promise}
     */
    updateStatus: async (id, statut) => {
        return await axiosInstance.patch(ADMIN.OFFRES_STATUS(id), { statut });
    },

    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Récupérer les offres disponibles (Stagiaire) - statut ouvert uniquement
     * @param {Object} filters - { search, departement_id, duree_min, duree_max, date_debut_from, sort_by, sort_order, page, per_page }
     * @returns {Promise}
     */
    getOffresDisponibles: async (filters = {}) => {
        const url = buildUrl(STAGIAIRE.OFFRES, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'une offre (Stagiaire)
     * @param {number} id
     * @returns {Promise}
     */
    getOffreDetailsForStagiaire: async (id) => {
        return await axiosInstance.get(STAGIAIRE.OFFRES_BY_ID(id));
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Formater une offre pour affichage
     * @param {Object} offre
     * @returns {Object} Offre formatée
     */
    formatOffre: (offre) => {
        return {
            ...offre,
            statut_label: offre.statut === 'ouvert' ? 'Ouvert' : 'Fermé',
            duree_formatted: offreService.formatDuree(offre.duree_jours),
            date_debut_formatted: new Date(offre.date_debut).toLocaleDateString('fr-FR'),
            date_fin_formatted: new Date(offre.date_fin).toLocaleDateString('fr-FR'),
        };
    },

    /**
     * Formater la durée en jours
     * @param {number} jours
     * @returns {string}
     */
    formatDuree: (jours) => {
        if (jours < 30) {
            return `${jours} jour${jours > 1 ? 's' : ''}`;
        }
        const mois = Math.floor(jours / 30);
        const joursRestants = jours % 30;

        if (joursRestants === 0) {
            return `${mois} mois`;
        }
        return `${mois} mois ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`;
    },

    /**
     * Vérifier si une offre est ouverte
     * @param {Object} offre
     * @returns {boolean}
     */
    isOffreOuverte: (offre) => {
        return offre.statut === 'ouvert';
    },

    /**
     * Vérifier si une offre est expirée
     * @param {Object} offre
     * @returns {boolean}
     */
    isOffreExpiree: (offre) => {
        const dateFin = new Date(offre.date_fin);
        return dateFin < new Date();
    },

    /**
     * Calculer le nombre de places restantes
     * @param {Object} offre
     * @returns {number}
     */
    getPlacesRestantes: (offre) => {
        return offre.nombre_places - (offre.candidatures_count || 0);
    },
};

export default offreService;
