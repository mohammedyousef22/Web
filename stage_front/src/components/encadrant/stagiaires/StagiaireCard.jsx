// src/components/encadrant/stagiaires/StagiaireCard.jsx (Version Encadrant)
import React from 'react';
import { Card, Badge, Button } from '@/components/common';
import { Mail, Briefcase, Calendar, Eye } from 'lucide-react';
import { stageService } from '@/api/services';

export const StagiaireCardEncadrant = ({ stagiaire, onView }) => {
    const stage = stagiaire.stage;
    const progression = stage ? stageService.calculateProgress(stage) : 0;

    return (
        <Card hover>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">{stagiaire.user?.name?.charAt(0)}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{stagiaire.user?.name}</h3>
                    {stage && <Badge variant={stage.statut === 'en_cours' ? 'success' : 'default'}>{stage.statut === 'en_cours' ? 'En cours' : 'Terminé'}</Badge>}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{stagiaire.user?.email}</span>
                </div>
                {stage && stage.candidature?.offre && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="truncate">{stage.candidature.offre.titre}</span>
                    </div>
                )}
                {stage && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(stage.date_debut_reelle).toLocaleDateString('fr-FR')}</span>
                    </div>
                )}
            </div>

            {stage && stage.statut === 'en_cours' && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progression}%` }}></div>
                    </div>
                </div>
            )}

            <Button variant="outline" size="sm" icon={Eye} onClick={() => onView(stagiaire)} fullWidth>Voir détails</Button>
        </Card>
    );
};
