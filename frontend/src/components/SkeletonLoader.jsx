export const SkeletonLoader = () => {
  return (
    <div className="posts-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="post-card" style={{ height: '200px', animation: 'pulse 1.5s infinite' }}>
          <div style={{ height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem', width: '80%' }}></div>
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: 'auto' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{ height: '20px', width: '60px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}></div>
            <div style={{ height: '20px', width: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};
