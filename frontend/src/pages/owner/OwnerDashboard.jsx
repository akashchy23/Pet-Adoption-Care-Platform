import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { petApi } from '../../api/petApi';
import { vaccinationApi } from '../../api/vaccinationApi';
import { appointmentApi } from '../../api/appointmentApi';
import { adoptionApi } from '../../api/adoptionApi';
import { StatWidgetCard } from '../../components/cards/StatWidgetCard';
import { VaccinationCard } from '../../components/cards/VaccinationCard';
import { PetFormModal } from '../../components/forms/PetFormModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Syringe,
  Calendar,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  User,
  Mail,
  Phone,
  Home,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [confirmedAdoptions, setConfirmedAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const ownerEmail = user?.email || '';
      const ownerId = user?.id || '';

      const [petsRes, vacsRes, aptsRes, adoptionsRes] = await Promise.all([
        petApi.getPets({ limit: 12 }),
        vaccinationApi.getVaccinations(),
        appointmentApi.getAppointments(),
        adoptionApi.getOwnerApplications({
          ownerEmail,
          ownerId,
          confirmedOnly: true
        })
      ]);
      setPets(petsRes.pets || []);
      setVaccinations(vacsRes || []);
      setAppointments(aptsRes || []);
      setConfirmedAdoptions(adoptionsRes || []);
    } catch (err) {
      console.error('Failed to load owner dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, [user]);

  const overdueVacs = vaccinations.filter((v) => v.status === 'Overdue');
  const upcomingApts = appointments.filter((a) => a.status === 'Confirmed');

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
              Pet Owner Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Database Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Welcome, {user?.name || 'Sarah'}! 🐾
          </h1>
          <p className="text-xs text-slate-300">
            Manage your registered pets in database, track confirmed adoptions from admin, and consult certified vets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold"
          >
            Register New Pet
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadOwnerData}
            isLoading={loading}
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatWidgetCard
          title="Registered Pets"
          value={pets.length}
          icon={PawPrint}
          accentColor="teal"
          description="Active pet profiles"
        />
        <StatWidgetCard
          title="Confirmed Adoptions"
          value={confirmedAdoptions.length}
          icon={HeartHandshake}
          accentColor="emerald"
          description="Approved by administrator"
        />
        <StatWidgetCard
          title="Vaccine Alerts"
          value={overdueVacs.length}
          icon={Syringe}
          accentColor={overdueVacs.length > 0 ? 'rose' : 'emerald'}
          description={overdueVacs.length > 0 ? 'Booster overdue' : 'All up to date'}
        />
        <StatWidgetCard
          title="Upcoming Appointments"
          value={upcomingApts.length}
          icon={Calendar}
          accentColor="amber"
          description="Scheduled clinic visits"
        />
      </div>

      {/* Confirmed Adoption Requests from Admin Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-heading">
                Confirmed Adoption Requests (Approved by Admin)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {confirmedAdoptions.length} Confirmed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adopters whose applications were confirmed and approved by the platform administrator for your registered pets
            </p>
          </div>
        </div>

        {confirmedAdoptions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
            <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No confirmed adoptions yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              When an adopter submits an adoption request and the administrator confirms it, the adopter's full contact and handover details will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmedAdoptions.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 border border-emerald-200/80 shadow-sm space-y-3 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.petImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&auto=format&fit=crop&q=80'}
                      alt={app.petName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.petName}</h4>
                      <p className="text-xs text-slate-500">{app.petBreed}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-emerald-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Approved Adopter:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <User className="w-3 h-3 text-teal-600" />
                      {app.applicantName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-teal-800">{app.applicantEmail}</span>
                  </div>
                  {app.applicantPhone && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-700 font-semibold">{app.applicantPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Home Environment:</span>
                    <span className="text-slate-700">{app.homeType}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Submission Date:</span>
                    <span className="text-slate-700 font-medium">{formatDate(app.submittedDate)}</span>
                  </div>
                </div>

                {app.shelterNotes && (
                  <p className="text-[11px] text-emerald-900 bg-emerald-100/60 p-2 rounded-lg italic">
                    <strong>Admin Verification:</strong> {app.shelterNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Pets Quick Passport Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">
              My Pets & Digital Health Passports
            </h3>
            <p className="text-xs text-slate-500">Access verified microchip data and medical timelines</p>
          </div>
          <Link
            to="/owner/pets"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>View All Pets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={pet.primaryImage}
                  alt={pet.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base font-heading">{pet.name}</h4>
                  <p className="text-xs text-slate-500">{pet.breed} • {pet.age}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Passport Active
                  </span>
                </div>
              </div>

              <Link to={`/pets/${pet.id}/health`}>
                <Button variant="outline" size="sm" icon={Activity}>
                  Health Passport
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Vaccine Reminders */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Vaccination Booster Radar
            </h3>
            <p className="text-xs text-slate-500">Upcoming immunizations for your companion</p>
          </div>
          <Link
            to="/owner/vaccinations"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaccinations.slice(0, 2).map((vac) => (
            <VaccinationCard key={vac.id} vaccination={vac} />
          ))}
        </div>
      </div>

      {showAddModal && (
        <PetFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadOwnerData();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};
