// src/api/services/authService.js
import axiosInstance, { axiosUpload } from '../axios';
import { AUTH } from '../endpoints';

/**
 * Service d'authentification
 */
const authService = {
    /**
     * Inscription d'un nouveau stagiaire
     * @param {Object} data - Données d'inscription (name, email, password, cin, telephone, etc.)
     * @returns {Promise} Response avec user et token
     */
    register: async (data) => {
        const response = await axiosUpload.post(AUTH.REGISTER, data);

        // Sauvegarder token et user
        if (response.token) {
            localStorage.setItem('access_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Connexion
     * @param {string} email
     * @param {string} password
     * @returns {Promise} Response avec user et token
     */
    login: async (email, password) => {
        const response = await axiosInstance.post(AUTH.LOGIN, { email, password });

        // Sauvegarder token et user
        if (response.token) {
            localStorage.setItem('access_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Si refresh token existe
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }
        }

        return response;
    },

    /**
     * Déconnexion
     * @returns {Promise}
     */
    logout: async () => {
        try {
            await axiosInstance.post(AUTH.LOGOUT);
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            // Nettoyer le localStorage dans tous les cas
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Récupérer les infos de l'utilisateur connecté
     * @returns {Promise} User object
     */
    getCurrentUser: async () => {
        const response = await axiosInstance.get(AUTH.USER);

        // Mettre à jour le localStorage
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Mettre à jour le profil
     * @param {Object} data - Nouvelles données du profil
     * @returns {Promise}
     */
    updateProfile: async (data) => {
        const response = await axiosInstance.put(AUTH.UPDATE_PROFILE, data);

        // Mettre à jour user dans localStorage
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Changer le mot de passe
     * @param {string} currentPassword
     * @param {string} newPassword
     * @param {string} newPasswordConfirmation
     * @returns {Promise}
     */
    changePassword: async (currentPassword, newPassword, newPasswordConfirmation) => {
        return await axiosInstance.post(AUTH.CHANGE_PASSWORD, {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        });
    },

    /**
     * Mot de passe oublié
     * @param {string} email
     * @returns {Promise}
     */
    forgotPassword: async (email) => {
        return await axiosInstance.post(AUTH.FORGOT_PASSWORD, { email });
    },

    /**
     * Réinitialiser le mot de passe
     * @param {Object} data - { email, token, password, password_confirmation }
     * @returns {Promise}
     */
    resetPassword: async (data) => {
        return await axiosInstance.post(AUTH.RESET_PASSWORD, data);
    },

    /**
     * Vérifier si l'utilisateur est authentifié
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    /**
     * Récupérer le user depuis localStorage
     * @returns {Object|null}
     */
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Récupérer le rôle de l'utilisateur
     * @returns {string|null} - 'admin', 'stagiaire', 'encadrant'
     */
    getUserRole: () => {
        const user = authService.getStoredUser();
        return user?.role || null;
    },

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     * @param {string} role - 'admin', 'stagiaire', 'encadrant'
     * @returns {boolean}
     */
    hasRole: (role) => {
        return authService.getUserRole() === role;
    },
};

export default authService;
