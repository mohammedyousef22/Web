// src/components/layout/AdminLayout.jsx
import React from 'react';
import MainLayout from './MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Layout spécifique Admin avec protection de route
 */
const AdminLayout = () => {
    const { user, loading } = useAuth();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    return <MainLayout />;
};

export default AdminLayout;