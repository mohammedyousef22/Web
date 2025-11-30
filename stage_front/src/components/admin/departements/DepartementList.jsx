// src/components/admin/departements/DepartementList.jsx
import React from 'react';
import { Building, Edit, Trash2, Users } from 'lucide-react';
import { Card, Button, EmptyState } from '@/components/common';

export const DepartementList = ({ departements, loading, onEdit, onDelete }) => {
    if (loading) return <div className="text-center py-8">Chargement...</div>;
    if (departements.length === 0) return <EmptyState icon={Building} title="Aucun département" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departements.map((dept) => (
                <Card key={dept.id} hover>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{dept.nom}</h3>
                                <p className="text-sm text-gray-600">{dept.encadrants_count || 0} encadrants</p>
                            </div>
                        </div>
                    </div>

                    {dept.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dept.description}</p>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                        <Button variant="ghost" size="sm" icon={Edit} onClick={() => onEdit(dept)} fullWidth>
                            Modifier
                        </Button>
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(dept)} className="text-red-600">
                            Supprimer
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};