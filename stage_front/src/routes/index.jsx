// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout, AdminLayout, StagiaireLayout, EncadrantLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/DashboardPage';
import OffresPage from '@/pages/admin/OffresPage';
import CandidaturesPage from '@/pages/admin/CandidaturesPage';
import EncadrantsPage from '@/pages/admin/EncadrantsPage';
import StagiairesPage from '@/pages/admin/StagiairesPage';
import DepartementsPage from '@/pages/admin/DepartementsPage';

// Stagiaire Pages
import StagiaireDashboardPage from '@/pages/stagiaire/DashboardPage';
import OffresDisponiblesPage from '@/pages/stagiaire/OffresDisponiblesPage';
import MesCandidaturesPage from '@/pages/stagiaire/MesCandidaturesPage';
import MonStagePage from '@/pages/stagiaire/MonStagePage';
import MesRapportsPage from '@/pages/stagiaire/MesRapportsPage';
import MonProfilPage from '@/pages/stagiaire/MonProfilPage';

// Encadrant Pages
import EncadrantDashboardPage from '@/pages/encadrant/DashboardPage';
import MesStagiairesPage from '@/pages/encadrant/MesStagiairesPage';
import RapportsPage from '@/pages/encadrant/RapportsPage';
import EvaluationsPage from '@/pages/encadrant/EvaluationsPage';

// Error Pages
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="offres" element={<OffresPage />} />
                <Route path="candidatures" element={<CandidaturesPage />} />
                <Route path="encadrants" element={<EncadrantsPage />} />
                <Route path="stagiaires" element={<StagiairesPage />} />
                <Route path="departements" element={<DepartementsPage />} />
            </Route>

            {/* Stagiaire Routes */}
            <Route path="/stagiaire" element={<ProtectedRoute requiredRole="stagiaire"><StagiaireLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/stagiaire/dashboard" replace />} />
                <Route path="dashboard" element={<StagiaireDashboardPage />} />
                <Route path="offres" element={<OffresDisponiblesPage />} />
                <Route path="candidatures" element={<MesCandidaturesPage />} />
                <Route path="stage" element={<MonStagePage />} />
                <Route path="rapports" element={<MesRapportsPage />} />
                <Route path="profil" element={<MonProfilPage />} />
            </Route>

            {/* Encadrant Routes */}
            <Route path="/encadrant" element={<ProtectedRoute requiredRole="encadrant"><EncadrantLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/encadrant/dashboard" replace />} />
                <Route path="dashboard" element={<EncadrantDashboardPage />} />
                <Route path="stagiaires" element={<MesStagiairesPage />} />
                <Route path="rapports" element={<RapportsPage />} />
                <Route path="evaluations" element={<EvaluationsPage />} />
            </Route>

            {/* Redirect root based on role */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;