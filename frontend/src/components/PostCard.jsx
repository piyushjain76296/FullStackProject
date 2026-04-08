export const PostCard = ({ post, searchQuery = '', style = {} }) => {
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)', color: '#fff', borderRadius: '3px', padding: '0 2px' }}>{part}</mark> 
        : part
    );
  };

  return (
    <div className="post-card animate-fade-in" style={style}>
      <h3 className="post-card-title">{highlightText(post.title, searchQuery)}</h3>
      <p className="post-card-body">{highlightText(post.body.substring(0, 120), searchQuery)}...</p>
      
      <div className="post-card-footer">
        <span className="user-badge">User: {post.userId}</span>
        <span>ID: {post.id}</span>
      </div>
    </div>
  );
};
