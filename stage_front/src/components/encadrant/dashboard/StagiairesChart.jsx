// src/components/encadrant/dashboard/StagiairesChart.jsx
import React from 'react';
import { Card } from '@/components/common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StagiairesChart = ({ data = [] }) => {
    // Format data for chart
    const chartData = data.length > 0 ? data : [
        { mois: 'Jan', stagiaires: 0 },
        { mois: 'Fév', stagiaires: 0 },
        { mois: 'Mar', stagiaires: 0 },
        { mois: 'Avr', stagiaires: 0 },
        { mois: 'Mai', stagiaires: 0 },
        { mois: 'Juin', stagiaires: 0 },
    ];

    return (
        <Card title="Évolution des Stagiaires" padding="normal">
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="mois"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="stagiaires"
                            fill="#3b82f6"
                            name="Stagiaires"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default StagiairesChart;
