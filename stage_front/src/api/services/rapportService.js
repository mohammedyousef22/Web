// src/api/services/rapportService.js
import axiosInstance, { axiosUpload } from '../axios';
import { STAGIAIRE, ENCADRANT, buildUrl } from '../endpoints';

/**
 * Service pour gérer les rapports de stage
 */
const rapportService = {
    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Récupérer mes rapports (Stagiaire)
     * @param {Object} filters - { type, statut, page, per_page }
     * @returns {Promise}
     */
    getMesRapports: async (filters = {}) => {
        const url = buildUrl(STAGIAIRE.RAPPORTS, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'un rapport (Stagiaire)
     * @param {number} id
     * @returns {Promise}
     */
    getRapportById: async (id) => {
        return await axiosInstance.get(STAGIAIRE.RAPPORTS_BY_ID(id));
    },

    /**
     * Déposer un nouveau rapport (Stagiaire)
     * @param {Object|FormData} data - Données du rapport
     * @returns {Promise}
     */
    createRapport: async (data) => {
        if (data instanceof FormData) {
            return await axiosUpload.post(STAGIAIRE.RAPPORTS, data);
        }

        const formData = new FormData();
        formData.append('stage_id', data.stage_id);
        formData.append('type', data.type);
        formData.append('titre', data.titre);
        formData.append('fichier', data.fichier);

        return await axiosUpload.post(STAGIAIRE.RAPPORTS, formData);
    },

    /**
     * Mettre à jour un rapport (Stagiaire)
     * @param {number} id
     * @param {Object|FormData} data - Données à mettre à jour
     * @returns {Promise}
     */
    updateRapport: async (id, data) => {
        let formData;

        if (data instanceof FormData) {
            formData = data;
            formData.append('_method', 'PUT');
        } else {
            formData = new FormData();
            formData.append('_method', 'PUT');
            if (data.titre) formData.append('titre', data.titre);
            if (data.description) formData.append('description', data.description);
            if (data.fichier) formData.append('fichier', data.fichier);
        }

        return await axiosUpload.post(STAGIAIRE.RAPPORTS_BY_ID(id), formData);
    },

    // ========================
    // ENCADRANT ENDPOINTS
    // ========================

    /**
     * Récupérer les rapports de mes stagiaires (Encadrant)
     * @param {Object} filters - { statut, type, stagiaire_id, page, per_page }
     * @returns {Promise}
     */
    getRapportsAValider: async (filters = {}) => {
        const url = buildUrl(ENCADRANT.RAPPORTS, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer détails d'un rapport (Encadrant)
     * @param {number} id
     * @returns {Promise}
     */
    getRapportDetailsEncadrant: async (id) => {
        return await axiosInstance.get(ENCADRANT.RAPPORTS_BY_ID(id));
    },

    /**
     * Valider un rapport (Encadrant)
     * @param {number} id
     * @param {string} commentaire - Commentaire de validation (optionnel)
     * @returns {Promise}
     */
    validerRapport: async (id, commentaire = null) => {
        return await axiosInstance.patch(ENCADRANT.VALIDER_RAPPORT(id), {
            commentaire,
        });
    },

    /**
     * Demander des corrections sur un rapport (Encadrant)
     * @param {number} id
     * @param {string} commentaire - Commentaires et demandes de correction
     * @returns {Promise}
     */
    demanderCorrections: async (id, commentaire) => {
        return await axiosInstance.patch(ENCADRANT.CORRIGER_RAPPORT(id), {
            commentaire,
        });
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir le badge de statut du rapport
     * @param {string} statut - 'en_attente', 'valide', 'a_corriger'
     * @returns {Object}
     */
    getStatusBadge: (statut) => {
        const badges = {
            en_attente: {
                label: 'En attente',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-100',
                icon: 'Clock',
            },
            valide: {
                label: 'Validé',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                icon: 'CheckCircle',
            },
            a_corriger: {
                label: 'À corriger',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                icon: 'AlertCircle',
            },
        };

        return badges[statut] || badges.en_attente;
    },

    /**
     * Obtenir le badge de type du rapport
     * @param {string} type - 'intermediaire', 'final'
     * @returns {Object}
     */
    getTypeBadge: (type) => {
        const badges = {
            intermediaire: {
                label: 'Intermédiaire',
                color: 'text-blue-700',
                bgColor: 'bg-blue-100',
                icon: 'FileText',
            },
            final: {
                label: 'Final',
                color: 'text-purple-700',
                bgColor: 'bg-purple-100',
                icon: 'File',
            },
        };

        return badges[type] || badges.intermediaire;
    },

    /**
     * Formater un rapport pour affichage
     * @param {Object} rapport
     * @returns {Object}
     */
    formatRapport: (rapport) => {
        return {
            ...rapport,
            statut_badge: rapportService.getStatusBadge(rapport.statut),
            type_badge: rapportService.getTypeBadge(rapport.type),
            date_depot_formatted: new Date(rapport.date_depot).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            date_validation_formatted: rapport.date_validation
                ? new Date(rapport.date_validation).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })
                : null,
        };
    },

    /**
     * Vérifier si un rapport est en attente
     * @param {Object} rapport
     * @returns {boolean}
     */
    isEnAttente: (rapport) => {
        return rapport.statut === 'en_attente';
    },

    /**
     * Vérifier si un rapport est validé
     * @param {Object} rapport
     * @returns {boolean}
     */
    isValide: (rapport) => {
        return rapport.statut === 'valide';
    },

    /**
     * Vérifier si un rapport nécessite des corrections
     * @param {Object} rapport
     * @returns {boolean}
     */
    isACorreiger: (rapport) => {
        return rapport.statut === 'a_corriger';
    },

    /**
     * Vérifier si un rapport est de type final
     * @param {Object} rapport
     * @returns {boolean}
     */
    isFinal: (rapport) => {
        return rapport.type === 'final';
    },

    /**
     * Valider le fichier PDF avant upload
     * @param {File} file
     * @returns {Object} { valid: boolean, error: string }
     */
    validatePDF: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf'];

        if (!file) {
            return { valid: false, error: 'Aucun fichier sélectionné' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Seuls les fichiers PDF sont acceptés' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'Le fichier ne doit pas dépasser 10MB' };
        }

        return { valid: true, error: null };
    },

    /**
     * Obtenir l'URL de téléchargement du rapport
     * @param {string} fichierPath
     * @returns {string}
     */
    getDownloadUrl: (fichierPath) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        // Retirer /api de l'URL de base pour accéder aux fichiers storage
        const storageUrl = baseUrl.replace('/api', '');
        return `${storageUrl}/storage/${fichierPath}`;
    },

    /**
     * Obtenir les statistiques des rapports
     * @param {Array} rapports
     * @returns {Object}
     */
    getStatsRapports: (rapports) => {
        const total = rapports.length;
        const enAttente = rapports.filter((r) => r.statut === 'en_attente').length;
        const valides = rapports.filter((r) => r.statut === 'valide').length;
        const aCorreiger = rapports.filter((r) => r.statut === 'a_corriger').length;
        const intermediaires = rapports.filter((r) => r.type === 'intermediaire').length;
        const finals = rapports.filter((r) => r.type === 'final').length;

        return {
            total,
            en_attente: enAttente,
            valides,
            a_corriger: aCorreiger,
            intermediaires,
            finals,
            taux_validation: total > 0 ? ((valides / total) * 100).toFixed(1) : 0,
        };
    },
};

export default rapportService;
