// src/api/services/candidatureService.js
import axiosInstance from '../axios';
import { ADMIN, STAGIAIRE, buildUrl } from '../endpoints';

/**
 * Service pour gérer les candidatures
 */
const candidatureService = {
    // ========================
    // ADMIN ENDPOINTS
    // ========================

    /**
     * Récupérer toutes les candidatures (Admin)
     * @param {Object} filters - { statut, offre_id, stagiaire_id, page, per_page }
     * @returns {Promise}
     */
    getAllCandidatures: async (filters = {}) => {
        const url = buildUrl(ADMIN.CANDIDATURES, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'une candidature (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    getCandidatureById: async (id) => {
        return await axiosInstance.get(ADMIN.CANDIDATURES_BY_ID(id));
    },

    /**
     * Accepter une candidature (Admin)
     * @param {number} candidatureId
     * @param {number} encadrantId - ID de l'encadrant à assigner
     * @returns {Promise}
     */
    acceptCandidature: async (candidatureId, encadrantId) => {
        return await axiosInstance.patch(ADMIN.CANDIDATURES_ACCEPT(candidatureId), {
            encadrant_id: encadrantId,
        });
    },

    /**
     * Refuser une candidature (Admin)
     * @param {number} candidatureId
     * @param {string} motif - Raison du refus (optionnel)
     * @returns {Promise}
     */
    rejectCandidature: async (candidatureId, motif = null) => {
        return await axiosInstance.patch(ADMIN.CANDIDATURES_REJECT(candidatureId), {
            motif,
        });
    },

    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Postuler à une offre (Stagiaire)
     * @param {number} offreId
     * @param {string} lettreMotivation
     * @returns {Promise}
     */
    postuler: async (offreId, lettreMotivation) => {
        return await axiosInstance.post(STAGIAIRE.POSTULER, {
            offre_id: offreId,
            lettre_motivation: lettreMotivation,
        });
    },

    /**
     * Récupérer mes candidatures (Stagiaire)
     * @param {Object} filters - { statut, page, per_page }
     * @returns {Promise}
     */
    getMesCandidatures: async (filters = {}) => {
        const url = buildUrl(STAGIAIRE.CANDIDATURES, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'une de mes candidatures (Stagiaire)
     * @param {number} id
     * @returns {Promise}
     */
    getMaCandidatureById: async (id) => {
        return await axiosInstance.get(STAGIAIRE.CANDIDATURES_BY_ID(id));
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir le badge de statut avec couleur
     * @param {string} statut - 'en_attente', 'accepte', 'refuse'
     * @returns {Object} { label, color, bgColor }
     */
    getStatusBadge: (statut) => {
        const badges = {
            en_attente: {
                label: 'En attente',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-100',
                icon: 'Clock',
            },
            accepte: {
                label: 'Acceptée',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                icon: 'CheckCircle',
            },
            refuse: {
                label: 'Refusée',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                icon: 'XCircle',
            },
        };

        return badges[statut] || badges.en_attente;
    },

    /**
     * Formater une candidature pour affichage
     * @param {Object} candidature
     * @returns {Object}
     */
    formatCandidature: (candidature) => {
        return {
            ...candidature,
            statut_badge: candidatureService.getStatusBadge(candidature.statut),
            date_candidature_formatted: new Date(candidature.date_candidature).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            date_reponse_formatted: candidature.date_reponse
                ? new Date(candidature.date_reponse).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })
                : null,
        };
    },

    /**
     * Vérifier si une candidature est en attente
     * @param {Object} candidature
     * @returns {boolean}
     */
    isEnAttente: (candidature) => {
        return candidature.statut === 'en_attente';
    },

    /**
     * Vérifier si une candidature est acceptée
     * @param {Object} candidature
     * @returns {boolean}
     */
    isAcceptee: (candidature) => {
        return candidature.statut === 'accepte';
    },

    /**
     * Vérifier si une candidature est refusée
     * @param {Object} candidature
     * @returns {boolean}
     */
    isRefusee: (candidature) => {
        return candidature.statut === 'refuse';
    },

    /**
     * Calculer le délai de réponse en jours
     * @param {Object} candidature
     * @returns {number|null}
     */
    getDelaiReponse: (candidature) => {
        if (!candidature.date_reponse) return null;

        const dateCandidature = new Date(candidature.date_candidature);
        const dateReponse = new Date(candidature.date_reponse);
        const diffTime = Math.abs(dateReponse - dateCandidature);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    /**
     * Obtenir les statistiques de candidatures
     * @param {Array} candidatures
     * @returns {Object}
     */
    getStatsCandidatures: (candidatures) => {
        const total = candidatures.length;
        const enAttente = candidatures.filter((c) => c.statut === 'en_attente').length;
        const acceptees = candidatures.filter((c) => c.statut === 'accepte').length;
        const refusees = candidatures.filter((c) => c.statut === 'refuse').length;

        return {
            total,
            en_attente: enAttente,
            acceptees,
            refusees,
            taux_acceptation: total > 0 ? ((acceptees / total) * 100).toFixed(1) : 0,
        };
    },
};

export default candidatureService;
