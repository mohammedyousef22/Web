// src/components/layout/EncadrantLayout.jsx
import React from 'react';
import MainLayout from './MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Layout spécifique Encadrant avec protection de route
 */
const EncadrantLayout = () => {
    const { user, loading } = useAuth();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    // Vérifier si l'utilisateur est encadrant
    if (!user || user.role !== 'encadrant') {
        return <Navigate to="/unauthorized" replace />;
    }

    return <MainLayout />;
};

export default EncadrantLayout;