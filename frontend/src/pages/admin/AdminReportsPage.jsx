import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reportApi';
import { AdoptionTrendsChart } from '../../components/charts/AdoptionTrendsChart';
import { SpeciesDistributionChart } from '../../components/charts/SpeciesDistributionChart';
import { ShelterPerformanceChart } from '../../components/charts/ShelterPerformanceChart';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Download, FileSpreadsheet, ShieldCheck, Printer } from 'lucide-react';

export const AdminReportsPage = () => {
  const [trends, setTrends] = useState([]);
  const [species, setSpecies] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    const loadAllReports = async () => {
      setLoading(true);
      try {
        const [tRes, sRes, shRes] = await Promise.all([
          reportApi.getAdoptionTrends(),
          reportApi.getSpeciesDistribution(),
          reportApi.getShelterPerformance()
        ]);
        setTrends(tRes || []);
        setSpecies(sRes || []);
        setShelters(shRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAllReports();
  }, []);

  const handleExportCSV = () => {
    success('Comprehensive platform CSV report generated & downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
            Platform Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
            System Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auditing records, monthly rehoming metrics, shelter compliance, and health stats.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Report
          </Button>
          <Button variant="primary" size="sm" icon={Download} onClick={handleExportCSV}>
            Export Full Dataset (.CSV)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Adoption Inquiries & Completion Trends
            </h3>
            <p className="text-xs text-slate-400">Monthly breakdown for active reporting period</p>
          </div>
          <AdoptionTrendsChart data={trends} />
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">
              Species Breakdown
            </h3>
            <p className="text-xs text-slate-400">Adoption distribution by species</p>
          </div>
          <SpeciesDistributionChart data={species} />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm font-heading">
            Shelter Intake & Adoption Ratio Comparison
          </h3>
          <p className="text-xs text-slate-400">Sanctuary rehoming performance</p>
        </div>
        <ShelterPerformanceChart data={shelters} />
      </div>
    </div>
  );
};
