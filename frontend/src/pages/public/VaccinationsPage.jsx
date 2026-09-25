import React, { useState, useEffect } from 'react';
import { vaccinationApi } from '../../api/vaccinationApi';
import { VaccinationCard } from '../../components/cards/VaccinationCard';
import { VaccinationsTable } from '../../components/tables/VaccinationsTable';
import { TabView } from '../../components/common/TabView';
import { Syringe, ShieldAlert, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const VaccinationsPage = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [loading, setLoading] = useState(true);

  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const data = await vaccinationApi.getVaccinations();
      setVaccinations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const overdueCount = vaccinations.filter((v) => v.status === 'Overdue').length;
  const upcomingCount = vaccinations.filter((v) => v.status === 'Upcoming').length;
  const completedCount = vaccinations.filter((v) => v.status === 'Completed').length;

  const filteredList = vaccinations.filter((v) => {
    if (activeTab === 'overdue') return v.status === 'Overdue';
    if (activeTab === 'upcoming') return v.status === 'Upcoming';
    if (activeTab === 'completed') return v.status === 'Completed';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Records', count: vaccinations.length },
    { id: 'overdue', label: 'Overdue / Urgent', count: overdueCount },
    { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { id: 'completed', label: 'Completed', count: completedCount }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
            Preventive Immunology
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
            Vaccination & Booster Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Monitor rabies compliance, core DHPP/FVRCP boosters, and receive automated clinic reminders.
          </p>
        </div>

        <Link to="/vets">
          <Button variant="primary" size="md" icon={Calendar}>
            Schedule Vaccine Booster
          </Button>
        </Link>
      </div>

      {/* Urgent Alert Banner if overdue items exist */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">You have {overdueCount} overdue vaccination booster!</h4>
              <p className="text-xs text-rose-700">
                Ensure full immunization protection by booking a consultation with your registered veterinarian.
              </p>
            </div>
          </div>
          <Link to="/vets">
            <Button variant="danger" size="sm">
              Book Today
            </Button>
          </Link>
        </div>
      )}

      {/* Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <TabView tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'cards' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading vaccination schedules...</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredList.map((vac) => (
            <VaccinationCard key={vac.id} vaccination={vac} />
          ))}
        </div>
      ) : (
        <VaccinationsTable vaccinations={filteredList} />
      )}
    </div>
  );
};
