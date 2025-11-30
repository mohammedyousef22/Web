import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/common';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShieldAlert className="w-24 h-24 text-red-600 mx-auto mb-4" />
        <h1 className="text-9xl font-bold text-red-600">403</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Accès refusé</h2>
        <p className="text-gray-600 mt-2 mb-8">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;