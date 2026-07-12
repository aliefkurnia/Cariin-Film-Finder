import React, { useCallback } from 'react';
import MovieRow from '../components/MovieRow';
import { getTrendingTV, getPopularTV, discoverByGenre } from '../services/api';

export default function TvPage() {
  const fetchTrendingTV = useCallback(() => getTrendingTV('week'), []);
  const fetchPopularTV = useCallback(() => getPopularTV(), []);
  const fetchDrama = useCallback(() => discoverByGenre(18).then(d => d.results), []);
  const fetchCrime = useCallback(() => discoverByGenre(80).then(d => d.results), []);
  const fetchComedy = useCallback(() => discoverByGenre(35).then(d => d.results), []);

  return (
    <div className="pt-20 pb-16">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">TV Shows</h1>
      </div>
      <div className="space-y-2">
        <MovieRow title="Trending TV Shows" fetchFn={fetchTrendingTV} mediaType="tv" />
        <MovieRow title="Popular on TV" fetchFn={fetchPopularTV} mediaType="tv" />
        <MovieRow title="Drama" fetchFn={fetchDrama} mediaType="tv" />
        <MovieRow title="Crime" fetchFn={fetchCrime} mediaType="tv" />
        <MovieRow title="Comedy" fetchFn={fetchComedy} mediaType="tv" />
      </div>
    </div>
  );
}
