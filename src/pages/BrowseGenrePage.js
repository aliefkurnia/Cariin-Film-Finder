import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discoverByGenre, getMovieGenres } from '../services/api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { GENRE_MAP } from '../services/tmdb.constants';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';

export default function BrowseGenrePage() {
  const { genreId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const { page, sentinelRef, setHasMore, reset } = useInfiniteScroll();

  const genreName = GENRE_MAP[Number(genreId)] || 'Genre';

  useEffect(() => {
    getMovieGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    setResults([]);
    setLoading(true);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId]);

  useEffect(() => {
    discoverByGenre(genreId, page).then((data) => {
      if (page === 1) {
        setResults(data.results);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
      setHasMore(page < data.total_pages);
      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId, page]);

  return (
    <div className="pt-20 px-4 md:px-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{genreName} Movies</h1>

      {/* Genre quick links */}
      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((g) => (
          <Link
            key={g.id}
            to={`/browse/${g.id}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${Number(genreId) === g.id ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MovieCard key={item.id} item={item} mediaType="movie" />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
        </>
      )}
    </div>
  );
}
