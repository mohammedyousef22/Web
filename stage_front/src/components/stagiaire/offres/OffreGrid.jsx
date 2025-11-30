// src/components/stagiaire/offres/OffreGrid.jsx
import React from 'react';
import { OffreCardStagiaire as OffreCard } from './OffreCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { Briefcase } from 'lucide-react';

export const OffreGrid = ({ offres, loading, onPostuler, onViewDetails }) => {
    if (loading) return <LoadingSpinner size="lg" text="Chargement des offres..." />;
    if (offres.length === 0) return <EmptyState icon={Briefcase} title="Aucune offre disponible" description="Revenez plus tard pour découvrir de nouvelles opportunités !" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres.map(offre => (
                <OffreCard key={offre.id} offre={offre} onPostuler={onPostuler} onViewDetails={onViewDetails} />
            ))}
        </div>
    );
};