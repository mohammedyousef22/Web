// src/components/admin/encadrants/EncadrantDetails.jsx
import React from 'react';
import { Modal, Badge } from '@/components/common';
import { Mail, Phone, Building, Users, Calendar } from 'lucide-react';

export const EncadrantDetails = ({ isOpen, onClose, encadrant }) => {
    if (!encadrant) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'encadrant" size="md">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{encadrant.user?.name}</h2>
                    <Badge variant="info">{encadrant.specialite}</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{encadrant.user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium text-gray-900">{encadrant.telephone || 'Non renseigné'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Département</p>
                            <p className="font-medium text-gray-900">{encadrant.departement?.nom}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Stagiaires actuels</p>
                            <p className="font-medium text-gray-900">{encadrant.stagiaires_count || 0}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="text-sm text-gray-600">Membre depuis</p>
                            <p className="font-medium text-gray-900">
                                {new Date(encadrant.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};