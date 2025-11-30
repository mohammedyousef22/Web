// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

/**
 * Layout pour les pages d'authentification (Login, Register, etc.)
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">Gestion Stages</span>
          </Link>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Gérez vos stages en toute simplicité
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Plateforme complète pour la gestion des offres de stage, candidatures, 
            suivi et évaluation des stagiaires.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center">
                ✓
              </div>
              <span>Gestion centralisée des candidatures</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center">
                ✓
              </div>
              <span>Suivi en temps réel des stages</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg flex items-center justify-center">
                ✓
              </div>
              <span>Évaluation et génération d'attestations</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-200 text-sm">
          © 2025 Gestion Stages. Tous droits réservés.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Gestion Stages</span>
          </Link>

          {/* Form Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;