// src/components/stagiaire/dashboard/WelcomeCard.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Card de bienvenue pour le dashboard stagiaire
 */
const WelcomeCard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">{getGreeting()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
          <p className="text-green-100">
            Bienvenue sur votre espace de gestion de stage
          </p>
        </div>

        {/* Icon Decoration */}
        <div className="hidden md:block opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="2" />
            <circle cx="60" cy="60" r="30" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;