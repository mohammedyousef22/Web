// src/components/admin/offres/OffreDetails.jsx
import React from 'react';
import { Calendar, MapPin, Clock, Users, FileText } from 'lucide-react';
import { Modal, Badge } from '@/components/common';
import { offreService } from '@/api/services';

/**
 * Modal détails d'une offre
 */
const OffreDetails = ({ isOpen, onClose, offre }) => {
    if (!offre) return null;

    const formatted = offreService.formatOffre(offre);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'offre" size="lg">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{offre.titre}</h2>
                        <Badge variant={offre.statut === 'ouvert' ? 'success' : 'danger'}>
                            {formatted.statut_label}
                        </Badge>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Département</p>
                            <p className="font-medium text-gray-900">{offre.departement?.nom}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Durée</p>
                            <p className="font-medium text-gray-900">{formatted.duree_formatted}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Date début</p>
                            <p className="font-medium text-gray-900">{formatted.date_debut_formatted}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Date fin</p>
                            <p className="font-medium text-gray-900">{formatted.date_fin_formatted}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="text-sm text-gray-600">Nombre de places</p>
                            <p className="font-medium text-gray-900">{offre.nombre_places}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-yellow-600" />
                        <div>
                            <p className="text-sm text-gray-600">Candidatures</p>
                            <p className="font-medium text-gray-900">{offre.candidatures_count || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{offre.description}</p>
                </div>

                {/* Compétences */}
                {offre.competences_requises && (
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Compétences requises</h3>
                        <div className="flex flex-wrap gap-2">
                            {offre.competences_requises.split(',').map((comp, index) => (
                                <Badge key={index} variant="primary">
                                    {comp.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Créé par */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                    Créé par {offre.created_by_user?.name || 'Admin'} le{' '}
                    {new Date(offre.created_at).toLocaleDateString('fr-FR')}
                </div>
            </div>
        </Modal>
    );
};

export default OffreDetails;