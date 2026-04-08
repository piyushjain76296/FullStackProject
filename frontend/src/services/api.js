import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  syncPosts: async () => {
    const response = await apiClient.post('/posts/sync');
    return response.data;
  }
};
