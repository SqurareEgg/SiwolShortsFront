import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="게시글 검색..."
          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white pr-10"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;