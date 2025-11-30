// src/components/admin/encadrants/CreateEncadrantModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '@/components/common';
import { encadrantService, departementService } from '@/api/services';
import { Toast } from '@/components/common';

export const CreateEncadrantModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        departement_id: '',
        specialite: '',
        telephone: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) loadDepartements();
    }, [isOpen]);

    const loadDepartements = async () => {
        try {
            const response = await departementService.getAllDepartements();
            setDepartements(response.departements.map(d => ({ value: d.id, label: d.nom })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 3) newErrors.name = 'Nom requis (min 3 caractères)';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
        if (!formData.departement_id) newErrors.departement_id = 'Département requis';
        if (!formData.specialite || formData.specialite.length < 3) newErrors.specialite = 'Spécialité requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await encadrantService.createEncadrant(formData);
            Toast.success('Encadrant créé avec succès ! Un email lui a été envoyé.');
            onSuccess();
            onClose();
            setFormData({ name: '', email: '', departement_id: '', specialite: '', telephone: '' });
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
            title="Créer un encadrant"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>Créer</Button>
                </div>
            }
        >
            <form className="space-y-4">
                <Input label="Nom complet" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                <Select label="Département" name="departement_id" value={formData.departement_id} onChange={handleChange} options={departements} error={errors.departement_id} required />
                <Input label="Spécialité" name="specialite" value={formData.specialite} onChange={handleChange} error={errors.specialite} required />
                <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="0612345678" />
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    💡 Un mot de passe temporaire sera généré et envoyé par email
                </div>
            </form>
        </Modal>
    );
};