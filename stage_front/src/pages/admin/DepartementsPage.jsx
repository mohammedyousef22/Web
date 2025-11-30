// src/pages/admin/DepartementsPage.jsx
import React, { useState, useEffect } from 'react';
import { departementService } from '@/api/services';
import { Button, ConfirmDialog, Modal, Input, Toast } from '@/components/common';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const DepartementsPage = () => {
    const [departements, setDepartements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [formData, setFormData] = useState({ nom: '', description: '' });

    useEffect(() => {
        loadDepartements();
    }, []);

    const loadDepartements = async () => {
        setLoading(true);
        try {
            const response = await departementService.getAllDepartements();
            setDepartements(response.departements || []);
        } catch (error) {
            Toast.error('Erreur lors du chargement des départements');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dept = null) => {
        setSelectedDept(dept);
        setFormData(dept ? { nom: dept.nom, description: dept.description || '' } : { nom: '', description: '' });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (selectedDept) {
                await departementService.updateDepartement(selectedDept.id, formData);
                Toast.success('Département modifié avec succès');
            } else {
                await departementService.createDepartement(formData);
                Toast.success('Département créé avec succès');
            }
            setModalOpen(false);
            loadDepartements();
        } catch (error) {
            Toast.error(error.message || 'Une erreur est survenue');
        }
    };

    const handleDelete = async () => {
        try {
            await departementService.deleteDepartement(selectedDept.id);
            Toast.success('Département supprimé avec succès');
            setDeleteDialogOpen(false);
            loadDepartements();
        } catch (error) {
            Toast.error(error.message || 'Impossible de supprimer ce département');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
                <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
                    Nouveau Département
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departements.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{dept.nom}</h3>
                                    <p className="text-sm text-gray-500">{dept.offres_count || 0} offres</p>
                                </div>
                            </div>
                        </div>
                        {dept.description && (
                            <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                        )}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Edit}
                                onClick={() => handleOpenModal(dept)}
                                fullWidth
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                icon={Trash2}
                                onClick={() => {
                                    setSelectedDept(dept);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Créer/Modifier */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedDept ? 'Modifier le département' : 'Nouveau département'}
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {selectedDept ? 'Modifier' : 'Créer'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Nom du département"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                    />
                    <Input
                        label="Description (optionnel)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </Modal>

            {/* Dialog Suppression */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Supprimer le département"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedDept?.nom}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default DepartementsPage;
