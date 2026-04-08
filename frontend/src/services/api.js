import axios from 'axios';

const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = RAW_URL.replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
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
