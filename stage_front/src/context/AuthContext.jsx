// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/api/services';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

/**
 * Provider d'authentification
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Charger l'utilisateur au démarrage
    useEffect(() => {
        const initAuth = async () => {
            const isAuthenticated = authService.isAuthenticated();

            if (isAuthenticated) {
                // D'abord charger le user depuis localStorage (instantané)
                const userFromStorage = localStorage.getItem('user');
                if (userFromStorage) {
                    try {
                        setUser(JSON.parse(userFromStorage));
                    } catch (e) {
                        console.error('Erreur parsing user localStorage:', e);
                    }
                }

                // Puis mettre à jour depuis le serveur
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.user);
                } catch (error) {
                    console.error('Erreur auth init - getCurrentUser failed:', error);
                    console.error('Error status:', error.response?.status);

                    // Ne déconnecter que si c'est une erreur 401 (Non authentifié)
                    if (error.response?.status === 401) {
                        console.log('Token invalide (401) -> Logout');
                        authService.logout();
                        setUser(null);
                    } else {
                        console.log('Erreur non-critique (pas 401) -> On garde le user du localStorage');
                        // On ne déconnecte PAS pour les autres erreurs (ex: 403, 404, 500)
                    }
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Connexion
     */
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            setUser(response.user);

            // Rediriger selon le rôle
            const role = response.user.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'stagiaire') {
                navigate('/stagiaire/dashboard');
            } else if (role === 'encadrant') {
                navigate('/encadrant/dashboard');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Inscription (stagiaire uniquement)
     */
    const register = async (data) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);
            navigate('/stagiaire/dashboard');
            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Déconnexion
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            setUser(null);
            // Utiliser window.location pour éviter la vérification du layout
            window.location.href = '/login';
        }
    };

    /**
     * Mise à jour du profil
     */
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     */
    const hasRole = (role) => {
        return user?.role === role;
    };

    /**
     * Vérifier si l'utilisateur est authentifié
     */
    const isAuthenticated = () => {
        return !!user;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte Auth
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

export default AuthContext;