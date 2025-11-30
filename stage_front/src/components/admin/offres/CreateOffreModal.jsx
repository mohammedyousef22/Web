// src/components/admin/offres/CreateOffreModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Textarea, Button } from '@/components/common';
import { offreService, departementService } from '@/api/services';
import { Toast } from '@/components/common';

const CreateOffreModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        departement_id: '',
        duree_jours: '',
        date_debut: '',
        date_fin: '',
        competences_requises: '',
        nombre_places: '',
        statut: 'ouvert',
    });
    const [errors, setErrors] = useState({});

    // Charger les départements
    useEffect(() => {
        if (isOpen) {
            loadDepartements();
        }
    }, [isOpen]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.titre || formData.titre.length < 10) {
            newErrors.titre = 'Titre requis (min 10 caractères)';
        }

        if (!formData.description || formData.description.length < 50) {
            newErrors.description = 'Description requise (min 50 caractères)';
        }

        if (!formData.departement_id) {
            newErrors.departement_id = 'Département requis';
        }

        if (!formData.duree_jours || formData.duree_jours < 7) {
            newErrors.duree_jours = 'Durée minimale: 7 jours';
        }

        if (!formData.date_debut) {
            newErrors.date_debut = 'Date de début requise';
        }

        if (!formData.date_fin) {
            newErrors.date_fin = 'Date de fin requise';
        }

        if (formData.date_debut && formData.date_fin && new Date(formData.date_debut) >= new Date(formData.date_fin)) {
            newErrors.date_fin = 'Date de fin doit être après date de début';
        }

        if (!formData.nombre_places || formData.nombre_places < 1) {
            newErrors.nombre_places = 'Nombre de places requis (min 1)';
        }

        if (!formData.competences_requises || formData.competences_requises.length < 10) {
            newErrors.competences_requises = 'Compétences requises (min 10 caractères)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            await offreService.createOffre(formData);
            Toast.success('Offre créée avec succès !');
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            titre: '',
            description: '',
            departement_id: '',
            duree_jours: '',
            date_debut: '',
            date_fin: '',
            competences_requises: '',
            nombre_places: '',
            statut: 'ouvert',
        });
        setErrors({});
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Créer une offre de stage"
            size="lg"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>
                        Créer l'offre
                    </Button>
                </div>
            }
        >
            <form className="space-y-4">
                <Input label="Titre de l'offre" name="titre" value={formData.titre} onChange={handleChange} error={errors.titre} required />

                <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} error={errors.description} showCharCount maxLength={1000} required />

                <div className="grid grid-cols-2 gap-4">
                    <Select label="Département" name="departement_id" value={formData.departement_id} onChange={handleChange} options={departements} error={errors.departement_id} required />

                    <Input label="Durée (jours)" type="number" name="duree_jours" value={formData.duree_jours} onChange={handleChange} error={errors.duree_jours} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Date début" type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} error={errors.date_debut} required />

                    <Input label="Date fin" type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} error={errors.date_fin} required />
                </div>

                <Textarea label="Compétences requises" name="competences_requises" value={formData.competences_requises} onChange={handleChange} rows={3} error={errors.competences_requises} helperText="Séparez par des virgules" required />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre de places" type="number" name="nombre_places" value={formData.nombre_places} onChange={handleChange} error={errors.nombre_places} required />

                    <Select
                        label="Statut"
                        name="statut"
                        value={formData.statut}
                        onChange={handleChange}
                        options={[
                            { value: 'ouvert', label: 'Ouvert' },
                            { value: 'ferme', label: 'Fermé' },
                        ]}
                        required
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CreateOffreModal;