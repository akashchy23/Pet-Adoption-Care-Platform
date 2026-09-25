import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { petApi } from '../../api/petApi';
import { adoptionApi } from '../../api/adoptionApi';
import { appointmentApi } from '../../api/appointmentApi';
import { vaccinationApi } from '../../api/vaccinationApi';
import { StatWidgetCard } from '../../components/cards/StatWidgetCard';
import { PetCard } from '../../components/cards/PetCard';
import { AdoptionRequestsTable } from '../../components/tables/AdoptionRequestsTable';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import {
  Heart,
  FileText,
  Calendar,
  Syringe,
  Sparkles,
  ArrowRight,
  PawPrint
} from 'lucide-react';

export const AdopterDashboard = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [favs, apps, apts, vacs] = await Promise.all([
          petApi.getFavorites(),
          adoptionApi.getMyApplications(),
          appointmentApi.getAppointments(),
          vaccinationApi.getVaccinations()
        ]);
        setFavorites(favs || []);
        setApplications(apps || []);
        setAppointments(apts || []);
        setVaccinations(vacs || []);
      } catch (err) {
        console.error('Failed to load adopter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleFavoriteToggle = (petId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== petId && p.customId !== petId));
    } else {
      petApi.getFavorites().then((favs) => setFavorites(favs || []));
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;
  const upcomingApts = appointments.filter((a) => a.status === 'Confirmed').length;
  const upcomingVacs = vaccinations.filter((v) => v.status === 'Upcoming' || v.status === 'Overdue').length;

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
              Adopter Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Hello, {user?.name || 'Alex'}! 🐾
          </h1>
          <p className="text-xs text-slate-300">
            Track your adoption applications, saved companion favorites, and vet appointments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recommendations">
            <Button variant="amber" size="sm" icon={Sparkles}>
              AI Breed Match
            </Button>
          </Link>
          <Link to="/pets">
            <Button variant="primary" size="sm" icon={PawPrint}>
              Browse Pets
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidgetCard
          title="Saved Favorites"
          value={favorites.length}
          icon={Heart}
          accentColor="rose"
          description="Pets on your wishlist"
        />
        <StatWidgetCard
          title="Active Applications"
          value={pendingApps}
          icon={FileText}
          accentColor="amber"
          description="Under shelter review"
        />
        <StatWidgetCard
          title="Upcoming Vet Visits"
          value={upcomingApts}
          icon={Calendar}
          accentColor="teal"
          description="Confirmed consultations"
        />
        <StatWidgetCard
          title="Booster Reminders"
          value={upcomingVacs}
          icon={Syringe}
          accentColor="purple"
          description="Upcoming or overdue"
        />
      </div>

      {/* Applications Tracking Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">
              My Adoption Applications
            </h3>
            <p className="text-xs text-slate-500">Real-time status updates from animal sanctuaries</p>
          </div>
          <Link
            to="/adopter/applications"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AdoptionRequestsTable applications={applications.slice(0, 3)} />
      </div>

      {/* Favorite Pets Preview */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Favorite Pets Saved
            </h3>
            <Link
              to="/adopter/favorites"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>Manage Favorites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.slice(0, 3).map((pet) => (
              <PetCard
                key={pet.id || pet.customId}
                pet={pet}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
