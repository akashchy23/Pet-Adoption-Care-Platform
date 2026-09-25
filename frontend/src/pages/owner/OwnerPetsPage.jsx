import React, { useState, useEffect } from 'react';
import { petApi } from '../../api/petApi';
import { PetCard } from '../../components/cards/PetCard';
import { Button } from '../../components/common/Button';
import { PetFormModal } from '../../components/forms/PetFormModal';
import { EmptyState } from '../../components/common/EmptyState';
import { PawPrint, Plus } from 'lucide-react';

export const OwnerPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await petApi.getPets({ limit: 50 });
      setPets(res.pets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            My Registered Pets
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access medical records, passport IDs, and feeding calculations for your companion animals.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          Register New Pet
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading pet profiles...</p>
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets registered"
          description="Register your pet to manage their digital health passport."
          actionLabel="Register Pet"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      {showAddModal && (
        <PetFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchPets();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};
