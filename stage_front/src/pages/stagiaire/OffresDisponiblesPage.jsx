// src/pages/stagiaire/OffresDisponiblesPage.jsx
import React, { useState, useEffect } from 'react';
import { OffreGrid, OffreFiltersStagiaire, OffreDetailsModal, PostulerModal } from '@/components/stagiaire/offres';
import { offreService, departementService } from '@/api/services';

const OffresDisponiblesPage = () => {
    const [offres, setOffres] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [postulerOpen, setPostulerOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadOffres();
    }, [filters]);

    const loadData = async () => {
        try {
            // Charger d'abord les offres pour extraire les départements
            const response = await offreService.getOffresDisponibles();
            const offres = response.offres || [];

            // Extraire les départements uniques depuis les offres
            const uniqueDepts = [...new Set(offres.map(o => o.departement?.nom).filter(Boolean))];
            const deptOptions = uniqueDepts.map(nom => ({
                value: nom,
                label: nom
            }));

            setDepartements(deptOptions);
            setOffres(offres);
            setLoading(false);
        } catch (error) {
            console.error('Erreur chargement données:', error);
            setLoading(false);
        }
    };

    const loadOffres = async () => {
        setLoading(true);
        try {
            const response = await offreService.getOffresDisponibles(filters);
            const offres = response.offres || [];
            setOffres(offres);

            // Mettre à jour les départements si filtre vide
            if (Object.keys(filters).length === 0 && departements.length === 0) {
                const uniqueDepts = [...new Set(offres.map(o => o.departement?.nom).filter(Boolean))];
                const deptOptions = uniqueDepts.map(nom => ({ value: nom, label: nom }));
                setDepartements(deptOptions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Offres Disponibles</h1>
            <OffreFiltersStagiaire onFilterChange={setFilters} onReset={() => setFilters({})} departements={departements} />
            <OffreGrid
                offres={offres}
                loading={loading}
                onViewDetails={o => { setSelectedOffre(o); setDetailsOpen(true); }}
                onPostuler={o => { setSelectedOffre(o); setPostulerOpen(true); }}
            />
            <OffreDetailsModal isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} offre={selectedOffre} onPostuler={o => { setDetailsOpen(false); setPostulerOpen(true); }} />
            <PostulerModal isOpen={postulerOpen} onClose={() => setPostulerOpen(false)} offre={selectedOffre} onSuccess={loadOffres} />
        </div>
    );
};

export default OffresDisponiblesPage;