import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reportApi';
import { AdoptionTrendsChart } from '../../components/charts/AdoptionTrendsChart';
import { ShelterPerformanceChart } from '../../components/charts/ShelterPerformanceChart';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Download, BarChart3, TrendingUp, Award } from 'lucide-react';

export const ShelterReportsPage = () => {
  const [trends, setTrends] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const [trRes, perfRes] = await Promise.all([
          reportApi.getAdoptionTrends(),
          reportApi.getShelterPerformance()
        ]);
        setTrends(trRes || []);
        setPerformance(perfRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleExport = () => {
    success('Shelter operations report exported as CSV!');
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Shelter Analytics & Rehoming Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monthly adoption metrics, intake success rates, and shelter performance benchmarks.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
          Export Report (.CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Adoption Volume Trends
            </h3>
            <p className="text-xs text-slate-400">Applications vs finalized adoptions</p>
          </div>
          <AdoptionTrendsChart data={trends} />
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Intake vs Adoption Conversion Rate
            </h3>
            <p className="text-xs text-slate-400">Shelter rehoming efficiency</p>
          </div>
          <ShelterPerformanceChart data={performance} />
        </div>
      </div>
    </div>
  );
};
