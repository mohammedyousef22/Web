// src/components/charts/LineChart.jsx
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Composant LineChart réutilisable
 */
const LineChart = ({
    data = [],
    xKey = 'name',
    lines = [],
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b']
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px'
                    }}
                />
                <Legend />
                {lines.map((line, index) => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color || colors[index % colors.length]}
                        strokeWidth={2}
                        name={line.name}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;