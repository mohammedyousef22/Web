// src/components/stagiaire/rapports/UploadRapportModal.jsx
import React, { useState } from 'react';
import { Modal, Input, Select, FileUpload, Button } from '@/components/common';
import { rapportService } from '@/api/services';
import { Toast } from '@/components/common';

export const UploadRapportModal = ({ isOpen, onClose, stageId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ type: 'final', titre: '', fichier: null });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fichier) {
            setErrors({ fichier: 'Fichier PDF requis' });
            return;
        }

        setLoading(true);
        try {
            await rapportService.uploadRapport({ stage_id: stageId, ...formData });
            Toast.success('Rapport déposé avec succès !');
            onSuccess();
            onClose();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Déposer un rapport" size="md" footer={
            <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                <Button variant="primary" onClick={handleSubmit} loading={loading}>Déposer</Button>
            </div>
        }>
            <form className="space-y-4">
                <Select label="Type de rapport" name="type" value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))} options={[{ value: 'intermediaire', label: 'Intermédiaire' }, { value: 'final', label: 'Final' }]} required />
                <Input label="Titre" name="titre" value={formData.titre} onChange={e => setFormData(prev => ({ ...prev, titre: e.target.value }))} required />
                <FileUpload label="Fichier PDF" accept=".pdf" maxSize={10 * 1024 * 1024} onChange={file => setFormData(prev => ({ ...prev, fichier: file }))} error={errors.fichier} required />
            </form>
        </Modal>
    );
};