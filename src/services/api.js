import axios from 'axios';
import { TMDB_BASE_URL, TMDB_API_KEY, TMDB_TOKEN } from './tmdb.constants';

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    accept: 'application/json',
  },
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Movies
export const getMovieList = async (page = 1) => {
  const { data } = await tmdb.get('/movie/popular', { params: { page } });
  return data.results;
};

export const getTopRatedMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
  return data.results;
};

export const getUpcomingMovies = async (page = 1) => {
  const { data } = await tmdb.get('/movie/upcoming', { params: { page } });
  return data.results;
};

export const getMovieDetails = async (movieId) => {
  const { data } = await tmdb.get(`/movie/${movieId}`, {
    params: { append_to_response: 'credits,videos,similar,reviews,keywords,recommendations,images' },
  });
  return data;
};

export const getSimilarMovies = async (movieId, page = 1) => {
  const { data } = await tmdb.get(`/movie/${movieId}/similar`, { params: { page } });
  return data.results;
};

// TV
export const getPopularTV = async (page = 1) => {
  const { data } = await tmdb.get('/tv/popular', { params: { page } });
  return data.results;
};

export const getTVDetails = async (tvId) => {
  const { data } = await tmdb.get(`/tv/${tvId}`, {
    params: { append_to_response: 'credits,videos,similar,reviews,keywords,recommendations,content_ratings' },
  });
  return data;
};

export const getSimilarTV = async (tvId, page = 1) => {
  const { data } = await tmdb.get(`/tv/${tvId}/similar`, { params: { page } });
  return data.results;
};

// Trending
export const getTrending = async (mediaType = 'all', timeWindow = 'week', page = 1) => {
  const { data } = await tmdb.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } });
  return data.results;
};

export const getTrendingTV = async (timeWindow = 'week', page = 1) => {
  const { data } = await tmdb.get(`/trending/tv/${timeWindow}`, { params: { page } });
  return data.results;
};

// Discover & Genre
export const discoverByGenre = async (genreId, page = 1, sortBy = 'popularity.desc') => {
  const { data } = await tmdb.get('/discover/movie', {
    params: { with_genres: genreId, sort_by: sortBy, page },
  });
  return data;
};

export const getMovieGenres = async () => {
  const { data } = await tmdb.get('/genre/movie/list', { params: { language: 'en' } });
  return data.genres;
};

export const getTVGenres = async () => {
  const { data } = await tmdb.get('/genre/tv/list', { params: { language: 'en' } });
  return data.genres;
};

// Search
export const searchMovie = async (query, page = 1) => {
  const { data } = await tmdb.get('/search/movie', { params: { query, page } });
  return data.results;
};

export const multiSearch = async (query, page = 1) => {
  const { data } = await tmdb.get('/search/multi', { params: { query, page } });
  return data;
};

// Cast & Videos (standalone, for cases not using append_to_response)
export const getMovieCast = async (movieId) => {
  const { data } = await tmdb.get(`/movie/${movieId}/credits`);
  return data.cast.slice(0, 10);
};

export const getMovieVideos = async (movieId) => {
  const { data } = await tmdb.get(`/movie/${movieId}/videos`);
  return data.results;
};
