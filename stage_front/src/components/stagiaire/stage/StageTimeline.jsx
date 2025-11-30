// src/components/stagiaire/stage/StageTimeline.jsx
import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const StageTimeline = ({ stage }) => {
  const events = [
    { label: 'Début du stage', date: stage.date_debut_reelle, icon: Calendar, completed: true },
    { label: 'Mi-parcours', date: new Date((new Date(stage.date_debut_reelle).getTime() + new Date(stage.date_fin_reelle).getTime()) / 2).toISOString(), icon: Clock, completed: new Date() > new Date((new Date(stage.date_debut_reelle).getTime() + new Date(stage.date_fin_reelle).getTime()) / 2) },
    { label: 'Fin du stage', date: stage.date_fin_reelle, icon: CheckCircle, completed: new Date() >= new Date(stage.date_fin_reelle) },
  ];

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
              <event.icon className={`w-5 h-5 ${event.completed ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            {i < events.length - 1 && <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </div>
          <div className="flex-1 pb-4">
            <p className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>{event.label}</p>
            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};