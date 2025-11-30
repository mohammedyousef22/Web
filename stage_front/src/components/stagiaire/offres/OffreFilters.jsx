// src/components/stagiaire/offres/OffreFilters.jsx
import React, { useState } from 'react';
import { Input, Select } from '@/components/common';

export const OffreFiltersStagiaire = ({ onFilterChange, onReset, departements }) => {
    const [filters, setFilters] = useState({
        search: '',
        departement_id: '',
        duree_min: '',
        duree_max: '',
    });

    const handleChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters = {
            search: '',
            departement_id: '',
            duree_min: '',
            duree_max: '',
        };
        setFilters(emptyFilters);
        if (onReset) onReset();
    };

    const hasActiveFilters = filters.search || filters.departement_id || filters.duree_min || filters.duree_max;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={e => handleChange('search', e.target.value)}
                />
                <Select
                    placeholder="Tous les départements"
                    value={filters.departement_id}
                    onChange={e => handleChange('departement_id', e.target.value)}
                    options={departements || []}
                />
                <Input
                    type="number"
                    placeholder="Durée min (jours)"
                    value={filters.duree_min}
                    onChange={e => handleChange('duree_min', e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Durée max (jours)"
                    value={filters.duree_max}
                    onChange={e => handleChange('duree_max', e.target.value)}
                />
            </div>
            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleReset}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};