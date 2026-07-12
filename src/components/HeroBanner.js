import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending } from '../services/api';
import { getBackdropUrl, truncateText, getTitle } from '../utils/helpers';

export default function HeroBanner() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getTrending('movie', 'week').then((results) => {
      setMovies(results.slice(0, 5));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return <div className="h-[80vh] bg-netflix-dark animate-pulse" />;
  }

  const movie = movies[current];

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={getTitle(movie)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black/30" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-4 md:left-12 max-w-lg md:max-w-2xl z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          {getTitle(movie)}
        </h1>
        <p className="text-sm md:text-base text-gray-200 mb-5 line-clamp-3 drop-shadow">
          {truncateText(movie.overview, 200)}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 bg-white text-black font-semibold px-5 md:px-8 py-2 md:py-3 rounded hover:bg-gray-200 transition text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play
          </button>
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 bg-gray-500/70 text-white font-semibold px-5 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/50 transition text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 right-4 md:right-12 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
