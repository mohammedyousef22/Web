// src/components/encadrant/rapports/RapportCard.jsx
import React from 'react';
import { Card, Badge, Button } from '@/components/common';
import { Calendar, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { rapportService } from '@/api/services';

export const RapportCard = ({ rapport, onView, onValider, onCorrections }) => {
    const formatted = rapportService.formatRapport(rapport);

    return (
        <Card hover>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{rapport.titre}</h3>
                    <div className="flex gap-2">
                        <Badge variant={rapport.type === 'final' ? 'purple' : 'info'}>{formatted.type_badge.label}</Badge>
                        <Badge variant={rapport.statut === 'valide' ? 'success' : rapport.statut === 'a_corriger' ? 'danger' : 'warning'}>
                            {formatted.statut_badge.label}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{rapport.stage?.stagiaire?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Déposé le {formatted.date_depot_formatted}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
                <Button variant="ghost" size="sm" icon={FileText} onClick={() => onView(rapport)} fullWidth>Voir</Button>
                {rapport.statut === 'en_attente' && (
                    <>
                        <Button variant="success" size="sm" icon={CheckCircle} onClick={() => onValider(rapport)}>Valider</Button>
                        <Button variant="warning" size="sm" icon={AlertCircle} onClick={() => onCorrections(rapport)}>Corrections</Button>
                    </>
                )}
            </div>
        </Card>
    );
};