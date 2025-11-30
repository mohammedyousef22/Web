// src/components/stagiaire/candidatures/CandidatureTimeline.jsx
import React from 'react';
import { Clock, Send, CheckCircle, XCircle } from 'lucide-react';

export const CandidatureTimeline = ({ candidature }) => {
    const steps = [
        {
            label: 'Candidature envoyée',
            date: new Date(candidature.date_candidature).toLocaleDateString('fr-FR'),
            completed: true,
            icon: Send,
        },
        {
            label: 'En cours de traitement',
            date: candidature.statut === 'en_attente' ? 'En attente...' : 'Traité',
            completed: candidature.statut !== 'en_attente',
            icon: Clock,
            active: candidature.statut === 'en_attente',
        },
        {
            label: candidature.statut === 'accepte' ? 'Candidature acceptée' : candidature.statut === 'refuse' ? 'Candidature refusée' : 'Décision finale',
            date: candidature.date_reponse ? new Date(candidature.date_reponse).toLocaleDateString('fr-FR') : '-',
            completed: candidature.statut !== 'en_attente',
            icon: candidature.statut === 'accepte' ? CheckCircle : candidature.statut === 'refuse' ? XCircle : CheckCircle,
            success: candidature.statut === 'accepte',
            error: candidature.statut === 'refuse',
        },
    ];

    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? step.success ? 'bg-green-100' : step.error ? 'bg-red-100' : 'bg-blue-100' :
                                step.active ? 'bg-yellow-100' : 'bg-gray-100'
                            }`}>
                            <step.icon className={`w-5 h-5 ${step.completed ? step.success ? 'text-green-600' : step.error ? 'text-red-600' : 'text-blue-600' :
                                    step.active ? 'text-yellow-600' : 'text-gray-400'
                                }`} />
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.label}
                        </p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};