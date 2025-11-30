// src/components/stagiaire/candidatures/MesCandidaturesList.jsx
import React from 'react';
import { Card, Badge, EmptyState } from '@/components/common';
import { candidatureService } from '@/api/services';
import { FileText } from 'lucide-react';

export const MesCandidaturesList = ({ candidatures, loading }) => {
    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (candidatures.length === 0) return <EmptyState icon={FileText} title="Aucune candidature" description="Vous n'avez pas encore postulé à une offre." />;

    return (
        <div className="space-y-4">
            {candidatures.map(candidature => {
                const formatted = candidatureService.formatCandidature(candidature);
                return (
                    <Card key={candidature.id}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{candidature.offre?.titre}</h3>
                                <p className="text-sm text-gray-600 mb-2">{candidature.offre?.departement?.nom}</p>
                                <Badge variant={candidature.statut === 'accepte' ? 'success' : candidature.statut === 'refuse' ? 'danger' : 'warning'}>
                                    {formatted.statut_badge.label}
                                </Badge>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                {formatted.date_candidature_formatted}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};