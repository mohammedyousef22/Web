// src/components/stagiaire/rapports/MesRapportsList.jsx
import React from 'react';
import { Card, Badge, Button, EmptyState } from '@/components/common';
import { FileText, Download, Calendar } from 'lucide-react';
import { rapportService } from '@/api/services';

export const MesRapportsList = ({ rapports, loading }) => {
    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (rapports.length === 0) return <EmptyState icon={FileText} title="Aucun rapport" description="Vous n'avez pas encore déposé de rapport." />;

    return (
        <div className="space-y-4">
            {rapports.map(rapport => {
                const formatted = rapportService.formatRapport(rapport);
                return (
                    <Card key={rapport.id}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{rapport.titre}</h3>
                                <div className="flex gap-2 mb-2">
                                    <Badge variant={rapport.type === 'final' ? 'purple' : 'info'}>{formatted.type_badge.label}</Badge>
                                    <Badge variant={rapport.statut === 'valide' ? 'success' : rapport.statut === 'a_corriger' ? 'danger' : 'warning'}>
                                        {formatted.statut_badge.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatted.date_depot_formatted}</span>
                                    </div>
                                </div>
                                {rapport.commentaire_encadrant && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700"><strong>Commentaire :</strong> {rapport.commentaire_encadrant}</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" icon={Download} onClick={() => window.open(rapportService.getDownloadUrl(rapport.fichier_path), '_blank')}>
                                Télécharger
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};