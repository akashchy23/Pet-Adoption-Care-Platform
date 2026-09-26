import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_VETS, MOCK_APPOINTMENTS } from '../data/mockData';

const APPOINTMENTS_STORAGE_KEY = 'pethaven_appointments_db';
const VETS_STORAGE_KEY = 'pethaven_vets_db';

const getStoredAppointments = () => {
  const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(MOCK_APPOINTMENTS));
    return MOCK_APPOINTMENTS;
  }
  return JSON.parse(stored);
};

const saveStoredAppointments = (list) => {
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list));
};

const getStoredVets = () => {
  const stored = localStorage.getItem(VETS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(VETS_STORAGE_KEY, JSON.stringify(MOCK_VETS));
    return MOCK_VETS;
  }
  return JSON.parse(stored);
};

const saveStoredVets = (list) => {
  localStorage.setItem(VETS_STORAGE_KEY, JSON.stringify(list));
};

export const appointmentApi = {
  getVets: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/vets', { params }),
      () => {
        let list = getStoredVets();
        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(
            (v) =>
              v.name.toLowerCase().includes(q) ||
              v.clinicName.toLowerCase().includes(q) ||
              v.specialization.toLowerCase().includes(q)
          );
        }
        if (params.specialization && params.specialization !== 'All Specializations') {
          list = list.filter((v) => v.specialization.includes(params.specialization));
        }
        return list;
      }
    );
  },

  getVetById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/vets/${id}`),
      () => {
        const list = getStoredVets();
        return list.find((v) => v.id === id) || list[0];
      }
    );
  },

  createVet: async (vetData) => {
    return safeApiCall(
      () => axiosClient.post('/vets', vetData),
      () => {
        const vets = getStoredVets();
        const newVet = {
          id: 'vet-' + Date.now(),
          ...vetData,
          rating: Number(vetData.rating) || 4.9,
          reviewCount: Number(vetData.reviewCount) || 12,
          avatar: vetData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
        };
        vets.unshift(newVet);
        saveStoredVets(vets);
        return newVet;
      }
    );
  },

  updateVet: async (id, vetData) => {
    return safeApiCall(
      () => axiosClient.put(`/vets/${id}`, vetData),
      () => {
        const vets = getStoredVets();
        const idx = vets.findIndex((v) => v.id === id);
        if (idx !== -1) {
          vets[idx] = { ...vets[idx], ...vetData };
          saveStoredVets(vets);
          return vets[idx];
        }
        return vetData;
      }
    );
  },

  deleteVet: async (id) => {
    return safeApiCall(
      () => axiosClient.delete(`/vets/${id}`),
      () => {
        let vets = getStoredVets();
        vets = vets.filter((v) => v.id !== id);
        saveStoredVets(vets);
        return { success: true, message: 'Veterinarian removed successfully' };
      }
    );
  },

  getAppointments: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/appointments', { params }),
      () => {
        let list = getStoredAppointments();
        if (params.vetEmail || params.vetName || params.vetId) {
          list = list.filter((a) => {
            const matchEmail = params.vetEmail && a.vetEmail && a.vetEmail.toLowerCase() === params.vetEmail.toLowerCase();
            const cleanName = params.vetName ? params.vetName.replace(/Dr\.\s*/i, '').trim().toLowerCase() : '';
            const matchName = cleanName && a.vetName && a.vetName.toLowerCase().includes(cleanName);
            const matchId = params.vetId && (a.vetId === params.vetId || a.id === params.vetId);
            return matchEmail || matchName || matchId;
          });
        }
        if (params.ownerId) {
          list = list.filter((a) => a.ownerId === params.ownerId);
        }
        if (params.status) {
          list = list.filter((a) => a.status.toLowerCase() === params.status.toLowerCase());
        }
        return list;
      }
    );
  },

  bookAppointment: async (data) => {
    return safeApiCall(
      () => axiosClient.post('/appointments', data),
      () => {
        const list = getStoredAppointments();
        const newApt = {
          id: 'apt-' + Date.now(),
          ...data,
          status: data.status || 'Confirmed'
        };
        list.unshift(newApt);
        saveStoredAppointments(list);
        return newApt;
      }
    );
  },

  updateStatus: async (id, status) => {
    return safeApiCall(
      () => axiosClient.patch(`/appointments/${id}/status`, { status }),
      () => {
        const list = getStoredAppointments();
        const idx = list.findIndex((a) => a.id === id);
        if (idx !== -1) {
          list[idx].status = status;
          saveStoredAppointments(list);
          return list[idx];
        }
        return { id, status };
      }
    );
  },

  cancelAppointment: async (id) => {
    return safeApiCall(
      () => axiosClient.patch(`/appointments/${id}/cancel`),
      () => {
        const list = getStoredAppointments();
        const idx = list.findIndex((a) => a.id === id);
        if (idx !== -1) {
          list[idx].status = 'Cancelled';
          saveStoredAppointments(list);
          return list[idx];
        }
        return { id, status: 'Cancelled' };
      }
    );
  },

  rescheduleAppointment: async (id, date, time) => {
    return safeApiCall(
      () => axiosClient.patch(`/appointments/${id}/reschedule`, { date, time }),
      () => {
        const list = getStoredAppointments();
        const idx = list.findIndex((a) => a.id === id);
        if (idx !== -1) {
          list[idx].date = date;
          list[idx].time = time;
          list[idx].status = 'Confirmed';
          saveStoredAppointments(list);
          return list[idx];
        }
        return { id, date, time };
      }
    );
  }
};
