// src/components/encadrant/evaluations/CompetencesChecklist.jsx
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const CompetencesChecklist = ({ selectedCompetences = [], onChange }) => {
    const competencesList = [
        { id: 'analyse', label: "Capacité d'analyse" },
        { id: 'equipe', label: "Esprit d'équipe" },
        { id: 'communication', label: 'Communication' },
        { id: 'autonomie', label: 'Autonomie' },
        { id: 'rigueur', label: 'Rigueur' },
        { id: 'creativite', label: 'Créativité' },
        { id: 'adaptabilite', label: 'Adaptabilité' },
        { id: 'gestion_temps', label: 'Gestion du temps' },
        { id: 'resolution_problemes', label: 'Résolution de problèmes' },
        { id: 'initiative', label: 'Initiative' },
        { id: 'organisation', label: 'Organisation' },
        { id: 'leadership', label: 'Leadership' },
        { id: 'techniques', label: 'Techniques métier' },
        { id: 'outils', label: 'Maîtrise des outils' },
        { id: 'delais', label: 'Respect des délais' },
    ];

    const toggleCompetence = (competenceId) => {
        const newSelection = selectedCompetences.includes(competenceId)
            ? selectedCompetences.filter(id => id !== competenceId)
            : [...selectedCompetences, competenceId];

        onChange(newSelection);
    };

    const isSelected = (competenceId) => selectedCompetences.includes(competenceId);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Compétences acquises <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competencesList.map((competence) => (
                    <div
                        key={competence.id}
                        onClick={() => toggleCompetence(competence.id)}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${isSelected(competence.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                        `}
                    >
                        {isSelected(competence.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${isSelected(competence.id) ? 'text-green-700' : 'text-gray-700'
                            }`}>
                            {competence.label}
                        </span>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
                Sélectionnez les compétences acquises par le stagiaire durant son stage
            </p>
        </div>
    );
};

export default CompetencesChecklist;
