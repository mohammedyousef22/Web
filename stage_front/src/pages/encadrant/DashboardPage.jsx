// src/pages/encadrant/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { StatsEncadrant } from '@/components/encadrant/dashboard';
import { dashboardService } from '@/api/services';
import { LoadingSpinner } from '@/components/common';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await dashboardService.getEncadrantStats();
            setStats(response.data || response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Encadrant</h1>

            {/* KPIs */}
            <StatsEncadrant stats={stats?.kpis || {}} />
        </div>
    );
};

export default DashboardPage;
