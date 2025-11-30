// src/components/admin/dashboard/TopEncadrantsTable.jsx
import React from 'react';
import { Award } from 'lucide-react';
import { Card, Badge } from '@/components/common';

/**
 * Tableau des meilleurs encadrants
 */
const TopEncadrantsTable = ({ data = [] }) => {
    return (
        <Card title="Top Encadrants" padding="normal">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rang</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Stagiaires</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                    Aucun encadrant
                                </td>
                            </tr>
                        ) : (
                            data.map((encadrant, index) => (
                                <tr key={encadrant.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                                            <span className="font-medium text-gray-900">#{encadrant.rank}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-900">{encadrant.name}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-600">{encadrant.email}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Badge variant="primary">{encadrant.stages_count}</Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TopEncadrantsTable;