import React, { useState, useEffect } from 'react';
import { RapportsAValiderList, RapportViewerModal, ValiderRapportModal, DemanderCorrectionsModal } from '@/components/encadrant/rapports';
import { rapportService } from '@/api/services';

const RapportsPage = () => {
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRapport, setSelectedRapport] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [validerOpen, setValiderOpen] = useState(false);
    const [correctionsOpen, setCorrectionsOpen] = useState(false);

    useEffect(() => {
        loadRapports();
    }, []);

    const loadRapports = async () => {
        setLoading(true);
        try {
            const response = await rapportService.getRapportsAValider();
            console.log('📄 Réponse rapports:', response);
            const data = response.data || response;
            console.log('📄 Data extraite:', data);
            const rapports = Array.isArray(data) ? data : (data.rapports || []);
            console.log('📄 Rapports finaux:', rapports);
            setRapports(rapports);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Rapports à Valider</h1>
            <RapportsAValiderList
                rapports={rapports}
                loading={loading}
                onView={r => { setSelectedRapport(r); setViewerOpen(true); }}
                onValider={r => { setSelectedRapport(r); setValiderOpen(true); }}
                onCorrections={r => { setSelectedRapport(r); setCorrectionsOpen(true); }}
            />
            <RapportViewerModal isOpen={viewerOpen} onClose={() => setViewerOpen(false)} rapport={selectedRapport} />
            <ValiderRapportModal isOpen={validerOpen} onClose={() => setValiderOpen(false)} rapport={selectedRapport} onSuccess={loadRapports} />
            <DemanderCorrectionsModal isOpen={correctionsOpen} onClose={() => setCorrectionsOpen(false)} rapport={selectedRapport} onSuccess={loadRapports} />
        </div>
    );
};

export default RapportsPage;