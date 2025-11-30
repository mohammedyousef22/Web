// src/components/stagiaire/offres/OffreDetailsModal.jsx
import React from 'react';
import { Modal, Badge, Button } from '@/components/common';
import { Calendar, MapPin, Clock, Users, FileText } from 'lucide-react';
import { offreService } from '@/api/services';

export const OffreDetailsModal = ({ isOpen, onClose, offre, onPostuler }) => {
    if (!offre) return null;
    const formatted = offreService.formatOffre(offre);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Détails de l'offre"
            size="lg"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Fermer</Button>
                    <Button variant="primary" onClick={() => { onPostuler(offre); onClose(); }}>
                        Postuler à cette offre
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{offre.titre}</h2>
                    <Badge variant="success">Ouvert aux candidatures</Badge>
                </div>

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
                            <p className="text-sm text-gray-600">Période</p>
                            <p className="font-medium text-gray-900 text-sm">{formatted.date_debut_formatted} - {formatted.date_fin_formatted}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Places</p>
                            <p className="font-medium text-gray-900">{offre.nombre_places} disponible(s)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{offre.description}</p>
                </div>

                {offre.competences_requises && (
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Compétences requises</h3>
                        <div className="flex flex-wrap gap-2">
                            {offre.competences_requises.split(',').map((comp, i) => (
                                <Badge key={i} variant="primary">{comp.trim()}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};