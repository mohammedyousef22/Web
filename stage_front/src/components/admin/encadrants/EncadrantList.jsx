// src/components/admin/encadrants/EncadrantList.jsx
import React from 'react';
import EncadrantCard from './EncadrantCard';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { UserCheck } from 'lucide-react';

export const EncadrantList = ({ encadrants, loading, onEdit, onDelete, onView }) => {
  if (loading) return <LoadingSpinner size="lg" text="Chargement..." />;
  if (encadrants.length === 0) return <EmptyState icon={UserCheck} title="Aucun encadrant" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {encadrants.map((encadrant) => (
        <EncadrantCard key={encadrant.id} encadrant={encadrant} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ))}
    </div>
  );
};