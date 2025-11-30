// Test page simple pour stagiaire
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const TestStagiairePage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">PAGE TEST STAGIAIRE</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">Informations utilisateur :</h2>
                <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(user, null, 2)}
                </pre>

                <div className="mt-4">
                    <p><strong>ID:</strong> {user?.id}</p>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>

                <div className="mt-4 p-4 bg-green-100 rounded">
                    ✅ Si vous voyez cette page, le StagiaireLayout fonctionne !
                </div>
            </div>
        </div>
    );
};

export default TestStagiairePage;
