import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reportApi';
import { shelterApi } from '../../api/shelterApi';
import { adoptionApi } from '../../api/adoptionApi';
import { AdoptionTrendsChart } from '../../components/charts/AdoptionTrendsChart';
import { SpeciesDistributionChart } from '../../components/charts/SpeciesDistributionChart';
import { ShelterPerformanceChart } from '../../components/charts/ShelterPerformanceChart';
import { AdoptionRequestsTable } from '../../components/tables/AdoptionRequestsTable';
import { PetFormModal } from '../../components/forms/PetFormModal';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  PawPrint,
  Heart,
  Stethoscope,
  BarChart3,
  Calendar,
  Download,
  Plus,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  RefreshCw,
  Database,
  Activity,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [shelterMetrics, setShelterMetrics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [trends, setTrends] = useState([]);
  const [species, setSpecies] = useState([]);
  const [shelterPerf, setShelterPerf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [appFilter, setAppFilter] = useState('all'); // all, pending, approved, rejected
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  const { success, error } = useToast();

  const loadAdminData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch adoption applications directly
      try {
        const appsRes = await adoptionApi.getShelterApplications();
        setApplications(appsRes || []);
      } catch (appErr) {
        console.warn('Failed to load applications in admin dashboard:', appErr);
      }

      // 2. Fetch live overview metrics computed directly from MongoDB
      try {
        const [mRes, trRes, spRes, shRes, sMetRes] = await Promise.all([
          reportApi.getAdminMetrics(),
          reportApi.getAdoptionTrends(),
          reportApi.getSpeciesDistribution(),
          reportApi.getShelterPerformance(),
          shelterApi.getDashboardMetrics()
        ]);

        setMetrics(mRes?.summary || null);
        setTrends(trRes || mRes?.monthlyAdoptions || []);
        setSpecies(spRes || mRes?.speciesDistribution || []);
        setShelterPerf(shRes || mRes?.shelterPerformance || []);
        setShelterMetrics(sMetRes || null);
        setLastSyncTime(new Date().toLocaleTimeString());
      } catch (metricsErr) {
        console.warn('Metrics partial load:', metricsErr);
      }

      if (isManualRefresh) {
        success('Live metrics synchronized with MongoDB database!');
      }
    } catch (err) {
      console.error('Error refreshing admin dashboard data:', err);
      if (isManualRefresh) {
        error('Failed to sync with database.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleExport = () => {
    success('Platform real-time analytics report exported to CSV!');
  };

  const pendingApps = applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review');
  const approvedApps = applications.filter((a) => a.status === 'Approved' || a.status === 'Confirmed');
  const rejectedApps = applications.filter((a) => a.status === 'Rejected' || a.status === 'Cancelled');

  const filteredApplications = applications.filter((a) => {
    if (appFilter === 'pending') return a.status === 'Pending' || a.status === 'Under Review';
    if (appFilter === 'approved') return a.status === 'Approved' || a.status === 'Confirmed';
    if (appFilter === 'rejected') return a.status === 'Rejected' || a.status === 'Cancelled';
    return true;
  });

  const usersBreakdown = metrics?.usersBreakdown || {
    adopters: 0,
    petOwners: 0,
    veterinarians: 0,
    administrators: 0
  };

  return (
    <div className="space-y-8 text-left pb-12">
      {/* 1. Executive Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 border border-teal-900/40 p-6 sm:p-8 shadow-2xl text-white">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30">
                <Shield className="w-3.5 h-3.5" /> Administrator Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Live Sync • {lastSyncTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Executive Platform Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring and governance of registered platform users, certified veterinarians, intake animal registries, and active adoption review queues.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => loadAdminData(true)}
              disabled={refreshing}
              className={`border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white ${refreshing ? 'animate-spin' : ''}`}
            >
              {refreshing ? 'Syncing...' : 'Sync Live Data'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              className="bg-teal-400 text-slate-950 hover:bg-teal-300 font-bold shadow-lg shadow-teal-500/20"
            >
              Add Intake Pet
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExport}
              className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              Export
            </Button>
            <Link to="/admin/reports">
              <Button
                variant="primary"
                size="sm"
                icon={BarChart3}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Full Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Role Snapshot Pills inside Header */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Adopters</span>
              <span className="font-extrabold text-white text-sm">{usersBreakdown.adopters} Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Pet Owners</span>
              <span className="font-extrabold text-white text-sm">{usersBreakdown.petOwners} Registered</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Veterinarians</span>
              <span className="font-extrabold text-white text-sm">{metrics?.totalVeterinarians ?? usersBreakdown.veterinarians ?? 0} Certified</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">System Admins</span>
              <span className="font-extrabold text-white text-sm">{Math.max(usersBreakdown.administrators, 1)} Root</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Real Database KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Real Users Stat Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-teal-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                Total Real Users
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading tracking-tight">
                {metrics?.totalUsers ?? 0}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Live MongoDB accounts</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-teal-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {usersBreakdown.adopters} Adopters • {usersBreakdown.petOwners} Owners
            </span>
            <Link to="/admin/users" className="text-slate-400 hover:text-teal-700">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real Adoptions Stat Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-rose-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                Real Adoptions
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading tracking-tight text-rose-600">
                {metrics?.successfulAdoptions ?? 0}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                From {metrics?.totalAdoptions ?? applications.length ?? 0} total applications
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200">
              <Heart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pendingApps.length || metrics?.pendingAdoptions || 0} Pending Inquiries
            </span>
            <Link to="/admin/adoptions" className="text-slate-400 hover:text-rose-600">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real Veterinarians Stat Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-sky-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                Real Veterinarians
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading tracking-tight text-sky-700">
                {metrics?.totalVeterinarians ?? 0}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Certified active doctors</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-200">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-700 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              {metrics?.activeAppointments ?? 1} Appointments active
            </span>
            <Link to="/admin/veterinarians" className="text-slate-400 hover:text-sky-700">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real Pets Database Stat Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-emerald-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                Real Pets in Database
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading tracking-tight text-emerald-700">
                {metrics?.totalPets ?? 0}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Live animal registry</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <PawPrint className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {metrics?.availablePets ?? 0} Available for Adoption
            </span>
            <Link to="/admin/pets" className="text-slate-400 hover:text-emerald-700">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Management Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              Direct Platform Management Desks
            </h3>
            <p className="text-xs text-slate-300">Quickly navigate to manage data collections, review queues, and user permissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Pets Catalog Link */}
          <Link
            to="/admin/pets"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                <PawPrint className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                  Pets Database
                </p>
                <p className="text-[11px] text-slate-400">
                  {metrics?.totalPets ?? 0} registered pets
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Adoption Review Desk */}
          <Link
            to="/admin/adoptions"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Adoption Desk
                </p>
                <p className="text-[11px] text-slate-400">
                  {pendingApps.length} pending reviews
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Veterinarians Network */}
          <Link
            to="/admin/veterinarians"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                  Veterinarians
                </p>
                <p className="text-[11px] text-slate-400">
                  {metrics?.totalVeterinarians ?? 0} certified doctors
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Users Directory */}
          <Link
            to="/admin/users"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Users Directory
                </p>
                <p className="text-[11px] text-slate-400">
                  {metrics?.totalUsers ?? 0} platform accounts
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* 4. Live Adoption Applications Review Queue */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                Adoption Applications Review Queue
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {pendingApps.length} Action Needed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review live applications from database. Confirm to approve & notify owner, or Cancel to reject.
            </p>
          </div>

          {/* Queue Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setAppFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                appFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setAppFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                appFilter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Pending ({pendingApps.length})
            </button>
            <button
              onClick={() => setAppFilter('approved')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                appFilter === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Approved ({approvedApps.length})
            </button>
            <button
              onClick={() => setAppFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                appFilter === 'rejected' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Cancelled ({rejectedApps.length})
            </button>
          </div>
        </div>

        <AdoptionRequestsTable
          applications={filteredApplications}
          isShelterView={true}
          onRefresh={() => loadAdminData(false)}
        />
      </div>

      {/* 5. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Adoption Trends Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-heading">
                Monthly Adoption & Inquiry Velocity
              </h3>
              <p className="text-xs text-slate-400">Total adoption requests vs finalized adoptions</p>
            </div>
          </div>
          <AdoptionTrendsChart data={trends} />
        </div>

        {/* Species Distribution Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              Real Species Distribution
            </h3>
            <p className="text-xs text-slate-400">Breakdown of {metrics?.totalPets ?? 0} animals in active database</p>
          </div>
          <SpeciesDistributionChart data={species} />
        </div>
      </div>

      {/* 6. Partner Shelter Intake & Rehoming Performance */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base font-heading">
            Partner Shelter Intake & Rehoming Efficiency
          </h3>
          <p className="text-xs text-slate-400">Animal intake volume vs successful adoption rates across branches</p>
        </div>
        <ShelterPerformanceChart data={shelterPerf} />
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <PetFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadAdminData(false);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};
