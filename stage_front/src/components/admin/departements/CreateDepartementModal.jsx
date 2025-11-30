// src/components/admin/departements/CreateDepartementModal.jsx
import React, { useState } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/common';
import { departementService } from '@/api/services';
import { Toast } from '@/components/common';

export const CreateDepartementModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        responsable: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nom || formData.nom.length < 3) {
            newErrors.nom = 'Nom requis (min 3 caractères)';
        }
        if (formData.description && formData.description.length < 10) {
            newErrors.description = 'Description trop courte (min 10 caractères)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await departementService.createDepartement(formData);
            Toast.success('Département créé avec succès !');
            onSuccess();
            onClose();
            setFormData({ nom: '', description: '', responsable: '' });
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Créer un département"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>Créer</Button>
                </div>
            }
        >
            <form className="space-y-4">
                <Input
                    label="Nom du département"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    error={errors.nom}
                    placeholder="Ex: Informatique"
                    required
                />

                <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    rows={4}
                    placeholder="Décrivez les activités et missions du département..."
                />

                <Input
                    label="Responsable (optionnel)"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    placeholder="Nom du responsable"
                />
            </form>
        </Modal>
    );
};