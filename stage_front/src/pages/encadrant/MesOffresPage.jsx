// src/pages/encadrant/MesOffresPage.jsx
import React, { useState, useEffect } from 'react';
import { OffreList, OffreFilters, CreateOffreModal, EditOffreModal, OffreDetails } from '@/components/admin/offres';
import { offreService } from '@/api/services';
import { Button, ConfirmDialog } from '@/components/common';
import { Plus } from 'lucide-react';
import { Toast } from '@/components/common';

const MesOffresPage = () => {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOffre, setSelectedOffre] = useState(null);

    useEffect(() => {
        loadOffres();
    }, [filters]);

    const loadOffres = async () => {
        setLoading(true);
        try {
            const response = await offreService.getMesOffres(filters);
            setOffres(response.offres || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await offreService.deleteOffre(selectedOffre.id);
            Toast.success('Offre supprimée');
            loadOffres();
            setDeleteDialogOpen(false);
        } catch (error) {
            Toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Mes Offres de Stage</h1>
                <Button variant="primary" icon={Plus} onClick={() => setCreateModalOpen(true)}>
                    Nouvelle Offre
                </Button>
            </div>

            <OffreFilters onFilterChange={setFilters} onReset={() => setFilters({})} />

            <OffreList
                offres={offres}
                loading={loading}
                onEdit={(offre) => { setSelectedOffre(offre); setEditModalOpen(true); }}
                onDelete={(offre) => { setSelectedOffre(offre); setDeleteDialogOpen(true); }}
                onView={(offre) => { setSelectedOffre(offre); setDetailsModalOpen(true); }}
            />

            <CreateOffreModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={loadOffres} />
            <EditOffreModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} offre={selectedOffre} onSuccess={loadOffres} />
            <OffreDetails isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} offre={selectedOffre} />
            <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Supprimer l'offre" message="Êtes-vous sûr de vouloir supprimer cette offre ?" type="danger" />
        </div>
    );
};

export default MesOffresPage;
