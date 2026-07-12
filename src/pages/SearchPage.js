import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { multiSearch } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page, sentinelRef, setHasMore, reset } = useInfiniteScroll();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      reset();
      return;
    }
    setSearchParams({ q: debouncedQuery });
    setLoading(true);
    setResults([]);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const fetchResults = async () => {
      if (page === 1) setLoading(true);
      try {
        const data = await multiSearch(debouncedQuery, page);
        const filtered = data.results.filter((item) => item.media_type !== 'person' && item.poster_path);
        if (page === 1) {
          setResults(filtered);
        } else {
          setResults((prev) => [...prev, ...filtered]);
        }
        setHasMore(page < data.total_pages);
      } catch {
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  return (
    <div className="pt-20 px-4 md:px-12 min-h-screen">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows..."
          autoFocus
          className="w-full max-w-2xl bg-netflix-dark border border-gray-600 text-white text-lg px-5 py-3 rounded-lg outline-none focus:border-white transition placeholder-gray-500"
        />
      </div>

      {/* Results */}
      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="text-gray-400 text-sm mb-4">
            Results for "<span className="text-white">{debouncedQuery}</span>"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
        </>
      ) : debouncedQuery.trim() ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No results found for "{debouncedQuery}"</p>
          <p className="text-gray-500 text-sm mt-2">Try different keywords</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Search for movies and TV shows</p>
        </div>
      )}
    </div>
  );
}
