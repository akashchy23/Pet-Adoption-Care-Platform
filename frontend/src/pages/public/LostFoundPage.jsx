import React, { useState, useEffect } from 'react';
import { lostFoundApi } from '../../api/lostFoundApi';
import { LostFoundCard } from '../../components/cards/LostFoundCard';
import { LostFoundReportModal } from '../../components/forms/LostFoundReportModal';
import { TabView } from '../../components/common/TabView';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { MapPin, Search, PlusCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const LostFoundPage = () => {
  const { success, error: toastError } = useToast();
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reportModalType, setReportModalType] = useState(null); // 'Lost' | 'Found' | null

  const debouncedSearch = useDebounce(search, 300);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await lostFoundApi.getReports({
        type: activeTab,
        search: debouncedSearch
      });
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeTab, debouncedSearch]);

  const handleDeleteReport = async (reportId) => {
    try {
      // Optimistic update
      setReports((prev) => prev.filter((r) => r.id !== reportId && r.customId !== reportId));
      await lostFoundApi.deleteReport(reportId);
      success('Pet report has been removed successfully!');
      fetchReports();
    } catch (err) {
      console.error('Failed to delete report:', err);
      toastError(typeof err === 'string' ? err : err?.message || 'Failed to delete report.');
      fetchReports();
    }
  };

  const lostCount = reports.filter((r) => r.type === 'Lost').length;
  const foundCount = reports.filter((r) => r.type === 'Found').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-rose-600">
            Emergency Community Radar
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
            Lost & Found Pet Recovery
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Report missing pets, search neighborhood sightings, and connect directly with finders.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="danger"
            size="md"
            icon={AlertTriangle}
            onClick={() => setReportModalType('Lost')}
          >
            Report Lost Pet
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={PlusCircle}
            onClick={() => setReportModalType('Found')}
          >
            Report Found Pet
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <TabView
          tabs={[
            { id: 'All', label: 'All Alerts', count: reports.length },
            { id: 'Lost', label: 'Lost Pets (Searching)' },
            { id: 'Found', label: 'Found Pets (Reported)' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="w-full sm:w-80">
          <Input
            icon={Search}
            placeholder="Search by neighborhood, breed, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Scanning community pet reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No lost/found reports found"
          description="There are currently no active reports matching your search filter."
          actionLabel="Report a Pet"
          onAction={() => setReportModalType('Lost')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((rep) => (
            <LostFoundCard
              key={rep.id || rep.customId}
              report={rep}
              onDelete={handleDeleteReport}
            />
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportModalType && (
        <LostFoundReportModal
          isOpen={!!reportModalType}
          initialType={reportModalType}
          onClose={() => setReportModalType(null)}
          onSuccess={() => {
            fetchReports();
            setReportModalType(null);
          }}
        />
      )}
    </div>
  );
};
