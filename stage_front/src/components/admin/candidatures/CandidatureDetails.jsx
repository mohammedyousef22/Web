// src/components/admin/candidatures/CandidatureDetails.jsx
import React from 'react';
import { User, Mail, Phone, Building, GraduationCap, Calendar, FileText, Download } from 'lucide-react';
import { Modal, Badge, Button } from '@/components/common';
import { candidatureService, stagiaireService } from '@/api/services';

const CandidatureDetails = ({ isOpen, onClose, candidature }) => {
    if (!candidature) return null;

    const formatted = candidatureService.formatCandidature(candidature);
    const stagiaire = candidature.stagiaire;

    const handleDownloadCV = () => {
        if (stagiaire?.cv_path) {
            const url = stagiaireService.getCVUrl(stagiaire.cv_path);
            window.open(url, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails de la candidature" size="lg">
            <div className="space-y-6">
                {/* Statut */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Candidature</h3>
                    <Badge
                        variant={
                            candidature.statut === 'accepte'
                                ? 'success'
                                : candidature.statut === 'refuse'
                                    ? 'danger'
                                    : 'warning'
                        }
                    >
                        {formatted.statut_badge.label}
                    </Badge>
                </div>

                {/* Info Stagiaire */}
                <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Nom complet</p>
                            <p className="font-medium text-gray-900">{stagiaire?.user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{stagiaire?.user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium text-gray-900">{stagiaire?.telephone || 'Non renseigné'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Établissement</p>
                            <p className="font-medium text-gray-900">{stagiaire?.etablissement}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Niveau / Filière</p>
                            <p className="font-medium text-gray-900">
                                {stagiaire?.niveau_etude} - {stagiaire?.filiere}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CV */}
                {stagiaire?.cv_path && (
                    <div>
                        <Button variant="outline" icon={Download} onClick={handleDownloadCV} fullWidth>
                            Télécharger le CV
                        </Button>
                    </div>
                )}

                {/* Info Offre */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Offre postulée</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 mb-1">{candidature.offre?.titre}</p>
                        <p className="text-sm text-gray-600">Département: {candidature.offre?.departement?.nom}</p>
                    </div>
                </div>

                {/* Lettre de motivation */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Lettre de motivation</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">{candidature.lettre_motivation}</p>
                    </div>
                </div>

                {/* Dates */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Postulé le: {formatted.date_candidature_formatted}</span>
                    </div>
                    {candidature.date_reponse && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Répondu le: {formatted.date_reponse_formatted}</span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CandidatureDetails;