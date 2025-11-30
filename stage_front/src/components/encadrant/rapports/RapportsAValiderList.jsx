// src/components/encadrant/rapports/RapportsAValiderList.jsx
import React from 'react';
import { RapportCard } from './RapportCard';
import { EmptyState } from '@/components/common';
import { FileText } from 'lucide-react';

export const RapportsAValiderList = ({ rapports, loading, onView, onValider, onCorrections }) => {
    if (loading) {
        return <div className="text-center py-8 text-gray-600">Chargement des rapports...</div>;
    }

    if (!rapports || rapports.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="Aucun rapport à valider"
                description="Tous les rapports ont été traités"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rapports.map(rapport => (
                <RapportCard
                    key={rapport.id}
                    rapport={rapport}
                    onView={onView}
                    onValider={onValider}
                    onCorrections={onCorrections}
                />
            ))}
        </div>
    );
};

export default RapportsAValiderList;