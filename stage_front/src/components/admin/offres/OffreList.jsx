// src/components/admin/offres/OffreList.jsx
import React from 'react';
import OffreCard from './OffreCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { Briefcase } from 'lucide-react';

/**
 * Liste des offres de stage
 */
const OffreList = ({ offres, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Chargement des offres..." />
      </div>
    );
  }

  if (offres.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucune offre"
        description="Aucune offre de stage ne correspond à vos critères de recherche."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offres.map((offre) => (
        <OffreCard
          key={offre.id}
          offre={offre}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default OffreList;