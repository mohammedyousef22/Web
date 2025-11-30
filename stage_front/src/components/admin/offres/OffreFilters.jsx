// src/components/admin/offres/OffreFilters.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input, Select, Button } from '@/components/common';
import { departementService } from '@/api/services';

/**
 * Filtres pour la liste des offres
 */
const OffreFilters = ({ onFilterChange, onReset }) => {
    const [filters, setFilters] = useState({
        search: '',
        departement_id: '',
        statut: '',
    });
    const [departements, setDepartements] = useState([]);

    useEffect(() => {
        loadDepartements();
    }, []);

    const loadDepartements = async () => {
        try {
            const response = await departementService.getAllDepartements();
            const options = response.departements.map((d) => ({
                value: d.id,
                label: d.nom,
            }));
            setDepartements(options);
        } catch (error) {
            console.error('Error loading departements:', error);
        }
    };

    const handleChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters = {
            search: '',
            departement_id: '',
            statut: '',
        };
        setFilters(emptyFilters);
        onReset();
    };

    const hasActiveFilters = filters.search || filters.departement_id || filters.statut;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtres</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <Input
                    placeholder="Rechercher une offre..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    icon={Search}
                />

                {/* Département */}
                <Select
                    placeholder="Tous les départements"
                    value={filters.departement_id}
                    onChange={(e) => handleChange('departement_id', e.target.value)}
                    options={departements}
                />

                {/* Statut */}
                <Select
                    placeholder="Tous les statuts"
                    value={filters.statut}
                    onChange={(e) => handleChange('statut', e.target.value)}
                    options={[
                        { value: 'ouvert', label: 'Ouvert' },
                        { value: 'ferme', label: 'Fermé' },
                    ]}
                />
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" icon={X} onClick={handleReset}>
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OffreFilters;