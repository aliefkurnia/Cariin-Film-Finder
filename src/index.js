import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WatchlistProvider } from './context/WatchlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WatchlistProvider>
      <App />
    </WatchlistProvider>
  </React.StrictMode>
);
