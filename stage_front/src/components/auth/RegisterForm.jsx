// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Building, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Select, FileUpload } from '@/components/common';
import { Toast } from '@/components/common';

const RegisterForm = () => {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        cin: '',
        date_naissance: '',
        telephone: '',
        etablissement: '',
        niveau_etude: '',
        filiere: '',
        adresse: '',
        cv: null,
    });
    const [errors, setErrors] = useState({});

    const niveauxEtude = [
        { value: 'Bac', label: 'Bac' },
        { value: 'Bac+1', label: 'Bac+1' },
        { value: 'Bac+2', label: 'Bac+2' },
        { value: 'Bac+3', label: 'Bac+3 (Licence)' },
        { value: 'Bac+4', label: 'Bac+4' },
        { value: 'Bac+5', label: 'Bac+5 (Master)' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (file) => {
        setFormData((prev) => ({ ...prev, cv: file }));
        if (errors.cv) {
            setErrors((prev) => ({ ...prev, cv: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'Nom complet requis (min 3 caractères)';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
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

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.telephone || !/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ''))) {
            newErrors.telephone = 'Téléphone invalide (10 chiffres)';
        }

        if (!formData.etablissement || formData.etablissement.length < 3) {
            newErrors.etablissement = 'Établissement requis';
        }

        if (!formData.niveau_etude) {
            newErrors.niveau_etude = 'Niveau d\'étude requis';
        }

        if (!formData.filiere || formData.filiere.length < 3) {
            newErrors.filiere = 'Filière requise';
        }

        if (!formData.cv) {
            newErrors.cv = 'CV requis (PDF)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            await register(data);
            Toast.success('Inscription réussie ! Bienvenue.');
        } catch (error) {
            console.error('Register error:', error);
            console.error('Error message:', error.message);
            console.error('Error data:', error.data);
            console.error('Error errors:', error.errors);
            console.error('CV errors details:', error.errors?.cv);
            console.error('Error status:', error.status);

            if (error.errors) {
                setErrors(error.errors);
            }
            Toast.error(error.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription Stagiaire</h1>
                <p className="text-gray-600">Créez votre compte pour postuler aux offres</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                        1
                    </div>
                    <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                        2
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* STEP 1: Compte */}
                {currentStep === 1 && (
                    <>
                        <Input label="Nom complet" name="name" value={formData.name} onChange={handleChange} icon={User} error={errors.name} required />
                        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} icon={Mail} error={errors.email} required />
                        <Input label="Mot de passe" type="password" name="password" value={formData.password} onChange={handleChange} icon={Lock} error={errors.password} required />
                        <Input label="Confirmer mot de passe" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} icon={Lock} error={errors.password_confirmation} required />

                        <Button type="button" variant="primary" fullWidth onClick={handleNext} size="lg">
                            Suivant
                        </Button>
                    </>
                )}

                {/* STEP 2: Informations */}
                {currentStep === 2 && (
                    <>
                        <Input label="CIN (optionnel)" name="cin" value={formData.cin} onChange={handleChange} placeholder="AB123456" />
                        <Input label="Date de naissance" type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} />
                        <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} icon={Phone} error={errors.telephone} required />
                        <Input label="Établissement" name="etablissement" value={formData.etablissement} onChange={handleChange} icon={Building} error={errors.etablissement} required />
                        <Select label="Niveau d'étude" name="niveau_etude" value={formData.niveau_etude} onChange={handleChange} options={niveauxEtude} error={errors.niveau_etude} required />
                        <Input label="Filière" name="filiere" value={formData.filiere} onChange={handleChange} icon={GraduationCap} error={errors.filiere} required />
                        <FileUpload label="CV (PDF uniquement)" accept=".pdf" maxSize={5 * 1024 * 1024} onChange={handleFileChange} error={errors.cv} required />

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" fullWidth onClick={() => setCurrentStep(1)} size="lg">
                                Retour
                            </Button>
                            <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
                                S'inscrire
                            </Button>
                        </div>
                    </>
                )}

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Se connecter
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;