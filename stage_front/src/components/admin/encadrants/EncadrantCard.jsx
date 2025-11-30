// src/components/admin/encadrants/EncadrantCard.jsx
import React from 'react';
import { Mail, Phone, Building, Users, Edit, Trash2 } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';

export const EncadrantCard = ({ encadrant, onEdit, onDelete }) => (
    <Card hover>
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{encadrant.user?.name}</h3>
                    <p className="text-sm text-gray-600">{encadrant.specialite}</p>
                </div>
            </div>
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{encadrant.user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span>{encadrant.departement?.nom}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{encadrant.stagiaires_count || 0} stagiaire(s)</span>
            </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
            <Button variant="ghost" size="sm" icon={Edit} onClick={() => onEdit(encadrant)} fullWidth>
                Modifier
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(encadrant)} className="text-red-600">
                Supprimer
            </Button>
        </div>
    </Card>
);
