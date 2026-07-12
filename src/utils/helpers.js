import { IMAGE_BASE, POSTER_SIZES, BACKDROP_SIZES } from '../services/tmdb.constants';

export function getImageUrl(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE}/${size}/${path}`;
}

export function getPosterUrl(path, size = 'large') {
  return getImageUrl(path, POSTER_SIZES[size]);
}

export function getBackdropUrl(path, size = 'large') {
  return getImageUrl(path, BACKDROP_SIZES[size]);
}

export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getYear(dateString) {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
}

export function getRatingColor(rating) {
  if (rating >= 7) return 'text-green-500';
  if (rating >= 5) return 'text-yellow-500';
  return 'text-red-500';
}

export function getTitle(item) {
  return item.title || item.name || 'Unknown';
}

export function getReleaseDate(item) {
  return item.release_date || item.first_air_date || '';
}

export function getMediaType(item) {
  if (item.media_type) return item.media_type;
  if (item.first_air_date) return 'tv';
  return 'movie';
}
