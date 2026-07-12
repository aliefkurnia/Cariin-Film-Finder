import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import TvDetailPage from './pages/TvDetailPage';
import SearchPage from './pages/SearchPage';
import BrowseGenrePage from './pages/BrowseGenrePage';
import TvPage from './pages/TvPage';
import MyListPage from './pages/MyListPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<TvDetailPage />} />
          <Route path="/tv" element={<TvPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/browse/:genreId" element={<BrowseGenrePage />} />
          <Route path="/mylist" element={<MyListPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
