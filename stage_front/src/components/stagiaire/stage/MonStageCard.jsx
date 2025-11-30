// src/components/stagiaire/stage/MonStageCard.jsx
import React from 'react';
import { Card, Badge } from '@/components/common';
import { Calendar, Building, User } from 'lucide-react';
import { stageService } from '@/api/services';
import ProgressBar from './ProgressBar';

export const MonStageCard = ({ stage }) => {
    const formatted = stageService.formatStage(stage);

    return (
        <Card title="Mon Stage" padding="normal">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{stage.offre?.titre}</h3>
                        <p className="text-sm text-gray-600">{stage.offre?.departement?.nom}</p>
                    </div>
                    <Badge variant="primary">{formatted.statut_badge.label}</Badge>
                </div>

                <ProgressBar stage={stage} />

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-gray-600">Début</p>
                            <p className="font-medium">{formatted.date_debut_formatted}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-gray-600">Fin</p>
                            <p className="font-medium">{formatted.date_fin_formatted}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};