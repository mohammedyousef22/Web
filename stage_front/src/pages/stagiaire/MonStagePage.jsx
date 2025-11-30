// src/pages/stagiaire/MonStagePage.jsx
import React, { useState, useEffect } from 'react';
import { MonStageCard, EncadrantInfoCard, ProgressBar, StageTimeline, EvaluationCard } from '@/components/stagiaire/stage';
import { stageService } from '@/api/services';
import { EmptyState } from '@/components/common';
import { Calendar } from 'lucide-react';

const MonStagePage = () => {
    const [stage, setStage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStage();
    }, []);

    const loadStage = async () => {
        try {
            const response = await stageService.getMonStage();
            console.log('📌 Réponse Mon Stage:', response);
            const stageData = response.stage || response.data?.stage || null;
            console.log('📌 Stage extrait:', stageData);
            setStage(stageData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (!stage) return <EmptyState icon={Calendar} title="Aucun stage actif" description="Vous n'avez pas de stage en cours." />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Mon Stage</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <MonStageCard stage={stage} />
                    {stage.encadrant && <EncadrantInfoCard encadrant={stage.encadrant} />}
                </div>
                <div className="space-y-6">
                    <StageTimeline stage={stage} />
                    <EvaluationCard evaluation={stage.evaluation} stage={stage} />
                </div>
            </div>
        </div>
    );
};

export default MonStagePage;