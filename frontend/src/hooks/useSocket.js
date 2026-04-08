import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = (debouncedQuery) => {
  const [socket, setSocket] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('search:results', (data) => {
      setSearchResults(data);
      setIsSearching(false);
    });

    newSocket.on('search:error', () => {
      setIsSearching(false);
    });

    newSocket.on('user:typing', (status) => {
      setIsSomeoneTyping(status);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && debouncedQuery) {
      setIsSearching(true);
      socket.emit('search:query', debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, socket]);

  const emitTyping = useCallback((isTyping) => {
    if (socket) {
      socket.emit(isTyping ? 'typing:start' : 'typing:stop');
    }
  }, [socket]);

  return { searchResults, isSearching, isSomeoneTyping, emitTyping };
};
