// src/pages/encadrant/EvaluationsPage.jsx
import React, { useState, useEffect } from 'react';
import { EvaluationForm, CompetencesChecklist } from '@/components/encadrant/evaluations';
import { stageService, evaluationService } from '@/api/services';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { ClipboardCheck } from 'lucide-react';

const EvaluationsPage = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStagiaire, setSelectedStagiaire] = useState(null);

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
                originalStage: stage, // Store full stage object
                stage_id: stage.id,
                evaluation: stage.evaluation,
                nom: stage.candidature.stagiaire.user?.name?.split(' ')[1] || stage.candidature.stagiaire.user?.name || '',
                prenom: stage.candidature.stagiaire.user?.name?.split(' ')[0] || '',
                email: stage.candidature.stagiaire.user?.email || ''
            }));

            setStagiaires(transformedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluationSubmit = async (data) => {
        try {
            await evaluationService.createEvaluation(selectedStagiaire.stage_id, data);
            loadStagiaires();
            setSelectedStagiaire(null);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    if (stagiaires.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Évaluations</h1>
                <EmptyState
                    icon={ClipboardCheck}
                    title="Aucun stagiaire à évaluer"
                    description="Vous n'avez pas encore de stagiaires assignés."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Évaluer mes Stagiaires</h1>

            {!selectedStagiaire ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stagiaires.map(stagiaire => (
                        <div
                            key={stagiaire.id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedStagiaire(stagiaire)}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                {stagiaire.nom} {stagiaire.prenom}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">{stagiaire.email}</p>
                            {stagiaire.evaluation ? (
                                <span className="inline-block mt-4 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Évalué
                                </span>
                            ) : (
                                <span className="inline-block mt-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    À évaluer
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <button
                        onClick={() => setSelectedStagiaire(null)}
                        className="mb-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Retour à la liste
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Évaluation de {selectedStagiaire.nom} {selectedStagiaire.prenom}
                    </h2>
                    <EvaluationForm
                        stage={selectedStagiaire.originalStage}
                        onSuccess={handleEvaluationSubmit}
                        onCancel={() => setSelectedStagiaire(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default EvaluationsPage;
