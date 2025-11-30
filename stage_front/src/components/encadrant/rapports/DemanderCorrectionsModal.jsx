// src/components/encadrant/rapports/DemanderCorrectionsModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Textarea, Toast } from '@/components/common';
import { rapportService } from '@/api/services';

export const DemanderCorrectionsModal = ({ isOpen, onClose, rapport, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [commentaire, setCommentaire] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!commentaire.trim()) {
            setError('Veuillez préciser les corrections à apporter');
            return;
        }

        setLoading(true);
        try {
            await rapportService.demanderCorrections(rapport.id, commentaire);
            Toast.success('Demande de corrections envoyée');
            onSuccess();
            onClose();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Demander des corrections" size="md" footer={
            <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                <Button variant="warning" onClick={handleSubmit} loading={loading}>Envoyer</Button>
            </div>
        }>
            <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-gray-900">{rapport?.titre}</p>
                    <p className="text-sm text-gray-600">{rapport?.stage?.stagiaire?.user?.name}</p>
                </div>
                <Textarea label="Corrections demandées" value={commentaire} onChange={e => { setCommentaire(e.target.value); setError(''); }} rows={6} placeholder="Détaillez les modifications à apporter..." error={error} required />
            </div>
        </Modal>
    );
};