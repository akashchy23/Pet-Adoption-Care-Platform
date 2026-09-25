import axiosClient from './axiosClient';
import { MOCK_COMMUNITY_POSTS } from '../data/mockData';

export const communityApi = {
  // Get all community posts/reviews
  getPosts: async (params = {}) => {
    try {
      const response = await axiosClient.get('/community', { params });
      return response.data || response || [];
    } catch (error) {
      console.warn('[CommunityApi] Falling back to mock posts:', error);
      return MOCK_COMMUNITY_POSTS;
    }
  },

  // Create new post/review
  createPost: async (postData) => {
    const payload = {
      userId: postData.userId || null,
      userEmail: postData.userEmail || null,
      title: postData.title || (postData.content ? postData.content.substring(0, 40) + '...' : 'Community Post'),
      comment: postData.content || postData.comment || '',
      userRole: postData.userRole || postData.role || 'Adopter',
      userName: postData.authorName || postData.userName || 'Community Member',
      userAvatar: postData.authorAvatar || postData.userAvatar || null,
      category: postData.category || 'General',
      imageUrl: postData.imageUrl || null,
      targetType: postData.targetType || 'General',
      targetId: postData.targetId || null,
      rating: postData.rating || 5
    };
    try {
      const response = await axiosClient.post('/community', payload);
      return response.data || response;
    } catch (error) {
      console.error('[CommunityApi] Error creating post:', error);
      throw error;
    }
  },

  // Toggle like
  toggleLike: async (id) => {
    try {
      const response = await axiosClient.post(`/community/${id}/like`);
      return response.data || response;
    } catch (error) {
      console.error('[CommunityApi] Like error:', error);
      throw error;
    }
  },

  // Add comment with user role
  addComment: async (postId, { text, userRole, userName, userAvatar, userId }) => {
    const payload = {
      userId: userId || null,
      text,
      userRole: userRole || 'Adopter',
      userName: userName || 'Community Member',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    try {
      const response = await axiosClient.post(`/community/${postId}/comments`, payload);
      return response.data || response;
    } catch (error) {
      console.error('[CommunityApi] Add comment error:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id) => {
    return await axiosClient.delete(`/community/${id}`);
  }
};
