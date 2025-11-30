// src/api/services/stagiaireService.js
import axiosInstance, { axiosUpload } from '../axios';
import { ADMIN, STAGIAIRE, buildUrl } from '../endpoints';
import exportService from './exportService';

/**
 * Service pour gérer les stagiaires
 */
const stagiaireService = {
    // ========================
    // ADMIN ENDPOINTS
    // ========================

    /**
     * Récupérer tous les stagiaires (Admin)
     * @param {Object} filters - { search, etablissement, niveau_etude, page, per_page }
     * @returns {Promise}
     */
    getAllStagiaires: async (filters = {}) => {
        const url = buildUrl(ADMIN.STAGIAIRES, filters);
        return await axiosInstance.get(url);
    },

    /**
     * Récupérer un stagiaire par ID (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    getStagiaireById: async (id) => {
        return await axiosInstance.get(ADMIN.STAGIAIRES_BY_ID(id));
    },

    /**
     * Supprimer un stagiaire (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    deleteStagiaire: async (id) => {
        return await axiosInstance.delete(ADMIN.STAGIAIRES_BY_ID(id));
    },

    /**
     * Exporter les stagiaires (Admin)
     * @param {Object} filters
     * @returns {Promise}
     */
    exportStagiaires: async (filters = {}) => {
        return await exportService.exportStagiairesPDF(filters);
    },

    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Récupérer mon profil (Stagiaire)
     * @returns {Promise}
     */
    getMonProfil: async () => {
        return await axiosInstance.get(STAGIAIRE.PROFIL);
    },

    /**
     * Mettre à jour mon profil (Stagiaire)
     * @param {Object} data
     * @returns {Promise}
     */
    updateProfil: async (data) => {
        return await axiosInstance.put(STAGIAIRE.UPDATE_PROFIL, data);
    },

    /**
     * Upload CV (Stagiaire)
     * @param {File} file
     * @returns {Promise}
     */
    uploadCV: async (file) => {
        const formData = new FormData();
        formData.append('cv', file);

        return await axiosUpload.post(STAGIAIRE.UPLOAD_CV, formData);
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Formater un stagiaire pour affichage
     * @param {Object} stagiaire
     * @returns {Object}
     */
    formatStagiaire: (stagiaire) => {
        return {
            ...stagiaire,
            full_name: stagiaire.user?.name || 'N/A',
            email: stagiaire.user?.email || 'N/A',
            age: stagiaire.date_naissance ? stagiaireService.calculateAge(stagiaire.date_naissance) : null,
            date_naissance_formatted: stagiaire.date_naissance
                ? new Date(stagiaire.date_naissance).toLocaleDateString('fr-FR')
                : null,
            created_at_formatted: new Date(stagiaire.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            has_cv: !!stagiaire.cv_path,
            cv_url: stagiaire.cv_path ? stagiaireService.getCVUrl(stagiaire.cv_path) : null,
        };
    },

    /**
     * Calculer l'âge depuis la date de naissance
     * @param {string} dateNaissance - Format YYYY-MM-DD
     * @returns {number}
     */
    calculateAge: (dateNaissance) => {
        const today = new Date();
        const birthDate = new Date(dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    },

    /**
     * Obtenir l'URL du CV
     * @param {string} cvPath
     * @returns {string}
     */
    getCVUrl: (cvPath) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const storageUrl = baseUrl.replace('/api', '');
        return `${storageUrl}/storage/${cvPath}`;
    },

    /**
     * Valider les données de profil stagiaire
     * @param {Object} data
     * @returns {Object} { valid: boolean, errors: object }
     */
    validateProfil: (data) => {
        const errors = {};

        // Validation CIN
        if (data.cin && !/^[A-Z]{1,2}[0-9]{5,7}$/.test(data.cin)) {
            errors.cin = 'Format CIN invalide (ex: AB123456)';
        }

        // Validation téléphone
        if (data.telephone && !/^[0-9]{10}$/.test(data.telephone.replace(/\s/g, ''))) {
            errors.telephone = 'Le téléphone doit contenir 10 chiffres';
        }

        // Validation établissement
        if (!data.etablissement || data.etablissement.trim().length < 3) {
            errors.etablissement = 'L\'établissement doit contenir au moins 3 caractères';
        }

        // Validation niveau d'étude
        if (!data.niveau_etude || data.niveau_etude.trim().length < 3) {
            errors.niveau_etude = 'Le niveau d\'étude est requis';
        }

        // Validation filière
        if (!data.filiere || data.filiere.trim().length < 3) {
            errors.filiere = 'La filière est requise';
        }

        // Validation date de naissance
        if (data.date_naissance) {
            const age = stagiaireService.calculateAge(data.date_naissance);
            if (age < 16 || age > 99) {
                errors.date_naissance = 'L\'âge doit être entre 16 et 99 ans';
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    },

    /**
     * Valider le CV avant upload
     * @param {File} file
     * @returns {Object} { valid: boolean, error: string }
     */
    validateCV: (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf'];

        if (!file) {
            return { valid: false, error: 'Aucun fichier sélectionné' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Seuls les fichiers PDF sont acceptés' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'Le fichier ne doit pas dépasser 5MB' };
        }

        return { valid: true, error: null };
    },

    /**
     * Obtenir les statistiques des stagiaires
     * @param {Array} stagiaires
     * @returns {Object}
     */
    getStatsStagiaires: (stagiaires) => {
        const total = stagiaires.length;
        const avecStage = stagiaires.filter((s) => s.stage_actif).length;
        const sansStage = total - avecStage;
        const avecCV = stagiaires.filter((s) => s.cv_path).length;

        // Répartition par niveau d'étude
        const parNiveau = {};
        stagiaires.forEach((s) => {
            const niveau = s.niveau_etude || 'Non spécifié';
            parNiveau[niveau] = (parNiveau[niveau] || 0) + 1;
        });

        // Répartition par établissement
        const parEtablissement = {};
        stagiaires.forEach((s) => {
            const etab = s.etablissement || 'Non spécifié';
            parEtablissement[etab] = (parEtablissement[etab] || 0) + 1;
        });

        return {
            total,
            avec_stage: avecStage,
            sans_stage: sansStage,
            avec_cv: avecCV,
            taux_stage: total > 0 ? ((avecStage / total) * 100).toFixed(1) : 0,
            par_niveau: parNiveau,
            par_etablissement: parEtablissement,
        };
    },

    /**
     * Rechercher des stagiaires
     * @param {Array} stagiaires
     * @param {string} query
     * @returns {Array}
     */
    search: (stagiaires, query) => {
        if (!query || query.trim() === '') return stagiaires;

        const lowerQuery = query.toLowerCase().trim();

        return stagiaires.filter((stagiaire) => {
            const name = stagiaire.user?.name?.toLowerCase() || '';
            const email = stagiaire.user?.email?.toLowerCase() || '';
            const cin = stagiaire.cin?.toLowerCase() || '';
            const etablissement = stagiaire.etablissement?.toLowerCase() || '';
            const filiere = stagiaire.filiere?.toLowerCase() || '';

            return (
                name.includes(lowerQuery) ||
                email.includes(lowerQuery) ||
                cin.includes(lowerQuery) ||
                etablissement.includes(lowerQuery) ||
                filiere.includes(lowerQuery)
            );
        });
    },

    /**
     * Filtrer par établissement
     * @param {Array} stagiaires
     * @param {string} etablissement
     * @returns {Array}
     */
    filterByEtablissement: (stagiaires, etablissement) => {
        if (!etablissement) return stagiaires;
        return stagiaires.filter((s) => s.etablissement === etablissement);
    },

    /**
     * Filtrer par niveau d'étude
     * @param {Array} stagiaires
     * @param {string} niveau
     * @returns {Array}
     */
    filterByNiveau: (stagiaires, niveau) => {
        if (!niveau) return stagiaires;
        return stagiaires.filter((s) => s.niveau_etude === niveau);
    },

    /**
     * Obtenir la liste unique des établissements
     * @param {Array} stagiaires
     * @returns {Array}
     */
    getEtablissements: (stagiaires) => {
        const etablissements = stagiaires.map((s) => s.etablissement).filter(Boolean);
        return [...new Set(etablissements)].sort();
    },

    /**
     * Obtenir la liste unique des niveaux d'étude
     * @param {Array} stagiaires
     * @returns {Array}
     */
    getNiveauxEtude: (stagiaires) => {
        const niveaux = stagiaires.map((s) => s.niveau_etude).filter(Boolean);
        return [...new Set(niveaux)].sort();
    },
};

export default stagiaireService;
