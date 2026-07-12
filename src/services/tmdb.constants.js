export const TMDB_BASE_URL = process.env.REACT_APP_BASEURL || 'https://api.themoviedb.org/3';
export const TMDB_API_KEY = process.env.REACT_APP_APIKEY;
export const TMDB_TOKEN = process.env.REACT_APP_APITOKEN;

export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
};

export const BACKDROP_SIZES = {
  small: 'w780',
  large: 'w1280',
  original: 'original',
};

export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};
