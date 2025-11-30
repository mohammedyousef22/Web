// src/components/admin/stagiaires/StagiaireList.jsx
import React from 'react';
import StagiaireCard from './StagiaireCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { GraduationCap } from 'lucide-react';

export const StagiaireList = ({ stagiaires, loading, onView }) => {
    if (loading) return <LoadingSpinner size="lg" text="Chargement..." />;
    if (stagiaires.length === 0) return <EmptyState icon={GraduationCap} title="Aucun stagiaire" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stagiaires.map((stagiaire) => (
                <StagiaireCard key={stagiaire.id} stagiaire={stagiaire} onView={onView} />
            ))}
        </div>
    );
};