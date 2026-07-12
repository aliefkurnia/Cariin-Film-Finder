import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useState } from 'react';

export default function Navbar() {
  const scrolled = useScrollPosition();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-netflix-black shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-3">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-netflix-red font-bold text-2xl tracking-wider">
            CARIIN
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={({ isActive }) => `text-sm hover:text-white transition ${isActive ? 'text-white font-medium' : 'text-netflix-light-gray'}`}>
              Home
            </NavLink>
            <NavLink to="/tv" className={({ isActive }) => `text-sm hover:text-white transition ${isActive ? 'text-white font-medium' : 'text-netflix-light-gray'}`}>
              TV Shows
            </NavLink>
            <NavLink to="/mylist" className={({ isActive }) => `text-sm hover:text-white transition ${isActive ? 'text-white font-medium' : 'text-netflix-light-gray'}`}>
              My List
            </NavLink>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titles, people, genres"
                autoFocus
                className="bg-black/80 border border-white/50 text-white text-sm px-3 py-1.5 w-48 md:w-64 outline-none focus:border-white transition"
                onBlur={() => { if (!query) setSearchOpen(false); }}
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-netflix-light-gray transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          {/* Mobile menu */}
          <div className="md:hidden">
            <Link to="/tv" className="text-sm text-netflix-light-gray hover:text-white px-2">TV</Link>
            <Link to="/mylist" className="text-sm text-netflix-light-gray hover:text-white px-2">List</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
