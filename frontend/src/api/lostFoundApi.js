import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_LOST_FOUND } from '../data/mockData';

const LOST_FOUND_STORAGE_KEY = 'pethaven_lost_found_db';

const getStoredReports = () => {
  const stored = localStorage.getItem(LOST_FOUND_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(MOCK_LOST_FOUND));
    return MOCK_LOST_FOUND;
  }
  return JSON.parse(stored);
};

const saveStoredReports = (list) => {
  localStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(list));
};

export const lostFoundApi = {
  getReports: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/lost-found', { params }),
      () => {
        let list = getStoredReports();
        if (params.type && params.type !== 'All') {
          list = list.filter((r) => r.type.toLowerCase() === params.type.toLowerCase());
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(
            (r) =>
              r.petName?.toLowerCase().includes(q) ||
              r.breed?.toLowerCase().includes(q) ||
              r.lastSeenLocation?.toLowerCase().includes(q) ||
              r.description?.toLowerCase().includes(q)
          );
        }
        return list;
      }
    );
  },

  createReport: async (reportData) => {
    return safeApiCall(
      () => axiosClient.post('/lost-found', reportData),
      () => {
        const list = getStoredReports();
        const newReport = {
          id: 'lf-' + Date.now(),
          ...reportData,
          status: 'Active',
          lastSeenDate: reportData.lastSeenDate || new Date().toISOString().split('T')[0]
        };
        list.unshift(newReport);
        saveStoredReports(list);
        return newReport;
      }
    );
  },

  getReportById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/lost-found/${id}`),
      () => {
        const list = getStoredReports();
        return list.find((r) => r.id === id || r.customId === id) || list[0];
      }
    );
  },

  deleteReport: async (id) => {
    return safeApiCall(
      () => axiosClient.delete(`/lost-found/${id}`),
      () => {
        let list = getStoredReports();
        list = list.filter((r) => r.id !== id && r.customId !== id);
        saveStoredReports(list);
        return { success: true, message: 'Pet report deleted successfully' };
      }
    );
  },

  updateStatus: async (id, status) => {
    return safeApiCall(
      () => axiosClient.patch(`/lost-found/${id}/status`, { status }),
      () => {
        const list = getStoredReports();
        const index = list.findIndex((r) => r.id === id || r.customId === id);
        if (index !== -1) {
          list[index] = { ...list[index], status };
          saveStoredReports(list);
          return list[index];
        }
        return { success: true };
      }
    );
  }
};
