// src/components/admin/dashboard/StatsCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import * as Icons from 'lucide-react';

/**
 * Card de statistiques pour le Dashboard Admin
 */
const StatsCard = ({
    label,
    value,
    icon,
    bgColor = 'bg-blue-100',
    textColor = 'text-blue-600',
    trend = null,
    trendValue = null
}) => {
    const Icon = Icons[icon] || Icons.Activity;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>

                    {/* Trend */}
                    {trend && trendValue && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{trendValue}%</span>
                            <span className="text-gray-500 ml-1">vs mois dernier</span>
                        </div>
                    )}
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;