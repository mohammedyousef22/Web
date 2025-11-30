// src/components/encadrant/rapports/RapportViewerModal.jsx
import React from 'react';
import { Modal, Badge, Button } from '@/components/common';
import { Download, Calendar, User, FileText } from 'lucide-react';

const RapportViewerModal = ({ isOpen, onClose, rapport }) => {
    if (!rapport) return null;

    const getStatusBadge = (statut) => {
        const statusMap = {
            en_attente: { label: 'En attente', variant: 'warning' },
            valide: { label: 'Validé', variant: 'success' },
            a_corriger: { label: 'À corriger', variant: 'danger' },
        };
        return statusMap[statut] || { label: statut, variant: 'default' };
    };

    const status = getStatusBadge(rapport.statut);

    const handleDownload = () => {
        if (rapport.fichier_url) {
            window.open(rapport.fichier_url, '_blank');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Détails du Rapport"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{rapport.titre}</h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                </div>

                {/* Info stagiaire */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-gray-600">Stagiaire</p>
                            <p className="font-medium text-gray-900">{rapport.stage?.stagiaire?.user?.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-gray-600">Date de soumission</p>
                            <p className="font-medium text-gray-900">
                                {rapport.created_at ? new Date(rapport.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {rapport.description && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{rapport.description}</p>
                    </div>
                )}

                {/* Commentaire encadrant */}
                {rapport.commentaire_encadrant && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Commentaire de l'encadrant</h4>
                        <p className="text-gray-700">{rapport.commentaire_encadrant}</p>
                    </div>
                )}

                {/* Corrections demandées */}
                {rapport.corrections_demandees && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Corrections demandées</h4>
                        <p className="text-gray-700">{rapport.corrections_demandees}</p>
                    </div>
                )}

                {/* Fichier */}
                {rapport.fichier_url && (
                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            variant="primary"
                            icon={Download}
                            onClick={handleDownload}
                            fullWidth
                        >
                            Télécharger le rapport
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default RapportViewerModal;
