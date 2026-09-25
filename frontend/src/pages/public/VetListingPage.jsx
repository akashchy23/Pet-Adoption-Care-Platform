import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { VetCard } from '../../components/cards/VetCard';
import { VetBookingModal } from '../../components/forms/VetBookingModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { VET_SPECIALIZATIONS } from '../../utils/constants';
import { Search, Stethoscope, ShieldCheck } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const VetListingPage = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVetForBooking, setSelectedVetForBooking] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    specialization: 'All Specializations'
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchVets = async () => {
    setLoading(true);
    try {
      const data = await appointmentApi.getVets({
        search: debouncedSearch,
        specialization: filters.specialization
      });
      setVets(data || []);
    } catch (err) {
      console.error('Failed to load vets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, [debouncedSearch, filters.specialization]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div>
        <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
          Professional Animal Healthcare
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
          Find Certified Veterinarians & Clinics
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Search accredited veterinary practitioners for preventive wellness exams, orthopedic surgery, exotic pets, and vaccinations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-7">
          <Input
            icon={Search}
            placeholder="Search by veterinarian name, clinic, or address..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="md:col-span-5">
          <Select
            options={VET_SPECIALIZATIONS}
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          />
        </div>
      </div>

      {/* Vet Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Finding certified clinics...</p>
        </div>
      ) : vets.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No veterinarians matched"
          description="Try broadening your search term or selecting 'All Specializations'."
          actionLabel="Clear Filters"
          onAction={() => setFilters({ search: '', specialization: 'All Specializations' })}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <VetCard
              key={vet.id}
              vet={vet}
              onBookClick={(v) => setSelectedVetForBooking(v)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedVetForBooking && (
        <VetBookingModal
          isOpen={!!selectedVetForBooking}
          onClose={() => setSelectedVetForBooking(null)}
          vet={selectedVetForBooking}
          onSuccess={() => setSelectedVetForBooking(null)}
        />
      )}
    </div>
  );
};
