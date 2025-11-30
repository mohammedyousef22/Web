// src/components/encadrant/rapports/ValiderRapportModal.jsx
import React, { useState } from 'react';
import { Modal, Textarea, Button } from '@/components/common';
import { rapportService } from '@/api/services';
import { Toast } from '@/components/common';

export const ValiderRapportModal = ({ isOpen, onClose, rapport, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [commentaire, setCommentaire] = useState('');

    const handleValider = async () => {
        setLoading(true);
        try {
            await rapportService.validerRapport(rapport.id, commentaire);
            Toast.success('Rapport validé avec succès !');
            onSuccess();
            onClose();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Valider le rapport" size="md" footer={
            <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                <Button variant="success" onClick={handleValider} loading={loading}>Valider</Button>
            </div>
        }>
            <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-gray-900">{rapport?.titre}</p>
                    <p className="text-sm text-gray-600">{rapport?.stage?.stagiaire?.user?.name}</p>
                </div>
                <Textarea label="Commentaires (optionnel)" value={commentaire} onChange={e => setCommentaire(e.target.value)} rows={4} placeholder="Vos remarques positives..." />
            </div>
        </Modal>
    );
};

export default ValiderRapportModal;
