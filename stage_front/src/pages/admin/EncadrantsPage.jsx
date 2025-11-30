// src/pages/admin/EncadrantsPage.jsx
import React, { useState, useEffect } from 'react';
import { encadrantService, departementService } from '@/api/services';
import { Button, ConfirmDialog, Modal, Input, Select, Toast, SearchBar } from '@/components/common';
import { Plus, Edit, Trash2, User, Mail, Phone, Download } from 'lucide-react';

const EncadrantsPage = () => {
    const [encadrants, setEncadrants] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEncadrant, setSelectedEncadrant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: '',
        specialite: '',
        departement_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [encadrantsRes, deptsRes] = await Promise.all([
                encadrantService.getAllEncadrants(),
                departementService.getAllDepartements()
            ]);
            setEncadrants(encadrantsRes.encadrants || []);
            setDepartements(deptsRes.departements || []);
        } catch (error) {
            Toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const filteredEncadrants = encadrants.filter(enc =>
        enc.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enc.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enc.specialite?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (encadrant = null) => {
        setSelectedEncadrant(encadrant);
        setFormData(encadrant ? {
            name: encadrant.user?.name || '',
            email: encadrant.user?.email || '',
            telephone: encadrant.telephone || '',
            specialite: encadrant.specialite || '',
            departement_id: encadrant.departement_id || ''
        } : {
            name: '',
            email: '',
            telephone: '',
            specialite: '',
            departement_id: ''
        });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (selectedEncadrant) {
                await encadrantService.updateEncadrant(selectedEncadrant.id, formData);
                Toast.success('Encadrant modifié avec succès');
            } else {
                await encadrantService.createEncadrant(formData);
                Toast.success('Encadrant créé avec succès');
            }
            setModalOpen(false);
            loadData();
        } catch (error) {
            Toast.error(error.message || 'Une erreur est survenue');
        }
    };

    const handleDelete = async () => {
        try {
            await encadrantService.deleteEncadrant(selectedEncadrant.id);
            Toast.success('Encadrant supprimé avec succès');
            setDeleteDialogOpen(false);
            loadData();
        } catch (error) {
            Toast.error(error.message || 'Impossible de supprimer cet encadrant');
        }
    };

    const handleExport = async () => {
        try {
            await encadrantService.exportEncadrants();
            Toast.success('Export réussi');
        } catch (error) {
            Toast.error('Erreur lors de l\'export');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Encadrants</h1>
                <div className="flex gap-3">
                    <Button variant="outline" icon={Download} onClick={handleExport}>
                        Exporter
                    </Button>
                    <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
                        Nouvel Encadrant
                    </Button>
                </div>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un encadrant..."
            />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Encadrant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaires</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEncadrants.map((encadrant) => (
                            <tr key={encadrant.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{encadrant.user?.name}</p>
                                            <p className="text-sm text-gray-500">{encadrant.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        {encadrant.telephone || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{encadrant.specialite}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{encadrant.departement?.nom || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{encadrant.stagiaires_count || 0}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" icon={Edit} onClick={() => handleOpenModal(encadrant)}>
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => {
                                                setSelectedEncadrant(encadrant);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Créer/Modifier */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedEncadrant ? 'Modifier l\'encadrant' : 'Nouvel encadrant'}
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {selectedEncadrant ? 'Modifier' : 'Créer'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nom complet"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Téléphone"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        />
                        <Input
                            label="Spécialité"
                            value={formData.specialite}
                            onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                            required
                        />
                    </div>
                    <Select
                        label="Département"
                        value={formData.departement_id}
                        onChange={(e) => setFormData({ ...formData, departement_id: e.target.value })}
                        options={[
                            { value: '', label: 'Sélectionner un département' },
                            ...departements.map(d => ({ value: d.id, label: d.nom }))
                        ]}
                        required
                    />
                </div>
            </Modal>

            {/* Dialog Suppression */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Supprimer l'encadrant"
                message={`Êtes-vous sûr de vouloir supprimer "${selectedEncadrant?.user?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default EncadrantsPage;
