// src/components/stagiaire/stage/ProgressBar.jsx
import React from 'react';
import { stageService } from '@/api/services';

/**
 * Barre de progression du stage avec jours restants
 */
const ProgressBar = ({ stage }) => {
    const progression = stageService.calculateProgress(stage);
    const joursRestants = stageService.getJoursRestants(stage);
    const joursEcoules = stageService.getJoursEcoules(stage);
    const dureeTotale = stageService.getDureeTotale(stage);

    const getColorClass = () => {
        if (progression >= 75) return 'bg-green-600';
        if (progression >= 50) return 'bg-blue-600';
        if (progression >= 25) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    return (
        <div className="space-y-3">
            {/* Progress Bar */}
            <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${getColorClass()}`}
                        style={{ width: `${progression}%` }}
                    />
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {progression}%
                </span>
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                    <span className="font-medium">{joursEcoules}</span> jours écoulés
                </div>
                <div className="text-gray-900 font-semibold">
                    {joursRestants > 0 ? (
                        <>
                            <span className={joursRestants <= 7 ? 'text-red-600' : 'text-green-600'}>
                                {joursRestants}
                            </span>{' '}
                            jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''}
                        </>
                    ) : (
                        <span className="text-green-600">Stage terminé</span>
                    )}
                </div>
                <div className="text-gray-600">
                    <span className="font-medium">{dureeTotale}</span> jours au total
                </div>
            </div>

            {/* Alert proche de la fin */}
            {joursRestants > 0 && joursRestants <= 7 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    ⚠️ Votre stage se termine bientôt ! Pensez à déposer votre rapport final.
                </div>
            )}
        </div>
    );
};

export default ProgressBar;