// src/components/admin/stagiaires/StagiaireDetails.jsx
import React from 'react';
import { Modal, Badge, Button } from '@/components/common';
import { Mail, Phone, Building, GraduationCap, Calendar, MapPin, Download, User } from 'lucide-react';
import { stagiaireService } from '@/api/services';

export const StagiaireDetails = ({ isOpen, onClose, stagiaire }) => {
    if (!stagiaire) return null;

    const formatted = stagiaireService.formatStagiaire(stagiaire);

    const handleDownloadCV = () => {
        if (formatted.cv_url) {
            window.open(formatted.cv_url, '_blank');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails du stagiaire" size="lg">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{formatted.full_name}</h2>
                        <div className="flex gap-2">
                            <Badge variant={stagiaire.stage_actif ? 'success' : 'default'}>
                                {stagiaire.stage_actif ? 'En stage' : 'Disponible'}
                            </Badge>
                            {formatted.has_cv && <Badge variant="info">CV disponible</Badge>}
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{formatted.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Téléphone</p>
                                <p className="font-medium text-gray-900">{stagiaire.telephone || 'Non renseigné'}</p>
                            </div>
                        </div>

                        {stagiaire.cin && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">CIN</p>
                                    <p className="font-medium text-gray-900">{stagiaire.cin}</p>
                                </div>
                            </div>
                        )}

                        {stagiaire.date_naissance && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Date de naissance</p>
                                    <p className="font-medium text-gray-900">
                                        {formatted.date_naissance_formatted} ({formatted.age} ans)
                                    </p>
                                </div>
                            </div>
                        )}

                        {stagiaire.adresse && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-2">
                                <MapPin className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Adresse</p>
                                    <p className="font-medium text-gray-900">{stagiaire.adresse}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Formation */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Formation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Building className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Établissement</p>
                                <p className="font-medium text-gray-900">{stagiaire.etablissement}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Niveau d'étude</p>
                                <p className="font-medium text-gray-900">{stagiaire.niveau_etude}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-2">
                            <GraduationCap className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Filière</p>
                                <p className="font-medium text-gray-900">{stagiaire.filiere}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CV */}
                {formatted.has_cv && (
                    <div>
                        <Button variant="primary" icon={Download} onClick={handleDownloadCV} fullWidth>
                            Télécharger le CV
                        </Button>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                    Inscrit le {formatted.created_at_formatted}
                </div>
            </div>
        </Modal>
    );
};