// src/components/admin/candidatures/RejectCandidatureModal.jsx
import React, { useState } from 'react';
import { Modal, Textarea, Button } from '@/components/common';
import { candidatureService } from '@/api/services';
import { Toast } from '@/components/common';

const RejectCandidatureModal = ({ isOpen, onClose, candidature, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [motif, setMotif] = useState('');

    const handleReject = async () => {
        setLoading(true);

        try {
            console.log('Rejecting candidature:', candidature.id);
            await candidatureService.rejectCandidature(candidature.id, motif);
            console.log('Candidature rejected successfully');
            Toast.success('Candidature refusée');
            console.log('Calling onSuccess callback');
            onSuccess();
            onClose();
            setMotif('');
        } catch (error) {
            console.error('Error rejecting candidature:', error);
            console.error('Error message:', error.message);
            console.error('Error data:', error.data);
            console.error('Error status:', error.status);
            Toast.error(error.message || 'Erreur lors du refus');
        } finally {
            setLoading(false);
        }
    };

    if (!candidature) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Refuser la candidature"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleReject} loading={loading}>
                        Confirmer le refus
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {candidature.stagiaire?.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">Offre: {candidature.offre?.titre}</p>
                </div>

                <Textarea
                    label="Motif du refus (optionnel)"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    rows={4}
                    placeholder="Vous pouvez expliquer brièvement la raison du refus..."
                    helperText="Ce message sera envoyé au stagiaire"
                />

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    ⚠️ Le stagiaire recevra un email l'informant du refus de sa candidature.
                </div>
            </div>
        </Modal>
    );
};

export default RejectCandidatureModal;