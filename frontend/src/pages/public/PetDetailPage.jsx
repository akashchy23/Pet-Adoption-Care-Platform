import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petApi } from '../../api/petApi';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AdoptionApplicationForm } from '../../components/forms/AdoptionApplicationForm';
import { PetCard } from '../../components/cards/PetCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  Heart,
  ShieldCheck,
  Activity,
  MapPin,
  Calendar,
  Building,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

export const PetDetailPage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [similarPets, setSimilarPets] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, info } = useToast();

  useEffect(() => {
    const loadPetDetail = async () => {
      setLoading(true);
      try {
        const petData = await petApi.getPetById(id);
        setPet(petData);
        setSelectedImage(petData.primaryImage);
        setIsFavorite(petData.isFavorite);

        const allPets = await petApi.getPets({ limit: 4 });
        setSimilarPets(allPets.pets?.filter((p) => p.id !== id).slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load pet details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPetDetail();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!pet) return;
    const petIdentifier = pet.id || pet.customId || id;
    const res = await petApi.toggleFavorite(petIdentifier);
    setIsFavorite(res.isFavorite);
    if (res.isFavorite) {
      success(`Added ${pet.name} to favorites!`);
    } else {
      info(`Removed ${pet.name} from favorites.`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopt ${pet.name} on PetHaven`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Pet profile link copied to clipboard!');
    }
  };

  if (loading || !pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading pet information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pet Listings</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Profile</span>
        </button>
      </div>

      {/* Main Pet Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-100">
            <img
              src={selectedImage || pet.primaryImage}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge status={pet.status} size="lg" />
            </div>
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
              aria-label="Toggle favorite"
            >
              <Heart
                className={clsx(
                  'w-5 h-5 transition-colors',
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                )}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {pet.galleryImages && pet.galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pet.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-teal-500 ring-2 ring-teal-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${pet.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Key Facts Pill Grid */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Breed</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{pet.breed}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{pet.age}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender & Size</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{pet.gender} • {pet.size}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Microchip ID</span>
              <p className="font-mono font-bold text-teal-800 text-xs mt-0.5">{pet.microchipId || 'Chipped'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                {pet.name}
              </h1>
              <span className="text-2xl font-black text-teal-700 font-heading">
                {formatCurrency(pet.adoptionFee)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{pet.shelterLocation} • {pet.shelterName}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              icon={Heart}
              onClick={() => setShowApplyModal(true)}
              className="w-full text-base shadow-lg shadow-teal-600/20"
              disabled={pet.status === 'Adopted'}
            >
              {pet.status === 'Adopted' ? 'Pet Adopted' : 'Apply for Adoption'}
            </Button>

            <Link to={`/pets/${pet.id}/health`} className="block w-full">
              <Button
                variant="outline"
                size="md"
                icon={Activity}
                className="w-full"
              >
                View Digital Pet Health Passport
              </Button>
            </Link>
          </div>

          {/* Temperament Traits */}
          {pet.temperament && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personality & Temperament
              </h4>
              <div className="flex flex-wrap gap-2">
                {pet.temperament.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 text-xs font-bold"
                  >
                    ✨ {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio Story */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About {pet.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {pet.description}
            </p>
          </div>

          {/* Shelter Info Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{pet.shelterName}</p>
                <p className="text-xs text-slate-500">Official Partner Animal Sanctuary</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Pets Section */}
      {similarPets.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <h3 className="text-2xl font-extrabold font-heading text-slate-900">
            Other Lovable Pets Available for Adoption
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarPets.map((p) => (
              <PetCard key={p.id} pet={p} />
            ))}
          </div>
        </div>
      )}

      {/* Adoption Application Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Adoption Application for ${pet.name}`}
        subtitle="Complete this application to connect with the shelter adoption team"
        maxWidth="max-w-2xl"
      >
        <AdoptionApplicationForm
          pet={pet}
          onSuccess={() => setShowApplyModal(false)}
          onCancel={() => setShowApplyModal(false)}
        />
      </Modal>
    </div>
  );
};
