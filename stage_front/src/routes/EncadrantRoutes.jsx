// src/routes/EncadrantRoutes.jsx
export const EncadrantRoutes = () => (
    <>
        <Route path="dashboard" element={<EncadrantDashboardPage />} />
        <Route path="stagiaires" element={<MesStagiairesPage />} />
        <Route path="rapports" element={<RapportsPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
    </>
);