import React, { useState, useEffect } from 'react';
import { petApi } from '../../api/petApi';
import { PetCard } from '../../components/cards/PetCard';
import { PetCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { PET_SPECIES, PET_SIZES, PET_GENDERS } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';

export const PetListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    species: 'All',
    size: 'All',
    gender: 'All',
    status: 'All',
    vaccinated: false,
    sortBy: 'featured',
    page: 1,
    limit: 12
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await petApi.getPets({
        ...filters,
        search: debouncedSearch
      });
      setPets(res.pets || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (petId, isFav) => {
    setPets((prev) =>
      prev.map((p) =>
        (p.id === petId || p.customId === petId) ? { ...p, isFavorite: isFav !== undefined ? isFav : !p.isFavorite } : p
      )
    );
  };

  useEffect(() => {
    fetchPets();
  }, [debouncedSearch, filters.species, filters.size, filters.gender, filters.status, filters.vaccinated, filters.sortBy, filters.page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      species: 'All',
      size: 'All',
      gender: 'All',
      status: 'All',
      vaccinated: false,
      sortBy: 'featured',
      page: 1,
      limit: 8
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Adopt a Pet Companion
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Discover rescue dogs, cats, rabbits, and birds searching for forever homes across verified shelters.
        </p>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5">
            <Input
              icon={Search}
              placeholder="Search by name, breed, or city..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Species */}
          <div className="md:col-span-2">
            <Select
              options={PET_SPECIES}
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
            />
          </div>

          {/* Size */}
          <div className="md:col-span-2">
            <Select
              options={PET_SIZES}
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <Select
              options={[
                { label: 'Featured / Newest', value: 'featured' },
                { label: 'Adoption Fee: Low to High', value: 'fee-asc' },
                { label: 'Adoption Fee: High to Low', value: 'fee-desc' },
                { label: 'Age: Youngest First', value: 'age-asc' }
              ]}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            />
          </div>
        </div>

        {/* Secondary Filter Pills */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Filter Status:</span>
            {['All', 'Available', 'Pending', 'Adopted'].map((st) => (
              <button
                key={st}
                onClick={() => handleFilterChange('status', st)}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  filters.status === st
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}

            <label className="flex items-center gap-1.5 ml-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filters.vaccinated}
                onChange={(e) => handleFilterChange('vaccinated', e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Vaccinated Only</span>
            </label>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-teal-700 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <span className="font-bold text-slate-900">{totalCount}</span> pets found</span>
        <span>Page {filters.page} of {totalPages}</span>
      </div>

      {/* Pet Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <PetCardSkeleton key={i} />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          title="No pets match your criteria"
          description="Try clearing some filters or searching with different keywords."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id || pet.customId} pet={pet} onFavoriteToggle={handleToggleFavorite} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />
    </div>
  );
};
