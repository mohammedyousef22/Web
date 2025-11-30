// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import StagiaireLayout from '@/components/layout/StagiaireLayout';
import EncadrantLayout from '@/components/layout/EncadrantLayout';
import AuthLayout from '@/components/layout/AuthLayout';

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
import TestStagiairePage from '@/pages/stagiaire/TestPage';
import OffresDisponiblesPage from '@/pages/stagiaire/OffresDisponiblesPage';
import MesCandidaturesPage from '@/pages/stagiaire/MesCandidaturesPage';
import MonStagePage from '@/pages/stagiaire/MonStagePage';
import MesRapportsPage from '@/pages/stagiaire/MesRapportsPage';
import MonProfilPage from '@/pages/stagiaire/MonProfilPage';

// Encadrant Pages
import EncadrantDashboardPage from '@/pages/encadrant/DashboardPage';
import MesOffresPage from '@/pages/encadrant/MesOffresPage';
import MesStagiairesPage from '@/pages/encadrant/MesStagiairesPage';
import RapportsPage from '@/pages/encadrant/RapportsPage';
import EvaluationsPage from '@/pages/encadrant/EvaluationsPage';

// Other Pages
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Routes Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="offres" element={<OffresPage />} />
          <Route path="candidatures" element={<CandidaturesPage />} />
          <Route path="encadrants" element={<EncadrantsPage />} />
          <Route path="stagiaires" element={<StagiairesPage />} />
          <Route path="departements" element={<DepartementsPage />} />
        </Route>

        {/* Routes Stagiaire */}
        <Route path="/stagiaire" element={<StagiaireLayout />}>
          <Route path="dashboard" element={<StagiaireDashboardPage />} />
          <Route path="test" element={<TestStagiairePage />} />
          <Route path="offres" element={<OffresDisponiblesPage />} />
          <Route path="candidatures" element={<MesCandidaturesPage />} />
          <Route path="stage" element={<MonStagePage />} />
          <Route path="rapports" element={<MesRapportsPage />} />
          <Route path="profil" element={<MonProfilPage />} />
        </Route>

        {/* Routes Encadrant */}
        <Route path="/encadrant" element={<EncadrantLayout />}>
          <Route path="dashboard" element={<EncadrantDashboardPage />} />
          <Route path="offres" element={<MesOffresPage />} />
          <Route path="stagiaires" element={<MesStagiairesPage />} />
          <Route path="rapports" element={<RapportsPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
        </Route>

        {/* Routes par défaut et erreurs */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;


