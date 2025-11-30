// src/components/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/api/services';
import { Button, Input } from '@/components/common';
import { Toast } from '@/components/common';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSent(true);
      Toast.success('Email envoyé avec succès !');
    } catch (err) {
      Toast.error(err.message || 'Erreur lors de l\'envoi');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé !</h1>
        <p className="text-gray-600 mb-6">
          Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <p className="text-sm text-blue-900 font-medium mb-2">
            🔒 Pour réinitialiser votre mot de passe :
          </p>
          <p className="text-sm text-blue-700">
            1. Vérifiez votre boîte mail (et spam)<br />
            2. <strong>Cliquez sur le lien dans l'email</strong><br />
            3. Entrez votre nouveau mot de passe
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/login">
            <Button variant="primary" fullWidth>
              Retour à la connexion
            </Button>
          </Link>

          {/* Link to reset page for manual token entry */}
          <Button
            variant="ghost"
            fullWidth
            size="sm"
            onClick={() => navigate('/reset-password')}
          >
            Aller à la page de réinitialisation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié ?</h1>
        <p className="text-gray-600">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="votre@email.com"
          icon={Mail}
          error={error}
          required
        />

        <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
          Envoyer le lien
        </Button>

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;