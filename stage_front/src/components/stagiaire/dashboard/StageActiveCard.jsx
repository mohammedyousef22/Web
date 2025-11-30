// src/components/stagiaire/dashboard/StageActiveCard.jsx
import React from 'react';
import { Card, Badge, Button } from '@/components/common';
import { Calendar, Building, User, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StageActiveCard = ({ stage }) => {
    const navigate = useNavigate();

    if (!stage) {
        return (
            <Card title="Mon Stage" padding="normal">
                <div className="text-center py-8">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Vous n'avez pas de stage en cours</p>
                    <p className="text-sm text-gray-500">Consultez les offres disponibles pour postuler</p>
                    <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => navigate('/stagiaire/offres')}
                    >
                        Voir les offres
                    </Button>
                </div>
            </Card>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateProgress = () => {
        const start = new Date(stage.date_debut_reelle);
        const end = new Date(stage.date_fin_reelle);
        const now = new Date();

        if (now < start) return 0;
        if (now > end) return 100;

        const total = end - start;
        const elapsed = now - start;
        return Math.round((elapsed / total) * 100);
    };

    const progress = calculateProgress();

    return (
        <Card title="Mon Stage Actif" padding="normal">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{stage.offre?.titre}</h3>
                    <Badge variant="success">En cours</Badge>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{stage.offre?.departement?.nom}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Encadrant: {stage.encadrant?.user?.name || 'Non assigné'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(stage.date_debut_reelle)} - {formatDate(stage.date_fin_reelle)}</span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <Button
                    variant="outline"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/stagiaire/mon-stage')}
                    fullWidth
                >
                    Voir les détails
                </Button>
            </div>
        </Card>
    );
};

export default StageActiveCard;
