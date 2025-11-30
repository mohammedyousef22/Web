// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { StatsCard, TopEncadrantsTable } from '@/components/admin/dashboard';
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
      const response = await dashboardService.getAdminStats();
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
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardService.formatAdminKPIs(stats?.kpis || {}).map(kpi => (
          <StatsCard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Top Encadrants */}
      <TopEncadrantsTable data={stats?.top_encadrants || []} />
    </div>
  );
};

export default DashboardPage;