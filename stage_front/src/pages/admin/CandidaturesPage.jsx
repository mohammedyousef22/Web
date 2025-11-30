// src/pages/admin/CandidaturesPage.jsx
import React, { useState, useEffect } from 'react';
import { CandidatureList, CandidatureDetails, AcceptCandidatureModal, RejectCandidatureModal } from '@/components/admin/candidatures';
import { candidatureService } from '@/api/services';
import { Select } from '@/components/common';

const CandidaturesPage = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statutFilter, setStatutFilter] = useState('');
    const [selectedCandidature, setSelectedCandidature] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    useEffect(() => {
        loadCandidatures();
    }, [statutFilter]);

    const loadCandidatures = async () => {
        console.log('Loading candidatures with filter:', statutFilter);
        setLoading(true);
        try {
            const response = await candidatureService.getAllCandidatures({ statut: statutFilter });
            console.log('Candidatures loaded:', response.candidatures?.length || 0);
            setCandidatures(response.candidatures || []);
        } catch (error) {
            console.error('Error loading candidatures:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Candidatures</h1>
                <Select
                    value={statutFilter}
                    onChange={e => setStatutFilter(e.target.value)}
                    options={[
                        { value: '', label: 'Tous les statuts' },
                        { value: 'en_attente', label: 'En attente' },
                        { value: 'accepte', label: 'Acceptées' },
                        { value: 'refuse', label: 'Refusées' },
                    ]}
                />
            </div>

            <CandidatureList
                candidatures={candidatures}
                loading={loading}
                onView={c => { setSelectedCandidature(c); setDetailsModalOpen(true); }}
                onAccept={c => { setSelectedCandidature(c); setAcceptModalOpen(true); }}
                onReject={c => { setSelectedCandidature(c); setRejectModalOpen(true); }}
            />

            <CandidatureDetails isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} candidature={selectedCandidature} />
            <AcceptCandidatureModal isOpen={acceptModalOpen} onClose={() => setAcceptModalOpen(false)} candidature={selectedCandidature} onSuccess={loadCandidatures} />
            <RejectCandidatureModal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} candidature={selectedCandidature} onSuccess={loadCandidatures} />
        </div>
    );
};

export default CandidaturesPage;