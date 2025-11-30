// src/pages/stagiaire/MesRapportsPage.jsx
import React, { useState, useEffect } from 'react';
import { rapportService } from '@/api/services';
import { Card, Badge, Button, Modal, Input, Textarea, Toast, EmptyState, Select } from '@/components/common';
import { FileText, Calendar, Upload, Plus, Download, Eye, Edit } from 'lucide-react';

const MesRapportsPage = () => {
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRapport, setSelectedRapport] = useState(null);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        type: 'intermediaire',
        fichier: null
    });

    useEffect(() => {
        loadRapports();
    }, []);

    const loadRapports = async () => {
        setLoading(true);
        try {
            const response = await rapportService.getMesRapports();
            setRapports(response.rapports || []);
        } catch (error) {
            Toast.error('Erreur lors du chargement des rapports');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (rapport = null) => {
        setSelectedRapport(rapport);
        setFormData(rapport ? {
            titre: rapport.titre,
            description: rapport.description || '',
            type: rapport.type || 'intermediaire',
            fichier: null
        } : {
            titre: '',
            description: '',
            type: 'intermediaire',
            fichier: null
        });
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fichier: file });
        }
    };

    const handleSubmit = async () => {
        try {
            const submitData = new FormData();
            submitData.append('titre', formData.titre);
            submitData.append('description', formData.description);
            submitData.append('type', formData.type);
            if (formData.fichier) {
                submitData.append('fichier', formData.fichier);
            }

            if (selectedRapport) {
                await rapportService.updateRapport(selectedRapport.id, submitData);
                Toast.success('Rapport modifié avec succès');
            } else {
                await rapportService.createRapport(submitData);
                Toast.success('Rapport soumis avec succès');
            }
            setModalOpen(false);
            loadRapports();
        } catch (error) {
            console.error('Erreur soumission:', error);
            Toast.error(error.response?.data?.message || error.message || 'Une erreur est survenue');
        }
    };

    const getStatusBadge = (statut) => {
        const statusMap = {
            en_attente: { label: 'En attente', variant: 'warning' },
            valide: { label: 'Validé', variant: 'success' },
            a_corriger: { label: 'À corriger', variant: 'danger' },
        };
        return statusMap[statut] || { label: statut, variant: 'default' };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Mes Rapports</h1>
                <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
                    Soumettre un Rapport
                </Button>
            </div>

            {rapports.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucun rapport"
                    description="Vous n'avez pas encore soumis de rapport"
                    action={
                        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
                            Soumettre mon premier rapport
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rapports.map((rapport) => {
                        const status = getStatusBadge(rapport.statut);

                        return (
                            <Card key={rapport.id} padding="normal">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{rapport.titre}</h3>
                                            <Badge variant={status.variant}>{status.label}</Badge>
                                        </div>
                                        <FileText className="w-6 h-6 text-gray-400" />
                                    </div>

                                    {/* Description */}
                                    {rapport.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {rapport.description}
                                        </p>
                                    )}

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(rapport.created_at)}</span>
                                    </div>

                                    {/* Commentaires */}
                                    {rapport.commentaire_encadrant && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-xs font-medium text-gray-700 mb-1">Commentaire encadrant:</p>
                                            <p className="text-sm text-gray-600">{rapport.commentaire_encadrant}</p>
                                        </div>
                                    )}

                                    {rapport.corrections_demandees && (
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <p className="text-xs font-medium text-gray-700 mb-1">Corrections demandées:</p>
                                            <p className="text-sm text-gray-600">{rapport.corrections_demandees}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                                        {rapport.fichier_url && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={Download}
                                                onClick={() => window.open(rapport.fichier_url, '_blank')}
                                                fullWidth
                                            >
                                                Télécharger
                                            </Button>
                                        )}
                                        {rapport.statut === 'a_corriger' && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                icon={Edit}
                                                onClick={() => handleOpenModal(rapport)}
                                                fullWidth
                                            >
                                                Corriger
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Modal Créer/Modifier */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedRapport ? 'Modifier le rapport' : 'Soumettre un rapport'}
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {selectedRapport ? 'Modifier' : 'Soumettre'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Titre du rapport"
                        value={formData.titre}
                        onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                        required
                    />
                    <Select
                        label="Type de rapport"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            { value: 'intermediaire', label: 'Rapport Intermédiaire' },
                            { value: 'final', label: 'Rapport Final' }
                        ]}
                        required
                    />
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Décrivez le contenu de votre rapport..."
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fichier PDF <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>
                        {formData.fichier && (
                            <p className="mt-2 text-sm text-green-600">
                                Fichier sélectionné: {formData.fichier.name}
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MesRapportsPage;
