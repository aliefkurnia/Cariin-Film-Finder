import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies } from '../services/api';
import { getBackdropUrl, getPosterUrl, formatDate, formatRuntime, getYear } from '../utils/helpers';
import { useWatchlist } from '../context/WatchlistContext';
import TrailerModal from '../components/TrailerModal';
import MovieRow from '../components/MovieRow';

function RatingCircle({ rating }) {
  const percentage = Math.round(rating * 10);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 70 ? '#21d07a' : percentage >= 50 ? '#d2d531' : '#db2360';

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#081c22" stroke="#204529" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-sm font-bold">{percentage}<sup className="text-[8px]">%</sup></span>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showAllCast, setShowAllCast] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    setShowAllCast(false);
    setActiveTab('overview');
    window.scrollTo(0, 0);
    getMovieDetails(id).then((data) => {
      setMovie(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const fetchSimilar = useCallback(() => getSimilarMovies(id), [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <p className="text-xl text-gray-400">Movie not found.</p>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || movie.videos?.results?.find((v) => v.site === 'YouTube');

  const videos = movie.videos?.results?.filter((v) => v.site === 'YouTube') || [];
  const cast = movie.credits?.cast || [];
  const displayCast = showAllCast ? cast : cast.slice(0, 12);
  const directors = movie.credits?.crew?.filter((c) => c.job === 'Director') || [];
  const writers = movie.credits?.crew?.filter((c) => c.department === 'Writing')?.slice(0, 4) || [];
  const producers = movie.credits?.crew?.filter((c) => c.job === 'Producer')?.slice(0, 4) || [];
  const reviews = movie.reviews?.results?.slice(0, 3) || [];
  const keywords = movie.keywords?.keywords || [];
  const inList = isInWatchlist(movie.id);

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <img
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-netflix-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-transparent to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-12 bg-black/50 hover:bg-black/80 rounded-full p-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative -mt-48 z-10 px-4 md:px-12 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <img
              src={getPosterUrl(movie.poster_path, 'large')}
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl"
            />
            {/* Rating Circle */}
            <div className="flex items-center gap-3 mt-4">
              <RatingCircle rating={movie.vote_average} />
              <div>
                <p className="text-xs text-gray-400">User Score</p>
                <p className="text-xs text-gray-500">{movie.vote_count?.toLocaleString()} votes</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-1">{movie.title}</h1>

            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-gray-500 text-sm mb-2">Original: {movie.original_title}</p>
            )}

            {movie.tagline && (
              <p className="text-netflix-light-gray italic mb-4 text-lg">"{movie.tagline}"</p>
            )}

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
              <span className="text-gray-400">{getYear(movie.release_date)}</span>
              <span className="text-gray-400">{formatRuntime(movie.runtime)}</span>
              {movie.adult && <span className="border border-red-500 px-1.5 py-0.5 text-xs text-red-400">18+</span>}
              <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-400">HD</span>
              {movie.original_language && (
                <span className="text-gray-400 uppercase">{movie.original_language}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map((g) => (
                <Link
                  key={g.id}
                  to={`/browse/${g.id}`}
                  className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1.5 rounded-full hover:bg-gray-600/50 transition"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
              {movie.overview}
            </p>

            {/* Crew highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mb-6 text-sm">
              {directors.length > 0 && (
                <div>
                  <span className="text-gray-400">Director:</span>{' '}
                  <span className="text-white">{directors.map(d => d.name).join(', ')}</span>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <span className="text-gray-400">Writers:</span>{' '}
                  <span className="text-white">{writers.map(w => w.name).join(', ')}</span>
                </div>
              )}
              {producers.length > 0 && (
                <div>
                  <span className="text-gray-400">Producers:</span>{' '}
                  <span className="text-white">{producers.map(p => p.name).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {trailer && (
                <button
                  onClick={() => setTrailerKey(trailer.key)}
                  className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded hover:bg-gray-200 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Trailer
                </button>
              )}
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 border font-semibold px-6 py-2.5 rounded transition ${inList ? 'border-green-400 text-green-400 hover:border-green-300' : 'border-gray-400 text-white hover:border-white'}`}
              >
                {inList ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    In My List
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    My List
                  </>
                )}
              </button>
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-gray-400 text-white font-semibold px-6 py-2.5 rounded hover:border-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Official Site
                </a>
              )}
            </div>

            {/* Collection banner */}
            {movie.belongs_to_collection && (
              <div className="bg-netflix-dark border border-gray-700 rounded-lg p-4 mb-6 flex items-center gap-4">
                {movie.belongs_to_collection.poster_path && (
                  <img
                    src={getPosterUrl(movie.belongs_to_collection.poster_path, 'small')}
                    alt={movie.belongs_to_collection.name}
                    className="w-12 h-18 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-xs text-gray-400">Part of</p>
                  <p className="text-white font-medium">{movie.belongs_to_collection.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-b border-gray-700">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {['overview', 'cast', 'videos', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium capitalize whitespace-nowrap transition border-b-2 ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {tab === 'videos' ? `Videos (${videos.length})` : tab === 'cast' ? `Cast (${cast.length})` : tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-netflix-dark rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Movie Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400">Release Date</p>
                        <p>{formatDate(movie.release_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Runtime</p>
                        <p>{formatRuntime(movie.runtime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <p>{movie.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Original Language</p>
                        <p className="uppercase">{movie.original_language}</p>
                      </div>
                      {movie.spoken_languages?.length > 0 && (
                        <div>
                          <p className="text-gray-400">Spoken Languages</p>
                          <p>{movie.spoken_languages.map(l => l.english_name).join(', ')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {movie.budget > 0 && (
                        <div>
                          <p className="text-gray-400">Budget</p>
                          <p>${movie.budget.toLocaleString()}</p>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div>
                          <p className="text-gray-400">Revenue</p>
                          <p>${movie.revenue.toLocaleString()}</p>
                        </div>
                      )}
                      {movie.budget > 0 && movie.revenue > 0 && (
                        <div>
                          <p className="text-gray-400">Profit</p>
                          <p className={movie.revenue - movie.budget > 0 ? 'text-green-400' : 'text-red-400'}>
                            {movie.revenue - movie.budget > 0 ? '+' : ''}${(movie.revenue - movie.budget).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400">Popularity</p>
                        <p>{movie.popularity?.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Vote Count</p>
                        <p>{movie.vote_count?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production Companies */}
                {movie.production_companies?.length > 0 && (
                  <div className="bg-netflix-dark rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Production Companies</h3>
                    <div className="flex flex-wrap gap-6">
                      {movie.production_companies.map((company) => (
                        <div key={company.id} className="flex items-center gap-3">
                          {company.logo_path ? (
                            <img
                              src={getPosterUrl(company.logo_path, 'small')}
                              alt={company.name}
                              className="h-8 w-auto object-contain bg-white rounded px-2 py-1"
                            />
                          ) : (
                            <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                              {company.name[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm">{company.name}</p>
                            {company.origin_country && (
                              <p className="text-xs text-gray-500">{company.origin_country}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Keywords */}
                {keywords.length > 0 && (
                  <div className="bg-netflix-dark rounded-lg p-6">
                    <h3 className="text-sm font-semibold mb-3 text-gray-400">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <span key={kw.id} className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded">
                          {kw.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Countries */}
                {movie.production_countries?.length > 0 && (
                  <div className="bg-netflix-dark rounded-lg p-6">
                    <h3 className="text-sm font-semibold mb-3 text-gray-400">Production Countries</h3>
                    <div className="space-y-1">
                      {movie.production_countries.map((c) => (
                        <p key={c.iso_3166_1} className="text-sm">{c.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                <div className="bg-netflix-dark rounded-lg p-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-400">External Links</h3>
                  <div className="space-y-2">
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      TMDB →
                    </a>
                    {movie.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${movie.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-yellow-400 hover:text-yellow-300 transition"
                      >
                        IMDb →
                      </a>
                    )}
                    {movie.homepage && (
                      <a
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-400 hover:text-green-300 transition"
                      >
                        Official Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === 'cast' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayCast.map((person) => (
                  <div key={person.credit_id} className="bg-netflix-dark rounded-lg overflow-hidden group">
                    <img
                      src={person.profile_path ? getPosterUrl(person.profile_path, 'medium') : 'https://via.placeholder.com/342x513?text=No+Photo'}
                      alt={person.name}
                      className="w-full aspect-[2/3] object-cover bg-gray-800"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{person.name}</p>
                      <p className="text-xs text-gray-400 truncate">{person.character}</p>
                      {person.known_for_department && (
                        <p className="text-xs text-gray-500 mt-1">{person.known_for_department}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {cast.length > 12 && !showAllCast && (
                <button
                  onClick={() => setShowAllCast(true)}
                  className="mt-6 mx-auto block bg-netflix-dark border border-gray-600 text-white px-6 py-2 rounded hover:border-white transition text-sm"
                >
                  Show All Cast ({cast.length})
                </button>
              )}

              {/* Crew Section */}
              {(directors.length > 0 || writers.length > 0 || producers.length > 0) && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">Crew</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {directors.map((person) => (
                      <div key={person.credit_id} className="bg-netflix-dark rounded-lg p-4 flex items-center gap-3">
                        <img
                          src={person.profile_path ? getPosterUrl(person.profile_path, 'small') : 'https://via.placeholder.com/185x278?text=?'}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover bg-gray-700"
                        />
                        <div>
                          <p className="text-sm font-medium">{person.name}</p>
                          <p className="text-xs text-gray-400">Director</p>
                        </div>
                      </div>
                    ))}
                    {writers.map((person) => (
                      <div key={person.credit_id} className="bg-netflix-dark rounded-lg p-4 flex items-center gap-3">
                        <img
                          src={person.profile_path ? getPosterUrl(person.profile_path, 'small') : 'https://via.placeholder.com/185x278?text=?'}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover bg-gray-700"
                        />
                        <div>
                          <p className="text-sm font-medium">{person.name}</p>
                          <p className="text-xs text-gray-400">{person.job}</p>
                        </div>
                      </div>
                    ))}
                    {producers.map((person) => (
                      <div key={person.credit_id} className="bg-netflix-dark rounded-lg p-4 flex items-center gap-3">
                        <img
                          src={person.profile_path ? getPosterUrl(person.profile_path, 'small') : 'https://via.placeholder.com/185x278?text=?'}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover bg-gray-700"
                        />
                        <div>
                          <p className="text-sm font-medium">{person.name}</p>
                          <p className="text-xs text-gray-400">Producer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div>
              {videos.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No videos available</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => setTrailerKey(video.key)}
                      className="cursor-pointer group bg-netflix-dark rounded-lg overflow-hidden"
                    >
                      <div className="relative aspect-video">
                        <img
                          src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                          alt={video.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{video.name}</p>
                        <p className="text-xs text-gray-400">{video.type} • {video.published_at?.slice(0, 10)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No reviews available</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-netflix-dark rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-full bg-netflix-red flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {review.author?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">{review.author}</p>
                            {review.author_details?.rating && (
                              <span className="bg-gray-700 text-yellow-400 text-xs px-2 py-0.5 rounded">
                                ★ {review.author_details.rating}/10
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {review.content.length > 500
                          ? review.content.slice(0, 500) + '...'
                          : review.content}
                      </p>
                      {review.url && (
                        <a
                          href={review.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Read full review →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Similar & Recommendations */}
        <div className="mt-16 space-y-8">
          <MovieRow title="More Like This" fetchFn={fetchSimilar} mediaType="movie" />
          {movie.recommendations?.results?.length > 0 && (
            <MovieRow
              title="Recommendations"
              fetchFn={async () => movie.recommendations.results}
              mediaType="movie"
            />
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />}
    </div>
  );
}
