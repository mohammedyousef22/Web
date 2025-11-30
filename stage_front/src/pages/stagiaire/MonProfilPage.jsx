// src/pages/stagiaire/MonProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { stagiaireService } from '@/api/services';
import { Card, Input, Button, Toast, Select } from '@/components/common';
import { User, Mail, Phone, Building, GraduationCap, FileText, Upload, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MonProfilPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [cvFile, setCvFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: '',
        etablissement: '',
        niveau_etude: '',
        specialite: '',
        date_naissance: '',
        adresse: '',
    });

    useEffect(() => {
        loadProfil();
    }, []);

    const loadProfil = async () => {
        setLoading(true);
        try {
            const response = await stagiaireService.getMonProfil();
            const profil = response.data;
            setFormData({
                name: profil.user?.name || '',
                email: profil.user?.email || '',
                telephone: profil.telephone || '',
                etablissement: profil.etablissement || '',
                niveau_etude: profil.niveau_etude || '',
                specialite: profil.specialite || '',
                date_naissance: profil.date_naissance || '',
                adresse: profil.adresse || '',
            });
        } catch (error) {
            Toast.error('Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await stagiaireService.updateMonProfil(formData);
            Toast.success('Profil mis à jour avec succès');
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    const handleCvUpload = async () => {
        if (!cvFile) {
            Toast.error('Veuillez sélectionner un fichier');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('cv', cvFile);

        try {
            await stagiaireService.uploadCV(uploadData);
            Toast.success('CV téléchargé avec succès');
            setCvFile(null);
        } catch (error) {
            Toast.error('Erreur lors du téléchargement du CV');
        }
    };

    const tabs = [
        { id: 'info', label: 'Informations personnelles', icon: User },
        { id: 'academic', label: 'Parcours académique', icon: GraduationCap },
        { id: 'cv', label: 'CV', icon: FileText },
    ];

    if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Informations personnelles */}
                {activeTab === 'info' && (
                    <Card padding="normal">
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Informations Personnelles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nom complet"
                                    icon={User}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    icon={Mail}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Téléphone"
                                    icon={Phone}
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                />
                                <Input
                                    label="Date de naissance"
                                    type="date"
                                    value={formData.date_naissance}
                                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Adresse"
                                value={formData.adresse}
                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                            />
                            <div className="flex justify-end">
                                <Button variant="primary" icon={Save} type="submit" loading={saving}>
                                    Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Parcours académique */}
                {activeTab === 'academic' && (
                    <Card padding="normal">
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Parcours Académique</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Établissement"
                                    icon={Building}
                                    value={formData.etablissement}
                                    onChange={(e) => setFormData({ ...formData, etablissement: e.target.value })}
                                    required
                                />
                                <Select
                                    label="Niveau d'études"
                                    value={formData.niveau_etude}
                                    onChange={(e) => setFormData({ ...formData, niveau_etude: e.target.value })}
                                    options={[
                                        { value: '', label: 'Sélectionner un niveau' },
                                        { value: 'Licence', label: 'Licence' },
                                        { value: 'Master', label: 'Master' },
                                        { value: 'Doctorat', label: 'Doctorat' },
                                        { value: 'Ingénieur', label: 'Ingénieur' },
                                        { value: 'BTS', label: 'BTS' },
                                        { value: 'DUT', label: 'DUT' },
                                    ]}
                                    required
                                />
                            </div>
                            <Input
                                label="Spécialité"
                                icon={GraduationCap}
                                value={formData.specialite}
                                onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                                required
                            />
                            <div className="flex justify-end">
                                <Button variant="primary" icon={Save} type="submit" loading={saving}>
                                    Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* CV */}
                {activeTab === 'cv' && (
                    <Card padding="normal">
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Curriculum Vitae</h2>
                            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Téléchargez votre CV au format PDF</p>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setCvFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 mx-auto
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                                {cvFile && (
                                    <div className="mt-4">
                                        <p className="text-sm text-green-600 mb-3">
                                            Fichier sélectionné: {cvFile.name}
                                        </p>
                                        <Button variant="primary" icon={Upload} onClick={handleCvUpload}>
                                            Télécharger le CV
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {user?.cv_url && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600 mb-2">✓ CV déjà téléchargé</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(user.cv_url, '_blank')}
                                    >
                                        Voir mon CV
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </form>
        </div>
    );
};

export default MonProfilPage;
