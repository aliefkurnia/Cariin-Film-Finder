// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { getMovieList, searchMovie } from "./api";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import MovieDetail from './Movie-Detail'; // Import halaman detail film
import { ThemeProvider, createTheme } from '@mui/material/styles';
import logo from './images/logo.png';
import SearchIcon from '@mui/icons-material/Search';

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result);
    });
  }, []);

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q);
      setPopularMovies(query.results);
    }
    if (q.length === 0) {
      getMovieList().then((result) => {
        setPopularMovies(result);
      });
    }
  };
  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#ffffff', 
      },
    },
  });
  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => (
      <Card variant="outlined" className='Movie-wrapper' key={i}     sx={{
        width: 300, // Atur lebar card
        height: 400, // Atur tinggi card
      }}>
        <Link to={`/movie/${movie.id}`}>
          <div className='Movie-image-wrapper'>
            <img className='Movie-image' src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} alt={movie.title} />
            <div className='Movie-overlay'>
              <div className='Movie-title'>{movie.title}</div>

            </div>
          </div>
        </Link>
      </Card>
    ));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <div className="Header-container">
        <ThemeProvider theme={customTheme}>
          <SearchIcon />
    <TextField
      label='Find Your Favorite Film'
      className='Title-search'
      onChange={({ target }) => search(target.value)}
      variant="outlined"
      InputProps={{
        style: { color: 'white', borderColor: 'white' }, // Warna putih untuk teks dan border
      }}
      InputLabelProps={{
        style: { color: 'white' }, // Warna putih untuk label
      }}
    />
  </ThemeProvider>
          <img src={logo} alt="CariiN" className='Title-logo' />
      </div>
          <div className='Movie-container'>
            <Routes>
              <Route path="/" element={<PopularMovieList />} />
              <Route path="/movie/:id" element={<MovieDetail movies={popularMovies} />} />
            </Routes>
          </div>
        </header>
        <footer className="App-footer">
          <div>
            <p>2024 DEV FILM FINDER. For Portfolio Only.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
