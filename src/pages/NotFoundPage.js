import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-netflix-red mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-6">Page not found</p>
      <Link to="/" className="bg-netflix-red hover:bg-netflix-red-hover text-white px-6 py-2.5 rounded transition">
        Go Home
      </Link>
    </div>
  );
}
