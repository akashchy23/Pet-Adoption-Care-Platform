import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { healthApi } from '../../api/healthApi';
import { petApi } from '../../api/petApi';
import { HealthPassport } from '../../components/health/HealthPassport';
import { Select } from '../../components/common/Select';
import { ArrowLeft, PawPrint, ShieldCheck } from 'lucide-react';

export const PetHealthPassportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allPets, setAllPets] = useState([]);
  const [activePetId, setActivePetId] = useState(id || 'pet-1');
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all pets for passport switcher
  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const res = await petApi.getPets({ limit: 50 });
        const list = res.pets || [];
        setAllPets(list);
        if (!id && list.length > 0) {
          setActivePetId(list[0].id);
        } else if (id) {
          setActivePetId(id);
        }
      } catch (err) {
        console.error('Failed to load pets for passport:', err);
      }
    };
    fetchPetList();
  }, [id]);

  const loadPassport = async (targetId) => {
    const petToLoad = targetId || activePetId;
    if (!petToLoad) return;
    setLoading(true);
    try {
      const data = await healthApi.getPassportByPetId(petToLoad);
      setPassport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePetId) {
      loadPassport(activePetId);
    }
  }, [activePetId]);

  const handleSelectPet = (newId) => {
    setActivePetId(newId);
    navigate(`/pets/${newId}/health`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <Link
          to={`/pets/${activePetId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pet Profile</span>
        </Link>

        {allPets.length > 1 && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5 text-teal-600" />
              Switch Companion:
            </span>
            <select
              value={activePetId}
              onChange={(e) => handleSelectPet(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-xs cursor-pointer"
            >
              {allPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species} - {p.breed})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading verified digital health passport...</p>
        </div>
      ) : (
        <HealthPassport passport={passport} onRefresh={() => loadPassport(activePetId)} />
      )}
    </div>
  );
};
