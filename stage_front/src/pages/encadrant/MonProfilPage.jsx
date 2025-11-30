// src/pages/encadrant/MonProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/api/services';
import { Button, Toast, LoadingSpinner } from '@/components/common';
import { User, Mail, Phone, Building, Briefcase } from 'lucide-react';

const MonProfilPage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        departement: '',
        specialite: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                telephone: user.telephone || '',
                departement: user.departement || '',
                specialite: user.specialite || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userService.updateProfile(formData);
            updateUser(response.user);
            Toast.success('Profil mis à jour avec succès');
            setEditing(false);
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Informations Personnelles</h2>
                    {!editing && (
                        <Button variant="outline" onClick={() => setEditing(true)}>
                            Modifier
                        </Button>
                    )}
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Département
                            </label>
                            <input
                                type="text"
                                name="departement"
                                value={formData.departement}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spécialité
                            </label>
                            <input
                                type="text"
                                name="specialite"
                                value={formData.specialite}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        nom: user.nom || '',
                                        prenom: user.prenom || '',
                                        email: user.email || '',
                                        telephone: user.telephone || '',
                                        departement: user.departement || '',
                                        specialite: user.specialite || '',
                                    });
                                }}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Nom complet</p>
                                <p className="text-base font-medium text-gray-900">
                                    {user?.nom} {user?.prenom}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-base font-medium text-gray-900">{user?.email}</p>
                            </div>
                        </div>

                        {user?.telephone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Téléphone</p>
                                    <p className="text-base font-medium text-gray-900">{user.telephone}</p>
                                </div>
                            </div>
                        )}

                        {user?.departement && (
                            <div className="flex items-center gap-3">
                                <Building className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Département</p>
                                    <p className="text-base font-medium text-gray-900">{user.departement}</p>
                                </div>
                            </div>
                        )}

                        {user?.specialite && (
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Spécialité</p>
                                    <p className="text-base font-medium text-gray-900">{user.specialite}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonProfilPage;
