// src/components/encadrant/dashboard/StatsEncadrant.jsx
import React from 'react';
import { Card } from '@/components/common';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

const StatsEncadrant = ({ stats = {} }) => {
    const statsItems = [
        {
            label: 'Stagiaires',
            value: stats.total_stagiaires || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Rapports à valider',
            value: stats.rapports_en_attente || 0,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            label: 'Rapports validés',
            value: stats.rapports_valides || 0,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            label: 'Offres actives',
            value: stats.offres_actives || 0,
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsItems.map((item, index) => (
                <Card key={index} padding="normal" hover>
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default StatsEncadrant;
