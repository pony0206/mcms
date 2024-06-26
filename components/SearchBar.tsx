// components/SearchBar.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import Skeleton from '@/components/Skeleton';
import SearchResults from '@/components/SearchResults';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  id: string;
  type: 'post' | 'project' | 'file' | 'space' | 'profile';
  title: string;
  content: string;
  value: string;
  image?: string;
  url: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className = '',
  placeholder = 'Search...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<{
    posts: SearchResult[];
    files: SearchResult[];
    projects: SearchResult[];
    spaces: SearchResult[];
    tutorials: SearchResult[];
    users: SearchResult[];
  }>({
    posts: [],
    files: [],
    projects: [],
    spaces: [],
    tutorials: [],
    users: [],
  });

  const fetchSearchResults = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults({
        posts: [],
        files: [],
        projects: [],
        spaces: [],
        tutorials: [],
        users: [],
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setIsLoading(false);
  };

  const debouncedFetchSearchResults = debounce(fetchSearchResults);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      debouncedFetchSearchResults(searchQuery);
    } else {
      setSearchResults({posts: [], files: [], projects: [], spaces: [], tutorials: [], users: []})
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setIsOpen(false);
    router.push(result.url);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        ref={inputRef}
        className="w-full h-8 pl-10 pr-4 py-1 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:placeholder:text-gray-300 dark:text-gray-100 text-gray-600 dark:bg-blend-darken focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-10 mt-2 w-full md:w-96 rounded-md shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {isLoading ? (
              <div className="px-4 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ) : (
              <SearchResults results={searchResults} onResultClick={handleResultClick} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;