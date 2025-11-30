// src/api/axios.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Instance Axios principale
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 secondes
});

// Instance pour upload de fichiers
export const axiosUpload = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
    },
    timeout: 60000, // 60 secondes pour uploads
});

// Intercepteur Request - Ajouter token JWT
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosUpload.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur Response - Gérer erreurs et refresh token
axiosInstance.interceptors.response.use(
    (response) => {
        // Retourner directement data.data si succès
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si 401 et pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tentative de refresh token (optionnel selon backend)
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const newToken = response.data.access_token;
                    localStorage.setItem('access_token', newToken);

                    // Retry la requête originale
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh échoué → logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Si 403 - Accès refusé (sauf si c'est un logout)
        if (error.response?.status === 403 && !error.config?.url?.includes('/logout')) {
            console.error('==========================================');
            console.error('403 FORBIDDEN - Redirection DÉSACTIVÉE pour debug');
            console.error('URL qui a causé le 403:', error.config?.url);
            console.error('Erreur complète:', error.response?.data);
            console.error('Headers de la requête:', error.config?.headers);
            console.error('==========================================');

            // TEMPORAIREMENT COMMENTÉ POUR DEBUG
            // window.location.href = '/unauthorized';
        }

        // Formatter l'erreur pour faciliter usage
        const formattedError = {
            message: error.response?.data?.message || 'Une erreur est survenue',
            errors: error.response?.data?.errors || {},
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(formattedError);
    }
);

axiosUpload.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    },
    (error) => {
        const formattedError = {
            message: error.response?.data?.message || 'Erreur lors de l\'upload',
            errors: error.response?.data?.errors || {},
            status: error.response?.status,
            data: error.response?.data,
        };
        return Promise.reject(formattedError);
    }
);

export default axiosInstance;
