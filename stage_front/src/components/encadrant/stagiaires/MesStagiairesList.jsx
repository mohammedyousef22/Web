// src/components/encadrant/stagiaires/MesStagiairesList.jsx
import React from 'react';
import { StagiaireCardEncadrant as StagiaireCard } from './StagiaireCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { Users } from 'lucide-react';

export const MesStagiairesList = ({ stagiaires, loading, onView }) => {
    if (loading) return <LoadingSpinner size="lg" text="Chargement..." />;
    if (stagiaires.length === 0) return <EmptyState icon={Users} title="Aucun stagiaire" description="Vous n'avez pas encore de stagiaires assignés." />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stagiaires.map(stagiaire => (
                <StagiaireCard key={stagiaire.id} stagiaire={stagiaire} onView={onView} />
            ))}
        </div>
    );
};