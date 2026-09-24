import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search projects, tasks, or clients...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-beige-400/60 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass-input rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm placeholder:text-beige-400/40 border-white/10"
      />
      {value && (
        <button
          onClick={onClear || (() => onChange(''))}
          className="absolute right-3 text-beige-400/60 hover:text-beige-200 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
