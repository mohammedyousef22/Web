// src/components/common/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Composant SearchBar avec debounce
 */
const SearchBar = ({
    placeholder = 'Rechercher...',
    onSearch,
    debounceDelay = 500,
    className = '',
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceDelay, onSearch]);

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="
          block w-full pl-10 pr-10 py-2
          border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-sm placeholder:text-gray-400
          transition-colors duration-200
        "
            />

            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;