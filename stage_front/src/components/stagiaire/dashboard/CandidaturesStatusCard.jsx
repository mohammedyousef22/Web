// src/components/stagiaire/dashboard/CandidaturesStatusCard.jsx
import React from 'react';
import { Card, Badge } from '@/components/common';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const CandidaturesStatusCard = ({ candidatures = [] }) => {
    const stats = {
        total: candidatures.length,
        en_attente: candidatures.filter(c => c.statut === 'en_attente').length,
        acceptee: candidatures.filter(c => c.statut === 'accepte').length,
        refusee: candidatures.filter(c => c.statut === 'refuse').length,
    };

    const statusItems = [
        { label: 'En attente', count: stats.en_attente, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { label: 'Acceptées', count: stats.acceptee, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
        { label: 'Refusées', count: stats.refusee, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    ];

    return (
        <Card title="Mes Candidatures" icon={FileText} padding="normal">
            <div className="space-y-4">
                <div className="text-center pb-4 border-b border-gray-200">
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-600">Candidatures totales</p>
                </div>

                <div className="space-y-3">
                    {statusItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <span className="font-medium text-gray-900">{item.label}</span>
                            </div>
                            <Badge variant={item.count > 0 ? 'primary' : 'default'}>{item.count}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default CandidaturesStatusCard;
