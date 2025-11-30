// src/pages/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page non trouvée</h2>
        <p className="text-gray-600 mt-2 mb-8">La page que vous cherchez n'existe pas.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>Retour</Button>
          <Button variant="primary" icon={Home} onClick={() => navigate('/')}>Accueil</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;