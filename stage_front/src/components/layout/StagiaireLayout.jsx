// src/components/layout/StagiaireLayout.jsx
import React from 'react';
import MainLayout from './MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Layout spécifique Stagiaire avec protection de route
 */
const StagiaireLayout = () => {
    const { user, loading } = useAuth();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Vérifier si l'utilisateur est stagiaire
    console.log('StagiaireLayout - user:', user);
    console.log('StagiaireLayout - user.role:', user?.role);
    console.log('StagiaireLayout - check:', !user || user.role !== 'stagiaire');

    if (!user || user.role !== 'stagiaire') {
        console.log('StagiaireLayout - Redirecting to /unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    return <MainLayout />;
};

export default StagiaireLayout;