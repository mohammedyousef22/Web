// src/components/stagiaire/offres/PostulerModal.jsx
import React, { useState } from 'react';
import { Modal, Textarea, Button } from '@/components/common';
import { candidatureService } from '@/api/services';
import { Toast } from '@/components/common';

/**
 * Modal pour postuler à une offre avec lettre de motivation
 */
const PostulerModal = ({ isOpen, onClose, offre, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [lettreMotivation, setLettreMotivation] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // Validation
        if (!lettreMotivation || lettreMotivation.trim().length < 100) {
            setError('La lettre de motivation doit contenir au moins 100 caractères');
            return;
        }

        setLoading(true);

        try {
            await candidatureService.postuler(offre.id, lettreMotivation);
            Toast.success('Candidature envoyée avec succès !');
            onSuccess();
            onClose();
            setLettreMotivation('');
            setError('');
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de l\'envoi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!offre) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Postuler à l'offre"
            size="lg"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>
                        Envoyer ma candidature
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Info Offre */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">{offre.titre}</h3>
                    <p className="text-sm text-gray-600">{offre.departement?.nom}</p>
                    <p className="text-sm text-gray-600">
                        {offre.duree_jours} jours • {offre.nombre_places} place(s) disponible(s)
                    </p>
                </div>

                {/* Lettre de motivation */}
                <Textarea
                    label="Lettre de motivation"
                    value={lettreMotivation}
                    onChange={(e) => {
                        setLettreMotivation(e.target.value);
                        setError('');
                    }}
                    rows={10}
                    placeholder="Expliquez pourquoi vous souhaitez effectuer ce stage et ce que vous pouvez apporter à l'entreprise..."
                    error={error}
                    showCharCount
                    maxLength={2000}
                    helperText="Minimum 100 caractères"
                    required
                />

                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    💡 <strong>Conseil:</strong> Personnalisez votre lettre en fonction de l'offre.
                    Mettez en avant vos compétences et votre motivation.
                </div>
            </div>
        </Modal>
    );
};

export default PostulerModal;