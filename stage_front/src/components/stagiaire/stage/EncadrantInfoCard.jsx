// src/components/stagiaire/stage/EncadrantInfoCard.jsx
import React from 'react';
import { Card } from '@/components/common';
import { User } from 'lucide-react';

export const EncadrantInfoCard = ({ encadrant }) => {
    return (
        <Card title="Mon Encadrant" padding="normal">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{encadrant.user?.name}</h3>
                    <p className="text-sm text-gray-600">{encadrant.specialite}</p>
                    <p className="text-sm text-gray-600 mt-1">{encadrant.user?.email}</p>
                    {encadrant.telephone && <p className="text-sm text-gray-600">{encadrant.telephone}</p>}
                </div>
            </div>
        </Card>
    );
};