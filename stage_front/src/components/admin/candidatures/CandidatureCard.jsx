// src/components/admin/candidatures/CandidatureCard.jsx
import React from 'react';
import { Calendar, User, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';
import { candidatureService } from '@/api/services';

/**
 * Card d'affichage d'une candidature
 */
const CandidatureCard = ({ candidature, onAccept, onReject, onView }) => {
    const formatted = candidatureService.formatCandidature(candidature);

    return (
        <Card hover className="h-full">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {candidature.stagiaire?.user?.name || 'Stagiaire'}
                        </h3>
                        <Badge
                            variant={
                                candidature.statut === 'accepte' ? 'success' :
                                    candidature.statut === 'refuse' ? 'danger' : 'warning'
                            }
                        >
                            {formatted.statut_badge.label}
                        </Badge>
                    </div>
                </div>

                {/* Offre Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{candidature.offre?.titre}</p>
                    <p className="text-xs text-gray-500 mt-1">{candidature.offre?.departement?.nom}</p>
                </div>

                {/* Stagiaire Info */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{candidature.stagiaire?.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{candidature.stagiaire?.etablissement}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Postulé le {formatted.date_candidature_formatted}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" onClick={() => onView(candidature)} fullWidth>
                        Détails
                    </Button>

                    {candidature.statut === 'en_attente' && (
                        <>
                            <Button
                                variant="success"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => onAccept(candidature)}
                            >
                                Accepter
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                icon={XCircle}
                                onClick={() => onReject(candidature)}
                            >
                                Refuser
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default CandidatureCard;