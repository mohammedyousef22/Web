// src/components/admin/candidatures/CandidatureList.jsx
import React from 'react';
import CandidatureCard from './CandidatureCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { FileText } from 'lucide-react';

const CandidatureList = ({ candidatures, loading, onAccept, onReject, onView }) => {
    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Chargement des candidatures..." />
            </div>
        );
    }

    if (candidatures.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="Aucune candidature"
                description="Aucune candidature ne correspond à vos critères."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidatures.map((candidature) => (
                <CandidatureCard
                    key={candidature.id}
                    candidature={candidature}
                    onAccept={onAccept}
                    onReject={onReject}
                    onView={onView}
                />
            ))}
        </div>
    );
};

export default CandidatureList;