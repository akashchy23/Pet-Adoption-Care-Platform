import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_PETS } from '../data/mockData';

// Local storage key for persistent mock pet list & favorites across pages
const PETS_STORAGE_KEY = 'pethaven_pets_db';
const FAVORITES_STORAGE_KEY = 'pethaven_favorites_ids';

const getStoredPets = () => {
  const stored = localStorage.getItem(PETS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(MOCK_PETS));
    return MOCK_PETS;
  }
  return JSON.parse(stored);
};

const saveStoredPets = (pets) => {
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
};

const getStoredFavorites = () => {
  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : ['pet-1', 'pet-3'];
};

const saveStoredFavorites = (favs) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
};

export const petApi = {
  getPets: async (params = {}) => {
    const cleanParams = { ...params };
    if (!cleanParams.vaccinated) delete cleanParams.vaccinated;
    if (cleanParams.species === 'All') delete cleanParams.species;
    if (cleanParams.size === 'All') delete cleanParams.size;
    if (cleanParams.gender === 'All') delete cleanParams.gender;
    if (cleanParams.status === 'All') delete cleanParams.status;
    if (!cleanParams.search?.trim()) delete cleanParams.search;

    return safeApiCall(
      async () => {
        const res = await axiosClient.get('/pets', { params: cleanParams });
        const favs = getStoredFavorites();
        if (res && res.pets && Array.isArray(res.pets)) {
          res.pets = res.pets.map((p) => ({
            ...p,
            isFavorite: favs.includes(p.id) || (p.customId && favs.includes(p.customId))
          }));
        }
        return res;
      },
      () => {
        let list = [...getStoredPets()];
        const favs = getStoredFavorites();

        // Filter by Search Query
        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.breed.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.shelterLocation?.toLowerCase().includes(q)
          );
        }

        // Filter by Species
        if (params.species && params.species !== 'All') {
          list = list.filter((p) => p.species.toLowerCase() === params.species.toLowerCase());
        }

        // Filter by Size
        if (params.size && params.size !== 'All') {
          list = list.filter((p) => p.size.toLowerCase() === params.size.toLowerCase());
        }

        // Filter by Gender
        if (params.gender && params.gender !== 'All') {
          list = list.filter((p) => p.gender.toLowerCase() === params.gender.toLowerCase());
        }

        // Filter by Status
        if (params.status && params.status !== 'All') {
          list = list.filter((p) => p.status.toLowerCase() === params.status.toLowerCase());
        }

        // Filter by Vaccination
        if (params.vaccinated === true || params.vaccinated === 'true') {
          list = list.filter((p) => p.vaccinated === true);
        }

        // Sorting
        if (params.sortBy === 'fee-asc') {
          list.sort((a, b) => a.adoptionFee - b.adoptionFee);
        } else if (params.sortBy === 'fee-desc') {
          list.sort((a, b) => b.adoptionFee - a.adoptionFee);
        } else if (params.sortBy === 'age-asc') {
          list.sort((a, b) => a.ageMonths - b.ageMonths);
        } else {
          // Default: Newest/Featured
          list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        const enrichedList = list.map((p) => ({
          ...p,
          isFavorite: favs.includes(p.id)
        }));

        const page = parseInt(params.page, 10) || 1;
        const limit = parseInt(params.limit, 10) || 8;
        const total = enrichedList.length;
        const paginated = enrichedList.slice((page - 1) * limit, page * limit);

        return {
          pets: paginated,
          total,
          page,
          totalPages: Math.ceil(total / limit) || 1
        };
      }
    );
  },

  getPetById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/pets/${id}`),
      () => {
        const pets = getStoredPets();
        const favs = getStoredFavorites();
        const found = pets.find((p) => p.id === id) || pets[0];
        return {
          ...found,
          isFavorite: favs.includes(found.id)
        };
      }
    );
  },

  getFeaturedPets: async () => {
    return safeApiCall(
      () => axiosClient.get('/pets/featured'),
      () => {
        const pets = getStoredPets();
        const favs = getStoredFavorites();
        return pets
          .filter((p) => p.featured || p.status === 'Available')
          .slice(0, 4)
          .map((p) => ({ ...p, isFavorite: favs.includes(p.id) }));
      }
    );
  },

  getFavorites: async () => {
    return safeApiCall(
      async () => {
        const res = await axiosClient.get('/pets/favorites');
        const list = Array.isArray(res) ? res : (res?.data || res?.pets || []);
        const favIds = list.map((p) => p.id || p.customId).filter(Boolean);
        if (favIds.length > 0) {
          saveStoredFavorites(favIds);
        }
        return list.map((p) => ({ ...p, isFavorite: true }));
      },
      () => {
        const pets = getStoredPets();
        const favs = getStoredFavorites();
        return pets
          .filter((p) => favs.includes(p.id) || (p.customId && favs.includes(p.customId)))
          .map((p) => ({ ...p, isFavorite: true }));
      }
    );
  },

  toggleFavorite: async (petId) => {
    return safeApiCall(
      async () => {
        const res = await axiosClient.post(`/pets/${petId}/favorite`);
        let favs = getStoredFavorites();
        if (res?.favoriteIds && Array.isArray(res.favoriteIds)) {
          saveStoredFavorites(res.favoriteIds);
        } else if (res?.isFavorite) {
          if (!favs.includes(petId)) favs.push(petId);
          saveStoredFavorites(favs);
        } else {
          favs = favs.filter((id) => id !== petId);
          saveStoredFavorites(favs);
        }
        return res;
      },
      () => {
        let favs = getStoredFavorites();
        let isFav = false;
        if (favs.includes(petId)) {
          favs = favs.filter((id) => id !== petId);
          isFav = false;
        } else {
          favs.push(petId);
          isFav = true;
        }
        saveStoredFavorites(favs);
        return { isFavorite: isFav, petId };
      }
    );
  },

  createPet: async (petData) => {
    return safeApiCall(
      () => axiosClient.post('/pets', petData),
      () => {
        const pets = getStoredPets();
        const newPet = {
          id: 'pet-' + Date.now(),
          ...petData,
          ageMonths: petData.ageMonths || 12,
          adoptionFee: Number(petData.adoptionFee) || 100,
          status: petData.status || 'Available',
          vaccinated: petData.vaccinated ?? true,
          vaccinationStatus: petData.vaccinationStatus || 'Up to date',
          healthStatus: petData.healthStatus || 'Good',
          galleryImages: petData.primaryImage ? [petData.primaryImage] : [],
          intakeDate: new Date().toISOString().split('T')[0]
        };
        pets.unshift(newPet);
        saveStoredPets(pets);
        return newPet;
      }
    );
  },

  updatePet: async (id, petData) => {
    return safeApiCall(
      () => axiosClient.put(`/pets/${id}`, petData),
      () => {
        const pets = getStoredPets();
        const index = pets.findIndex((p) => p.id === id);
        if (index !== -1) {
          pets[index] = { ...pets[index], ...petData };
          saveStoredPets(pets);
          return pets[index];
        }
        return petData;
      }
    );
  },

  deletePet: async (id) => {
    return safeApiCall(
      () => axiosClient.delete(`/pets/${id}`),
      () => {
        let pets = getStoredPets();
        pets = pets.filter((p) => p.id !== id);
        saveStoredPets(pets);
        return { success: true, message: 'Pet removed successfully' };
      }
    );
  }
};
