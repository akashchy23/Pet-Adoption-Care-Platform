import axiosClient, { safeApiCall } from './axiosClient';
import { MOCK_LEARNING_ARTICLES } from '../data/mockData';

export const learningApi = {
  getArticles: async (params = {}) => {
    return safeApiCall(
      () => axiosClient.get('/learning/articles', { params }),
      () => {
        let list = [...MOCK_LEARNING_ARTICLES];
        if (params.category && params.category !== 'All Categories') {
          list = list.filter((a) => a.category.toLowerCase() === params.category.toLowerCase());
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.excerpt.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q)
          );
        }
        return list;
      }
    );
  },

  getArticleById: async (id) => {
    return safeApiCall(
      () => axiosClient.get(`/learning/articles/${id}`),
      () => {
        return MOCK_LEARNING_ARTICLES.find((a) => a.id === id) || MOCK_LEARNING_ARTICLES[0];
      }
    );
  }
};
