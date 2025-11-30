// src/components/stagiaire/profil/ProfilForm.jsx
import React, { useState, useEffect } from 'react';
import { Input, Select, Textarea, Button } from '@/components/common';
import { stagiaireService } from '@/api/services';
import { Toast } from '@/components/common';

export const ProfilForm = ({ stagiaire, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cin: '',
        date_naissance: '',
        telephone: '',
        etablissement: '',
        niveau_etude: '',
        filiere: '',
        adresse: '',
    });

    useEffect(() => {
        if (stagiaire) {
            setFormData({
                cin: stagiaire.cin || '',
                date_naissance: stagiaire.date_naissance || '',
                telephone: stagiaire.telephone || '',
                etablissement: stagiaire.etablissement || '',
                niveau_etude: stagiaire.niveau_etude || '',
                filiere: stagiaire.filiere || '',
                adresse: stagiaire.adresse || '',
            });
        }
    }, [stagiaire]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await stagiaireService.updateProfil(formData);
            Toast.success('Profil mis à jour avec succès !');
            onUpdate?.();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input label="CIN" name="cin" value={formData.cin} onChange={handleChange} />
                <Input label="Date de naissance" type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} />
                <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} />
                <Input label="Établissement" name="etablissement" value={formData.etablissement} onChange={handleChange} />
                <Select label="Niveau d'étude" name="niveau_etude" value={formData.niveau_etude} onChange={handleChange} options={[{ value: 'Bac+3', label: 'Bac+3' }, { value: 'Bac+5', label: 'Bac+5' }]} />
                <Input label="Filière" name="filiere" value={formData.filiere} onChange={handleChange} />
            </div>
            <Textarea label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} rows={3} />
            <Button type="submit" variant="primary" loading={loading}>Enregistrer</Button>
        </form>
    );
};