import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_ADOPTION_APPLICATIONS } from '../data/mockData';

const APPLICATIONS_STORAGE_KEY = 'pethaven_applications_db';

const getStoredApps = () => {
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(MOCK_ADOPTION_APPLICATIONS));
    return MOCK_ADOPTION_APPLICATIONS;
  }
  return JSON.parse(stored);
};

const saveStoredApps = (apps) => {
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
};

export const adoptionApi = {
  submitApplication: async (appData) => {
    return safeApiCall(
      () => axiosClient.post('/adoptions/apply', appData),
      () => {
        const apps = getStoredApps();
        const newApp = {
          id: 'app-' + Date.now(),
          ...appData,
          status: 'Pending',
          submittedDate: new Date().toISOString().split('T')[0],
          shelterNotes: 'Application received. Pending administrator review.'
        };
        apps.unshift(newApp);
        saveStoredApps(apps);
        return newApp;
      }
    );
  },

  getMyApplications: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/adoptions/my-applications', { params }),
      () => {
        const apps = getStoredApps();
        if (params.applicantEmail) {
          return apps.filter((a) => a.applicantEmail?.toLowerCase() === params.applicantEmail.toLowerCase());
        }
        return apps;
      }
    );
  },

  getShelterApplications: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/adoptions/shelter', { params }),
      () => {
        let apps = getStoredApps();
        if (params.status && params.status !== 'all') {
          if (params.status === 'pending') {
            apps = apps.filter((a) => a.status === 'Pending' || a.status === 'Under Review');
          } else if (params.status === 'approved' || params.status === 'confirmed') {
            apps = apps.filter((a) => a.status === 'Approved' || a.status === 'Confirmed');
          }
        }
        return apps;
      }
    );
  },

  getOwnerApplications: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/adoptions/owner', { params }),
      () => {
        const apps = getStoredApps();
        const normEmail = params.ownerEmail?.toLowerCase();
        let list = apps;

        if (normEmail || params.ownerId) {
          list = list.filter((a) => {
            const matchEmail = normEmail && a.ownerEmail?.toLowerCase() === normEmail;
            const matchId = params.ownerId && a.ownerId === params.ownerId;
            return matchEmail || matchId;
          });
        }

        if (params.confirmedOnly !== false) {
          list = list.filter((a) => a.status === 'Approved' || a.status === 'Confirmed');
        }

        // If list is empty in fallback for demo owner, return approved apps
        if (list.length === 0 && (!normEmail || normEmail.includes('owner'))) {
          return apps.filter((a) => a.status === 'Approved' || a.status === 'Confirmed');
        }

        return list;
      }
    );
  },

  getApplicationById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/adoptions/${id}`),
      () => {
        const apps = getStoredApps();
        return apps.find((a) => a.id === id) || apps[0];
      }
    );
  },

  updateStatus: async (id, status, shelterNotes = '') => {
    return safeApiCall(
      () => axiosClient.patch(`/adoptions/${id}/status`, { status, shelterNotes }),
      () => {
        const apps = getStoredApps();
        const idx = apps.findIndex((a) => a.id === id);
        const normalizedStatus = (status === 'Confirm' || status === 'Confirmed') ? 'Approved' : ((status === 'Cancel' || status === 'Cancelled') ? 'Rejected' : status);
        if (idx !== -1) {
          apps[idx] = {
            ...apps[idx],
            status: normalizedStatus,
            shelterNotes: shelterNotes || apps[idx].shelterNotes
          };
          saveStoredApps(apps);
          return apps[idx];
        }
        return { id, status: normalizedStatus, shelterNotes };
      }
    );
  }
};
