// src/routes/AdminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboardPage from '@/pages/admin/DashboardPage';
import OffresPage from '@/pages/admin/OffresPage';
import CandidaturesPage from '@/pages/admin/CandidaturesPage';
import EncadrantsPage from '@/pages/admin/EncadrantsPage';
import StagiairesPage from '@/pages/admin/StagiairesPage';
import DepartementsPage from '@/pages/admin/DepartementsPage';

export const AdminRoutes = () => (
    <>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="offres" element={<OffresPage />} />
        <Route path="candidatures" element={<CandidaturesPage />} />
        <Route path="encadrants" element={<EncadrantsPage />} />
        <Route path="stagiaires" element={<StagiairesPage />} />
        <Route path="departements" element={<DepartementsPage />} />
    </>
);
