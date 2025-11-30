// src/components/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, Mail, Key } from 'lucide-react';
import { authService } from '@/api/services';
import { Button, Input } from '@/components/common';
import { Toast } from '@/components/common';

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        email: email || '',
        token: token || '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email requis';
        }

        if (!formData.token) {
            newErrors.token = 'Token requis';
        }

        if (!formData.password || formData.password.length < 8) {
            newErrors.password = 'Mot de passe requis (min 8 caractères)';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        console.log('🔄 Envoi données:', {
            email: formData.email,
            token: formData.token,
            password: '***'
        });

        try {
            const response = await authService.resetPassword({
                email: formData.email,
                token: formData.token,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            console.log('✅ Succès:', response);
            setSuccess(true);
            Toast.success('Mot de passe réinitialisé avec succès !');

            // Rediriger vers login après 2 secondes
            setTimeout(() => {
                console.log('➡️ Redirection vers login...');
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('❌ Erreur complète:', error);
            console.error('❌ Message:', error.message);
            console.error('❌ Réponse:', error.response?.data);
            console.error('❌ Status:', error.response?.status);

            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la réinitialisation';
            Toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token && !email) {
        // Allow manual entry
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe réinitialisé !</h1>
                <p className="text-gray-600">Redirection vers la page de connexion...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
                <p className="text-gray-600">Choisissez un nouveau mot de passe sécurisé</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field - required by backend */}
                {!email && (
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        icon={Mail}
                        error={errors.email}
                        required
                    />
                )}

                {/* Token field */}
                {!token && (
                    <Input
                        label="Token de réinitialisation"
                        type="text"
                        name="token"
                        value={formData.token}
                        onChange={handleChange}
                        placeholder="Collez le token reçu par email"
                        icon={Key}
                        error={errors.token}
                        helperText="Copiez le token depuis votre email"
                        required
                    />
                )}

                <Input
                    label="Nouveau mot de passe"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.password}
                    helperText="Minimum 8 caractères"
                    required
                />

                <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.password_confirmation}
                    required
                />

                <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
                    Réinitialiser le mot de passe
                </Button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;