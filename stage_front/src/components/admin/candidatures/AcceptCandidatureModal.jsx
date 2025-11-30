// src/components/admin/candidatures/AcceptCandidatureModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from '@/components/common';
import { candidatureService, encadrantService } from '@/api/services';
import { Toast } from '@/components/common';

/**
 * Modal pour accepter une candidature et assigner un encadrant
 */
const AcceptCandidatureModal = ({ isOpen, onClose, candidature, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [encadrants, setEncadrants] = useState([]);
    const [selectedEncadrant, setSelectedEncadrant] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && candidature) {
            loadEncadrants();
        }
    }, [isOpen, candidature]);

    const loadEncadrants = async () => {
        try {
            const response = await encadrantService.getEncadrantsDisponibles(
                candidature?.offre?.departement_id
            );

            const options = response.encadrants.map((e) => ({
                value: e.id,
                label: `${e.user.name} - ${e.specialite}`,
            }));

            setEncadrants(options);
        } catch (error) {
            Toast.error('Erreur lors du chargement des encadrants');
            console.error(error);
        }
    };

    const handleAccept = async () => {
        if (!selectedEncadrant) {
            setError('Veuillez sélectionner un encadrant');
            return;
        }

        setLoading(true);

        try {
            await candidatureService.acceptCandidature(candidature.id, parseInt(selectedEncadrant));
            Toast.success('Candidature acceptée avec succès !');
            onSuccess();
            onClose();
            setSelectedEncadrant('');
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de l\'acceptation');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!candidature) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Accepter la candidature"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button variant="success" onClick={handleAccept} loading={loading}>
                        Accepter et assigner
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Info Candidature */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                        {candidature.stagiaire?.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        Offre: {candidature.offre?.titre}
                    </p>
                    <p className="text-sm text-gray-600">
                        Département: {candidature.offre?.departement?.nom}
                    </p>
                </div>

                {/* Sélection Encadrant */}
                <Select
                    label="Assigner un encadrant"
                    value={selectedEncadrant}
                    onChange={(e) => {
                        setSelectedEncadrant(e.target.value);
                        setError('');
                    }}
                    options={encadrants}
                    placeholder="Choisir un encadrant..."
                    error={error}
                    helperText="L'encadrant recevra une notification par email"
                    required
                />

                {encadrants.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        Aucun encadrant disponible dans ce département
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AcceptCandidatureModal;