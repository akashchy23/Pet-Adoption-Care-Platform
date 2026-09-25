import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_VACCINATIONS } from '../data/mockData';

const VACCINES_STORAGE_KEY = 'pethaven_vaccines_db';

const getStoredVaccines = () => {
  const stored = localStorage.getItem(VACCINES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(VACCINES_STORAGE_KEY, JSON.stringify(MOCK_VACCINATIONS));
    return MOCK_VACCINATIONS;
  }
  return JSON.parse(stored);
};

const saveStoredVaccines = (list) => {
  localStorage.setItem(VACCINES_STORAGE_KEY, JSON.stringify(list));
};

export const vaccinationApi = {
  getVaccinations: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/vaccinations', { params }),
      () => {
        let list = getStoredVaccines();
        if (params.petId) {
          list = list.filter((v) => v.petId === params.petId);
        }
        if (params.status && params.status !== 'All') {
          list = list.filter((v) => v.status.toLowerCase() === params.status.toLowerCase());
        }
        return list;
      }
    );
  },

  getReminders: async () => {
    return safeApiCall(
      () => axiosClient.get('/vaccinations/reminders'),
      () => {
        const list = getStoredVaccines();
        return list.filter((v) => v.status === 'Upcoming' || v.status === 'Overdue');
      }
    );
  },

  createVaccination: async (data) => {
    return safeApiCall(
      () => axiosClient.post('/vaccinations', data),
      () => {
        const list = getStoredVaccines();
        const newVac = {
          id: 'vac-' + Date.now(),
          ...data,
          status: data.status || 'Completed'
        };
        list.unshift(newVac);
        saveStoredVaccines(list);
        return newVac;
      }
    );
  },

  updateVaccination: async (id, data) => {
    return safeApiCall(
      () => axiosClient.put(`/vaccinations/${id}`, data),
      () => {
        const list = getStoredVaccines();
        const idx = list.findIndex((v) => v.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          saveStoredVaccines(list);
          return list[idx];
        }
        return data;
      }
    );
  }
};
