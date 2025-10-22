import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        onSearch(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="ค้นหาร้านอาหาร..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        🔍 ค้นหา
      </button>
    </form>
  );
}

export default SearchBar;
