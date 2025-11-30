// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common';

/**
 * HOC pour protéger les routes selon le rôle
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, loading } = useAuth();

    // Afficher loading pendant vérification
    if (loading) {
        return <LoadingSpinner fullScreen text="Vérification..." />;
    }

    // Pas authentifié → redirect login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier le rôle si spécifié
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // OK → afficher le composant
    return children;
};

export default ProtectedRoute;