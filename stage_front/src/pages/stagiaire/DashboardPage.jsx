// src/pages/stagiaire/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { WelcomeCard, CandidaturesStatusCard, StageActiveCard } from '@/components/stagiaire/dashboard';
import { candidatureService, stageService } from '@/api/services';

const DashboardPage = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [stage, setStage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [candResp, stageResp] = await Promise.all([
                candidatureService.getMesCandidatures(),
                stageService.getMonStage().catch(() => ({ stage: null }))
            ]);
            setCandidatures(candResp.candidatures || []);
            setStage(stageResp.stage);
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <WelcomeCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CandidaturesStatusCard candidatures={candidatures} />
                <StageActiveCard stage={stage} />
            </div>
        </div>
    );
};

export default DashboardPage;