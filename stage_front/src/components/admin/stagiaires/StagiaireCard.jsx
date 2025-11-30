// src/components/admin/stagiaires/StagiaireCard.jsx
import React from 'react';
import { Mail, Building, GraduationCap, Eye } from 'lucide-react';
import { Card, Badge, Button } from '@/components/common';

export const StagiaireCard = ({ stagiaire, onView }) => (
    <Card hover>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{stagiaire.user?.name}</h3>
                <Badge variant={stagiaire.stage_actif ? 'success' : 'default'}>
                    {stagiaire.stage_actif ? 'En stage' : 'Disponible'}
                </Badge>
            </div>
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{stagiaire.user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span>{stagiaire.etablissement}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span>{stagiaire.niveau_etude} - {stagiaire.filiere}</span>
            </div>
        </div>

        <Button variant="outline" size="sm" icon={Eye} onClick={() => onView(stagiaire)} fullWidth>
            Voir détails
        </Button>
    </Card>
);
