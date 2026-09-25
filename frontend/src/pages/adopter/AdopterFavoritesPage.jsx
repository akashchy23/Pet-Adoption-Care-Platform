import React, { useState, useEffect } from 'react';
import { petApi } from '../../api/petApi';
import { PetCard } from '../../components/cards/PetCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdopterFavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await petApi.getFavorites();
      setFavorites(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (petId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== petId && p.customId !== petId));
    } else {
      fetchFavorites();
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          Favorite Pets
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Saved companion profiles for quick adoption application submission.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading saved favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Browse available dogs, cats, rabbits, and birds to bookmark your favorites."
          actionLabel="Browse Available Pets"
          onAction={() => (window.location.href = '/pets')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((pet) => (
            <PetCard
              key={pet.id || pet.customId}
              pet={pet}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
