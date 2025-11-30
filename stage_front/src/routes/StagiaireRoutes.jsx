// src/routes/StagiaireRoutes.jsx
export const StagiaireRoutes = () => (
  <>
    <Route path="dashboard" element={<StagiaireDashboardPage />} />
    <Route path="offres" element={<OffresDisponiblesPage />} />
    <Route path="candidatures" element={<MesCandidaturesPage />} />
    <Route path="stage" element={<MonStagePage />} />
    <Route path="rapports" element={<MesRapportsPage />} />
    <Route path="profil" element={<MonProfilPage />} />
  </>
);