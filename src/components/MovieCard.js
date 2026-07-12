import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl, getTitle, getYear, getMediaType } from '../utils/helpers';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = React.memo(function MovieCard({ item, mediaType }) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const type = mediaType || getMediaType(item);
  const inList = isInWatchlist(item.id);

  const handleClick = () => {
    navigate(`/${type}/${item.id}`);
  };

  return (
    <div className="relative flex-shrink-0 w-[130px] md:w-[160px] group cursor-pointer">
      <div onClick={handleClick} className="relative overflow-hidden rounded transition-transform duration-300 group-hover:scale-105 group-hover:z-10">
        <img
          src={getPosterUrl(item.poster_path, 'medium')}
          alt={getTitle(item)}
          loading="lazy"
          className="w-full aspect-[2/3] object-cover bg-netflix-dark"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
          <p className="text-xs font-semibold line-clamp-2">{getTitle(item)}</p>
          <div className="flex items-center gap-1 mt-1">
            {item.vote_average > 0 && (
              <span className="text-green-400 text-xs font-bold">{Math.round(item.vote_average * 10)}%</span>
            )}
            <span className="text-gray-400 text-xs">{getYear(item.release_date || item.first_air_date)}</span>
          </div>
        </div>
      </div>

      {/* Watchlist button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWatchlist(item); }}
        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 border border-gray-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:border-white"
        title={inList ? 'Remove from list' : 'Add to list'}
      >
        {inList ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  );
});

export default MovieCard;
