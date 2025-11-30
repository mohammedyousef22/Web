// src/components/stagiaire/offres/OffreCard.jsx (Version Stagiaire)
import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';
import { offreService } from '@/api/services';

export const OffreCardStagiaire = ({ offre, onPostuler, onViewDetails }) => {
    const formatted = offreService.formatOffre(offre);
    const placesRestantes = offreService.getPlacesRestantes(offre);

    return (
        <Card hover className="h-full">
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offre.titre}</h3>
                    <Badge variant="success">Ouvert</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{offre.description}</p>

                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{offre.departement?.nom}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatted.duree_formatted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatted.date_debut_formatted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{placesRestantes} place(s) restante(s)</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(offre)} fullWidth>Détails</Button>
                    <Button variant="primary" size="sm" onClick={() => onPostuler(offre)} fullWidth>Postuler</Button>
                </div>
            </div>
        </Card>
    );
};
