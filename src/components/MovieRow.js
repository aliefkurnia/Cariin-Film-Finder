import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

export default function MovieRow({ title, fetchFn, mediaType }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn().then((results) => {
      if (!cancelled) {
        setItems(results || []);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [fetchFn]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.75), behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="px-4 md:px-12 mb-8">
        <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-3" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="px-4 md:px-12 mb-8 group/row">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{title}</h2>
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-0 w-10 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition hover:bg-black/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {items.map((item) => (
            <MovieCard key={item.id} item={item} mediaType={mediaType} />
          ))}
        </div>

        {/* Right arrow */}
        {showRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-0 w-10 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition hover:bg-black/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
