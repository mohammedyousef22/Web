// src/pages/admin/SettingsPage.jsx
import React, { useState } from 'react';
import { Card, Input, Button, Toast } from '@/components/common';
import { Settings, Save, Key, Bell, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    const [generalSettings, setGeneralSettings] = useState({
        app_name: 'Gestion des Stages',
        app_description: 'Plateforme de gestion des stages',
        contact_email: 'contact@stages.com',
    });

    const [notificationSettings, setNotificationSettings] = useState({
        email_notifications: true,
        candidature_notifications: true,
        rapport_notifications: true,
        evaluation_notifications: true,
    });

    const [securitySettings, setSecuritySettings] = useState({
        password_min_length: 8,
        require_email_verification: true,
        session_timeout: 30,
    });

    const handleSaveGeneral = async () => {
        setLoading(true);
        try {
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000));
            Toast.success('Paramètres généraux sauvegardés');
        } catch (error) {
            Toast.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            Toast.success('Préférences de notification sauvegardées');
        } catch (error) {
            Toast.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecurity = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            Toast.success('Paramètres de sécurité sauvegardés');
        } catch (error) {
            Toast.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres de l'Application</h1>

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

            {/* Tab Content */}
            {activeTab === 'general' && (
                <Card padding="normal">
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Paramètres Généraux</h2>
                        <div className="space-y-4">
                            <Input
                                label="Nom de l'application"
                                value={generalSettings.app_name}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, app_name: e.target.value })}
                            />
                            <Input
                                label="Description"
                                value={generalSettings.app_description}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, app_description: e.target.value })}
                            />
                            <Input
                                label="Email de contact"
                                type="email"
                                value={generalSettings.contact_email}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, contact_email: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button variant="primary" icon={Save} onClick={handleSaveGeneral} loading={loading}>
                                Sauvegarder
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'notifications' && (
                <Card padding="normal">
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Préférences de Notification</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Notifications par email</p>
                                    <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.email_notifications}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Nouvelles candidatures</p>
                                    <p className="text-sm text-gray-600">Notification lors de nouvelles candidatures</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.candidature_notifications}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, candidature_notifications: e.target.checked })}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Rapports soumis</p>
                                    <p className="text-sm text-gray-600">Notification lors de soumission de rapports</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.rapport_notifications}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, rapport_notifications: e.target.checked })}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Nouvelles évaluations</p>
                                    <p className="text-sm text-gray-600">Notification lors de nouvelles évaluations</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.evaluation_notifications}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, evaluation_notifications: e.target.checked })}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="primary" icon={Save} onClick={handleSaveNotifications} loading={loading}>
                                Sauvegarder
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'security' && (
                <Card padding="normal">
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Paramètres de Sécurité</h2>
                        <div className="space-y-4">
                            <Input
                                label="Longueur minimale du mot de passe"
                                type="number"
                                value={securitySettings.password_min_length}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
                            />
                            <Input
                                label="Timeout de session (minutes)"
                                type="number"
                                value={securitySettings.session_timeout}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) })}
                            />
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Vérification d'email requise</p>
                                    <p className="text-sm text-gray-600">Exiger la vérification de l'email à l'inscription</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={securitySettings.require_email_verification}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, require_email_verification: e.target.checked })}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="primary" icon={Save} onClick={handleSaveSecurity} loading={loading}>
                                Sauvegarder
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SettingsPage;
