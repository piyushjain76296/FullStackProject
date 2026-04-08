import { Search, Loader2 } from 'lucide-react';

export const SearchBar = ({ value, onChange, isSearching }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search posts in real-time..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isSearching && <Loader2 className="search-loader" size={20} />}
      </div>
    </div>
  );
};
