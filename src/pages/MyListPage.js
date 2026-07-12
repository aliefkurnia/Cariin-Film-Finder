import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

export default function MyListPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="pt-20 px-4 md:px-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My List</h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 text-lg">Your list is empty</p>
          <p className="text-gray-500 text-sm mt-2">Browse movies and TV shows to add them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <MovieCard key={item.id} item={item} mediaType={item.media_type} />
          ))}
        </div>
      )}
    </div>
  );
}
