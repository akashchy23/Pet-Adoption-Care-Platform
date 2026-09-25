import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_SHELTERS } from '../data/mockData';
import { petApi } from './petApi';
import { adoptionApi } from './adoptionApi';

const SHELTERS_STORAGE_KEY = 'pethaven_shelters_db';

const getStoredShelters = () => {
  const stored = localStorage.getItem(SHELTERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SHELTERS_STORAGE_KEY, JSON.stringify(MOCK_SHELTERS));
    return MOCK_SHELTERS;
  }
  return JSON.parse(stored);
};

const saveStoredShelters = (list) => {
  localStorage.setItem(SHELTERS_STORAGE_KEY, JSON.stringify(list));
};

export const shelterApi = {
  getShelters: async () => {
    return safeApiCall(
      () => axiosClient.get('/shelters'),
      () => getStoredShelters()
    );
  },

  getShelterById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/shelters/${id}`),
      () => {
        const shelters = getStoredShelters();
        return shelters.find((s) => s.id === id) || shelters[0];
      }
    );
  },

  createShelter: async (shelterData) => {
    return safeApiCall(
      () => axiosClient.post('/shelters', shelterData),
      () => {
        const shelters = getStoredShelters();
        const newShelter = {
          id: 'shelter-' + Date.now(),
          ...shelterData,
          currentPets: Number(shelterData.currentPets) || 12,
          capacity: Number(shelterData.capacity) || 50,
          adoptionsThisYear: Number(shelterData.adoptionsThisYear) || 28
        };
        shelters.unshift(newShelter);
        saveStoredShelters(shelters);
        return newShelter;
      }
    );
  },

  updateShelter: async (id, shelterData) => {
    return safeApiCall(
      () => axiosClient.put(`/shelters/${id}`, shelterData),
      () => {
        const shelters = getStoredShelters();
        const idx = shelters.findIndex((s) => s.id === id);
        if (idx !== -1) {
          shelters[idx] = { ...shelters[idx], ...shelterData };
          saveStoredShelters(shelters);
          return shelters[idx];
        }
        return shelterData;
      }
    );
  },

  deleteShelter: async (id) => {
    return safeApiCall(
      () => axiosClient.delete(`/shelters/${id}`),
      () => {
        let shelters = getStoredShelters();
        shelters = shelters.filter((s) => s.id !== id);
        saveStoredShelters(shelters);
        return { success: true, message: 'Shelter removed successfully' };
      }
    );
  },

  getDashboardMetrics: async () => {
    return safeApiCall(
      () => axiosClient.get('/shelters/dashboard-metrics'),
      async () => {
        const petsRes = await petApi.getPets({ limit: 100 });
        const apps = await adoptionApi.getShelterApplications();
        
        const totalPets = petsRes.pets.length;
        const availablePets = petsRes.pets.filter((p) => p.status === 'Available').length;
        const adoptedPets = petsRes.pets.filter((p) => p.status === 'Adopted').length;
        const pendingApplications = apps.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;

        return {
          totalPets,
          availablePets,
          adoptedPets,
          pendingApplications,
          vaccinationCompliance: '94%',
          monthlyAdoptions: 18,
          capacityOccupancy: '65%'
        };
      }
    );
  }
};
