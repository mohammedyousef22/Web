// src/pages/stagiaire/MesCandidaturesPage.jsx
import React, { useState, useEffect } from 'react';
import { candidatureService } from '@/api/services';
import { Card, Badge, Button, Toast, EmptyState } from '@/components/common';
import { FileText, Calendar, Building, MapPin, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const MesCandidaturesPage = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, en_attente, acceptee, refusee

    useEffect(() => {
        loadCandidatures();
    }, []);

    const loadCandidatures = async () => {
        setLoading(true);
        try {
            const response = await candidatureService.getMesCandidatures();
            const candidatures = response.candidatures || [];
            setCandidatures(candidatures);
        } catch (error) {
            Toast.error('Erreur lors du chargement des candidatures');
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidatures = candidatures.filter(cand => {
        if (filter === 'all') return true;
        return cand.statut === filter;
    });

    const getStatusConfig = (statut) => {
        const configs = {
            en_attente: {
                badge: { variant: 'warning', label: 'En attente' },
                icon: Clock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
            },
            accepte: {
                badge: { variant: 'success', label: 'Acceptée' },
                icon: CheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-50'
            },
            refuse: {
                badge: { variant: 'danger', label: 'Refusée' },
                icon: XCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-50'
            }
        };
        return configs[statut] || configs.en_attente;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const stats = {
        total: candidatures.length,
        en_attente: candidatures.filter(c => c.statut === 'en_attente').length,
        acceptee: candidatures.filter(c => c.statut === 'accepte').length,
        refusee: candidatures.filter(c => c.statut === 'refuse').length,
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mes Candidatures</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="normal" hover onClick={() => setFilter('all')} className={filter === 'all' ? 'ring-2 ring-blue-500' : ''}>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                    </div>
                </Card>
                <Card padding="normal" hover onClick={() => setFilter('en_attente')} className={filter === 'en_attente' ? 'ring-2 ring-yellow-500' : ''}>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.en_attente}</p>
                        <p className="text-sm text-gray-600">En attente</p>
                    </div>
                </Card>
                <Card padding="normal" hover onClick={() => setFilter('accepte')} className={filter === 'accepte' ? 'ring-2 ring-green-500' : ''}>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.acceptee}</p>
                        <p className="text-sm text-gray-600">Acceptées</p>
                    </div>
                </Card>
                <Card padding="normal" hover onClick={() => setFilter('refuse')} className={filter === 'refuse' ? 'ring-2 ring-red-500' : ''}>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.refusee}</p>
                        <p className="text-sm text-gray-600">Refusées</p>
                    </div>
                </Card>
            </div>

            {/* Liste des candidatures */}
            {filteredCandidatures.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucune candidature"
                    description={filter === 'all' ? "Vous n'avez pas encore postulé à une offre" : `Aucune candidature ${filter}`}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCandidatures.map((candidature) => {
                        const config = getStatusConfig(candidature.statut);
                        const StatusIcon = config.icon;

                        return (
                            <Card key={candidature.id} padding="normal" className={config.bgColor}>
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {candidature.offre?.titre}
                                            </h3>
                                            <Badge variant={config.badge.variant}>{config.badge.label}</Badge>
                                        </div>
                                        <StatusIcon className={`w-6 h-6 ${config.color}`} />
                                    </div>

                                    {/* Détails */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{candidature.offre?.departement?.nom}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Postulé le {formatDate(candidature.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Motivation */}
                                    {candidature.lettre_motivation && (
                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {candidature.lettre_motivation}
                                            </p>
                                        </div>
                                    )}

                                    {/* Commentaire admin */}
                                    {candidature.commentaire_admin && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-900 mb-1">Commentaire:</p>
                                            <p className="text-sm text-gray-700">{candidature.commentaire_admin}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MesCandidaturesPage;
