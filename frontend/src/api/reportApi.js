import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_ANALYTICS } from '../data/mockData';

export const reportApi = {
  getAdminMetrics: async () => {
    return safeApiCall(
      () => axiosClient.get('/reports/admin-overview'),
      () => MOCK_ANALYTICS
    );
  },

  getAdoptionTrends: async () => {
    return safeApiCall(
      () => axiosClient.get('/reports/adoption-trends'),
      () => MOCK_ANALYTICS.monthlyAdoptions
    );
  },

  getSpeciesDistribution: async () => {
    return safeApiCall(
      () => axiosClient.get('/reports/species-distribution'),
      () => MOCK_ANALYTICS.speciesDistribution
    );
  },

  getShelterPerformance: async () => {
    return safeApiCall(
      () => axiosClient.get('/reports/shelter-performance'),
      () => MOCK_ANALYTICS.shelterPerformance
    );
  }
};
