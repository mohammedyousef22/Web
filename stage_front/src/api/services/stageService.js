// src/api/services/stageService.js
import axiosInstance from '../axios';
import { STAGIAIRE, ENCADRANT } from '../endpoints';

/**
 * Service pour gérer les stages
 */
const stageService = {
    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Récupérer mon stage actif (Stagiaire)
     * @returns {Promise}
     */
    getMonStage: async () => {
        return await axiosInstance.get(STAGIAIRE.MON_STAGE);
    },

    /**
     * Récupérer les infos de mon encadrant (Stagiaire)
     * @returns {Promise}
     */
    getMonEncadrant: async () => {
        return await axiosInstance.get(STAGIAIRE.MON_ENCADRANT);
    },

    /**
     * Télécharger mon attestation (Stagiaire)
     * @returns {Promise}
     */
    downloadAttestation: async () => {
        return await axiosInstance.get('/stagiaire/stage/download-attestation', {
            responseType: 'blob'
        });
    },

    // ========================
    // ENCADRANT ENDPOINTS
    // ========================

    /**
     * Récupérer mes stagiaires (Encadrant)
     * @param {Object} filters - { statut, page, per_page }
     * @returns {Promise}
     */
    getMesStagiaires: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `${ENCADRANT.MES_STAGIAIRES}?${params}` : ENCADRANT.MES_STAGIAIRES;
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'un stagiaire (Encadrant)
     * @param {number} id
     * @returns {Promise}
     */
    getStagiaireById: async (id) => {
        return await axiosInstance.get(ENCADRANT.STAGIAIRE_BY_ID(id));
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir le badge de statut du stage
     * @param {string} statut - 'en_cours', 'termine', 'interrompu'
     * @returns {Object}
     */
    getStatusBadge: (statut) => {
        const badges = {
            en_cours: {
                label: 'En cours',
                color: 'text-blue-700',
                bgColor: 'bg-blue-100',
                icon: 'PlayCircle',
            },
            termine: {
                label: 'Terminé',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                icon: 'CheckCircle',
            },
            interrompu: {
                label: 'Interrompu',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                icon: 'XCircle',
            },
        };

        return badges[statut] || badges.en_cours;
    },

    /**
     * Calculer la progression du stage en %
     * @param {Object} stage
     * @returns {number} Pourcentage (0-100)
     */
    calculateProgress: (stage) => {
        const dateDebut = new Date(stage.date_debut_reelle);
        const dateFin = new Date(stage.date_fin_reelle);
        const today = new Date();

        if (today < dateDebut) return 0;
        if (today >= dateFin) return 100;

        const totalDuration = dateFin - dateDebut;
        const elapsed = today - dateDebut;

        return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
    },

    /**
     * Calculer le nombre de jours restants
     * @param {Object} stage
     * @returns {number}
     */
    getJoursRestants: (stage) => {
        const dateFin = new Date(stage.date_fin_reelle);
        const today = new Date();

        if (today >= dateFin) return 0;

        const diffTime = dateFin - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    /**
     * Calculer le nombre de jours écoulés
     * @param {Object} stage
     * @returns {number}
     */
    getJoursEcoules: (stage) => {
        const dateDebut = new Date(stage.date_debut_reelle);
        const today = new Date();

        if (today < dateDebut) return 0;

        const diffTime = today - dateDebut;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    /**
     * Obtenir la durée totale du stage en jours
     * @param {Object} stage
     * @returns {number}
     */
    getDureeTotale: (stage) => {
        const dateDebut = new Date(stage.date_debut_reelle);
        const dateFin = new Date(stage.date_fin_reelle);

        const diffTime = dateFin - dateDebut;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    /**
     * Formater un stage pour affichage
     * @param {Object} stage
     * @returns {Object}
     */
    formatStage: (stage) => {
        return {
            ...stage,
            statut_badge: stageService.getStatusBadge(stage.statut),
            progression: stageService.calculateProgress(stage),
            jours_restants: stageService.getJoursRestants(stage),
            jours_ecoules: stageService.getJoursEcoules(stage),
            duree_totale: stageService.getDureeTotale(stage),
            date_debut_formatted: new Date(stage.date_debut_reelle).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            date_fin_formatted: new Date(stage.date_fin_reelle).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        };
    },

    /**
     * Vérifier si le stage est en cours
     * @param {Object} stage
     * @returns {boolean}
     */
    isEnCours: (stage) => {
        return stage.statut === 'en_cours';
    },

    /**
     * Vérifier si le stage est terminé
     * @param {Object} stage
     * @returns {boolean}
     */
    isTermine: (stage) => {
        return stage.statut === 'termine';
    },

    /**
     * Vérifier si le stage approche de la fin (moins de 7 jours)
     * @param {Object} stage
     * @returns {boolean}
     */
    isApprocheFin: (stage) => {
        const joursRestants = stageService.getJoursRestants(stage);
        return joursRestants <= 7 && joursRestants > 0;
    },

    /**
     * Obtenir le message de progression
     * @param {Object} stage
     * @returns {string}
     */
    getProgressMessage: (stage) => {
        const joursRestants = stageService.getJoursRestants(stage);

        if (joursRestants === 0) {
            return 'Stage terminé';
        } else if (joursRestants === 1) {
            return 'Dernier jour de stage';
        } else if (joursRestants <= 7) {
            return `${joursRestants} jours restants`;
        } else {
            return `${joursRestants} jours restants`;
        }
    },
};

export default stageService;
