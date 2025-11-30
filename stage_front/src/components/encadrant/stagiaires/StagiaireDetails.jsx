// src/components/encadrant/stagiaires/StagiaireDetails.jsx (Version Encadrant)
import React from 'react';
import { Modal, Badge, Button } from '@/components/common';
import { Mail, Phone, Building, GraduationCap, Download } from 'lucide-react';
import { stagiaireService } from '@/api/services';

export const StagiaireDetailsEncadrant = ({ isOpen, onClose, stagiaire }) => {
    if (!stagiaire) return null;
    const formatted = stagiaireService.formatStagiaire(stagiaire);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails du stagiaire" size="lg">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{formatted.full_name}</h2>
                    {stagiaire.stage && <Badge variant="success">{stagiaire.stage.offre?.titre}</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900 text-sm">{formatted.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium text-gray-900">{stagiaire.telephone || 'Non renseigné'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Établissement</p>
                            <p className="font-medium text-gray-900 text-sm">{stagiaire.etablissement || 'Non renseigné'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Formation</p>
                            <p className="font-medium text-gray-900 text-sm">{stagiaire.niveau_etude || stagiaire.formation || 'Non renseigné'}</p>
                        </div>
                    </div>
                </div>

                {formatted.has_cv && (
                    <Button variant="primary" icon={Download} onClick={() => window.open(formatted.cv_url, '_blank')} fullWidth>Télécharger le CV</Button>
                )}
            </div>
        </Modal>
    );
};

export default StagiaireDetailsEncadrant;
