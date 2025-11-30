// src/api/endpoints.js

// ========================
// AUTH ENDPOINTS
// ========================
export const AUTH = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    USER: '/auth/user',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/auth/change-password',
};

// ========================
// ADMIN ENDPOINTS
// ========================
export const ADMIN = {
    // Offres
    OFFRES: '/admin/offres',
    OFFRES_BY_ID: (id) => `/admin/offres/${id}`,
    OFFRES_STATUS: (id) => `/admin/offres/${id}/status`,

    // Candidatures
    CANDIDATURES: '/admin/candidatures',
    CANDIDATURES_BY_ID: (id) => `/admin/candidatures/${id}`,
    CANDIDATURES_ACCEPT: (id) => `/admin/candidatures/${id}/accept`,
    CANDIDATURES_REJECT: (id) => `/admin/candidatures/${id}/reject`,

    // Encadrants
    ENCADRANTS: '/admin/encadrants',
    ENCADRANTS_BY_ID: (id) => `/admin/encadrants/${id}`,

    // Départements
    DEPARTEMENTS: '/admin/departements',
    DEPARTEMENTS_BY_ID: (id) => `/admin/departements/${id}`,

    // Stagiaires
    STAGIAIRES: '/admin/stagiaires',
    STAGIAIRES_BY_ID: (id) => `/admin/stagiaires/${id}`,

    // Dashboard & Stats
    DASHBOARD_STATS: '/admin/dashboard/stats',

    // Exports
    EXPORT_STAGIAIRES: '/admin/export/stagiaires',
    EXPORT_ENCADRANTS: '/admin/export/encadrants',
    EXPORT_STAGES: '/admin/export/stages',
};

// ========================
// STAGIAIRE ENDPOINTS
// ========================
export const STAGIAIRE = {
    // Offres
    OFFRES: '/stagiaire/offres',
    OFFRES_BY_ID: (id) => `/stagiaire/offres/${id}`,

    // Candidatures
    CANDIDATURES: '/stagiaire/candidatures',
    CANDIDATURES_BY_ID: (id) => `/stagiaire/candidatures/${id}`,
    POSTULER: '/stagiaire/candidatures',

    // Stage
    MON_STAGE: '/stagiaire/stage/mon-stage',
    MON_ENCADRANT: '/stagiaire/stage/mon-encadrant',

    // Rapports
    RAPPORTS: '/stagiaire/rapports',
    RAPPORTS_BY_ID: (id) => `/stagiaire/rapports/${id}`,

    // Profil
    PROFIL: '/stagiaire/profil',
    UPDATE_PROFIL: '/stagiaire/profil',
    UPLOAD_CV: '/stagiaire/upload-cv',

    // Évaluation
    MON_EVALUATION: '/stagiaire/stage/mon-evaluation',
};

// ========================
// ENCADRANT ENDPOINTS
// ========================
export const ENCADRANT = {
    // Dashboard
    DASHBOARD_STATS: '/encadrant/dashboard/stats',

    // Stagiaires
    MES_STAGIAIRES: '/encadrant/stagiaires',
    STAGIAIRE_BY_ID: (id) => `/encadrant/stagiaires/${id}`,

    // Rapports
    RAPPORTS: '/encadrant/rapports',
    RAPPORTS_BY_ID: (id) => `/encadrant/rapports/${id}`,
    VALIDER_RAPPORT: (id) => `/encadrant/rapports/${id}/valider`,
    CORRIGER_RAPPORT: (id) => `/encadrant/rapports/${id}/corriger`,

    // Évaluations
    EVALUATIONS: '/encadrant/evaluations',
    EVALUATION_BY_STAGE: (stageId) => `/encadrant/evaluations/stage/${stageId}`,
    EVALUATION_BY_ID: (id) => `/encadrant/evaluations/${id}`,
};

// ========================
// NOTIFICATIONS ENDPOINTS
// ========================
export const NOTIFICATIONS = {
    ALL: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    MARK_AS_READ: (id) => `/notifications/${id}/mark-as-read`,
    MARK_ALL_AS_READ: '/notifications/mark-all-as-read',
    DELETE: (id) => `/notifications/${id}`,
    UNREAD_COUNT: '/notifications/unread-count',
};

// ========================
// HELPER FUNCTIONS
// ========================

/**
 * Construire URL avec query params
 * @param {string} baseUrl - URL de base
 * @param {object} params - Paramètres query
 * @returns {string} URL complète
 */
export const buildUrl = (baseUrl, params = {}) => {
    const filteredParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Construire URL avec path params et query params
 * @param {function} endpoint - Fonction endpoint avec params
 * @param {any} pathParam - Paramètre de path (ex: id)
 * @param {object} queryParams - Paramètres query
 * @returns {string} URL complète
 */
export const buildUrlWithParams = (endpoint, pathParam, queryParams = {}) => {
    const baseUrl = endpoint(pathParam);
    return buildUrl(baseUrl, queryParams);
};
