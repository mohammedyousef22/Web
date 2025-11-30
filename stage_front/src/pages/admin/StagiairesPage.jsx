// src/pages/admin/StagiairesPage.jsx
import React, { useState, useEffect } from 'react';
import { stagiaireService } from '@/api/services';
import { Button, SearchBar, Toast, Badge } from '@/components/common';
import { Download, User, Mail, Building, GraduationCap, Eye } from 'lucide-react';

const StagiairesPage = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadStagiaires();
    }, []);

    const loadStagiaires = async () => {
        setLoading(true);
        try {
            const response = await stagiaireService.getAllStagiaires();
            setStagiaires(response.stagiaires || []);
        } catch (error) {
            Toast.error('Erreur lors du chargement des stagiaires');
        } finally {
            setLoading(false);
        }
    };

    const filteredStagiaires = stagiaires.filter(stag =>
        stag.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stag.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stag.etablissement?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = async () => {
        try {
            await stagiaireService.exportStagiaires();
            Toast.success('Export réussi');
        } catch (error) {
            Toast.error('Erreur lors de l\'export');
        }
    };

    const getStatusBadge = (stage) => {
        if (!stage) return <Badge variant="default">Aucun stage</Badge>;

        switch (stage.statut) {
            case 'en_cours':
                return <Badge variant="success">En cours</Badge>;
            case 'termine':
                return <Badge variant="primary">Terminé</Badge>;
            default:
                return <Badge variant="default">{stage.statut}</Badge>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Stagiaires</h1>
                <Button variant="outline" icon={Download} onClick={handleExport}>
                    Exporter
                </Button>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un stagiaire..."
            />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stagiaire</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Établissement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStagiaires.map((stagiaire) => (
                            <tr key={stagiaire.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{stagiaire.user?.name}</p>
                                            <p className="text-sm text-gray-500">{stagiaire.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{stagiaire.telephone || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                        <Building className="w-4 h-4 text-gray-400" />
                                        {stagiaire.etablissement}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                        <GraduationCap className="w-4 h-4 text-gray-400" />
                                        {stagiaire.niveau_etude}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {stagiaire.stage?.offre?.titre || 'Aucun stage'}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(stagiaire.stage)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredStagiaires.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Aucun stagiaire trouvé</p>
                </div>
            )}
        </div>
    );
};

export default StagiairesPage;
