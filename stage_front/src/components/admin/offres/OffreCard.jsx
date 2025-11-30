// src/components/admin/offres/OffreCard.jsx
import React from 'react';
import { Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';
import { offreService } from '@/api/services';

/**
 * Card d'affichage d'une offre de stage
 */
const OffreCard = ({ offre, onEdit, onDelete, onView }) => {
    const formatted = offreService.formatOffre(offre);

    return (
        <Card hover className="h-full">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{offre.titre}</h3>
                        <Badge variant={offre.statut === 'ouvert' ? 'success' : 'danger'}>
                            {formatted.statut_label}
                        </Badge>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {offre.description}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{offre.departement?.nom || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {formatted.date_debut_formatted} - {formatted.date_fin_formatted}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                            {offre.nombre_places} place{offre.nombre_places > 1 ? 's' : ''} • {formatted.duree_formatted}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(offre)}>
                        Voir
                    </Button>
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => onEdit(offre)}>
                        Modifier
                    </Button>
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(offre)} className="text-red-600 hover:bg-red-50">
                        Supprimer
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default OffreCard;