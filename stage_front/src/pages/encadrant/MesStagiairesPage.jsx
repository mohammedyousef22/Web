// src/pages/encadrant/MesStagiairesPage.jsx
import React, { useState, useEffect } from 'react';
import { MesStagiairesList, StagiaireDetails } from '@/components/encadrant/stagiaires';
import { stageService } from '@/api/services';

const MesStagiairesPage = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStagiaire, setSelectedStagiaire] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        loadStagiaires();
    }, []);

    const loadStagiaires = async () => {
        setLoading(true);
        try {
            const response = await stageService.getMesStagiaires();
            const data = response.data || response;
            const stages = Array.isArray(data) ? data : (data.stages || []);

            // Transform stages to match component expectations
            const transformedData = stages.map(stage => ({
                ...stage.candidature.stagiaire,
                stage: stage,
                etablissement: stage.candidature.stagiaire.etablissement || 'Non renseigné',
                telephone: stage.candidature.stagiaire.telephone || stage.candidature.stagiaire.user?.telephone || '',
                formation: stage.candidature.stagiaire.formation || ''
            }));

            setStagiaires(transformedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadStagiaireDetails = async (stagiaire) => {
        setLoadingDetails(true);
        setDetailsOpen(true);
        try {
            // Charger TOUTES les données complètes du stagiaire
            const response = await stageService.getStagiaireById(stagiaire.id);
            const data = response.data || response;
            // L'API peut retourner {stagiaire: {...}} ou directement {...}
            const fullData = data.stagiaire || data;

            // Fusionner les données complètes avec la référence au stage
            setSelectedStagiaire({
                ...fullData,
                stage: stagiaire.stage
            });
        } catch (error) {
            console.error('Erreur chargement détails:', error);
            setSelectedStagiaire(stagiaire);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Mes Stagiaires</h1>

            <MesStagiairesList
                stagiaires={stagiaires}
                loading={loading}
                onView={loadStagiaireDetails}
            />

            <StagiaireDetails
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                stagiaire={selectedStagiaire}
            />
        </div>
    );
};

export default MesStagiairesPage;
