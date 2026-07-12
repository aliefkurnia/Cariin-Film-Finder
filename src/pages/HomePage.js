import React, { useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import {
  getTrending,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  discoverByGenre,
} from '../services/api';

export default function HomePage() {
  const fetchTrending = useCallback(() => getTrending('all', 'week'), []);
  const fetchTopRated = useCallback(() => getTopRatedMovies(), []);
  const fetchUpcoming = useCallback(() => getUpcomingMovies(), []);
  const fetchPopularTV = useCallback(() => getPopularTV(), []);
  const fetchAction = useCallback(() => discoverByGenre(28).then(d => d.results), []);
  const fetchComedy = useCallback(() => discoverByGenre(35).then(d => d.results), []);
  const fetchHorror = useCallback(() => discoverByGenre(27).then(d => d.results), []);
  const fetchRomance = useCallback(() => discoverByGenre(10749).then(d => d.results), []);
  const fetchDocumentary = useCallback(() => discoverByGenre(99).then(d => d.results), []);

  return (
    <div>
      <HeroBanner />
      <div className="relative -mt-16 z-10 space-y-2 pb-16">
        <MovieRow title="Trending Now" fetchFn={fetchTrending} />
        <MovieRow title="Top Rated" fetchFn={fetchTopRated} mediaType="movie" />
        <MovieRow title="Upcoming" fetchFn={fetchUpcoming} mediaType="movie" />
        <MovieRow title="Popular TV Shows" fetchFn={fetchPopularTV} mediaType="tv" />
        <MovieRow title="Action Movies" fetchFn={fetchAction} mediaType="movie" />
        <MovieRow title="Comedy" fetchFn={fetchComedy} mediaType="movie" />
        <MovieRow title="Horror" fetchFn={fetchHorror} mediaType="movie" />
        <MovieRow title="Romance" fetchFn={fetchRomance} mediaType="movie" />
        <MovieRow title="Documentaries" fetchFn={fetchDocumentary} mediaType="movie" />
      </div>
    </div>
  );
}
