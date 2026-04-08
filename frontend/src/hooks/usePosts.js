import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPosts(page);
      
      setPosts(prev => page === 1 ? data.data.data : [...prev, ...data.data.data]);
      setMeta(data.data.meta);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const syncPosts = async () => {
    try {
      setLoading(true);
      await api.syncPosts();
      await fetchPosts(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync posts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  return { posts, meta, loading, error, fetchPosts, syncPosts };
};
