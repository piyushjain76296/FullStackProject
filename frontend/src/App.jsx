import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SearchBar } from './components/SearchBar';
import { PostCard } from './components/PostCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { useDebounce } from './hooks/useDebounce';
import { useSocket } from './hooks/useSocket';
import { usePosts } from './hooks/usePosts';
import { Database } from 'lucide-react';
import './index.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const { searchResults, isSearching, isSomeoneTyping, emitTyping } = useSocket(debouncedQuery);

  useEffect(() => {
    if (emitTyping) {
      emitTyping(searchQuery !== debouncedQuery && searchQuery.length > 0);
    }
  }, [searchQuery, debouncedQuery, emitTyping]);
  const { posts, meta, loading, error, fetchPosts, syncPosts } = usePosts();

  const isSearchActive = debouncedQuery.trim().length > 0;
  const currentPosts = isSearchActive ? searchResults : posts;

  return (
    <Layout>
      <div className="sync-bar">
        <button 
          className="btn btn-primary" 
          onClick={syncPosts} 
          disabled={loading || isSearching}
        >
          <Database size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} />
          Sync from External API
        </button>
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery} 
        isSearching={isSearching} 
      />

      {isSomeoneTyping && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.9rem', animation: 'pulse 1.5s infinite' }}>
          Someone is typing a search...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', color: '#ef4444', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading && !isSearchActive ? (
        <SkeletonLoader />
      ) : (
        <>
          {currentPosts.length > 0 ? (
            <div className="posts-grid">
              {currentPosts.map((post, index) => (
                <PostCard 
                  key={post._id || post.id} 
                  post={post} 
                  searchQuery={searchQuery}
                  style={{ animationDelay: `${index * 0.05}s` }} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Database className="empty-icon" />
              <h2>No posts found</h2>
              <p>Try synchronizing data or expanding your search.</p>
            </div>
          )}
          
          {!isSearchActive && meta && meta.page < meta.totalPages && (
            <div className="pagination">
              <button 
                className="btn btn-primary" 
                onClick={() => fetchPosts(meta.page + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
