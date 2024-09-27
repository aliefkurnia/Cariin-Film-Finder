import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import {
  getMovieList,
  searchMovie,
  getUpcomingMovies,
  getMovieGenres,
} from "./api"; // Pastikan getMovieGenres diimpor
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import MovieDetail from "./Movie-Detail";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import logo from "./images/logo.png";
import Autocomplete from "@mui/material/Autocomplete"; // Import Autocomplete

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]); // State untuk genre
  const popularMovieContainerRef = useRef(null);
  const upcomingMovieContainerRef = useRef(null);

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
      },
    },
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const popularResult = await getMovieList();
      setPopularMovies(popularResult || []);

      const upcomingResult = await getUpcomingMovies();
      setUpcomingMovies(upcomingResult || []);
    };

    fetchMovies();
  }, []);

  // Ambil genre saat komponen di-mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getMovieGenres();
        setGenres(genreList || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q);
      setPopularMovies(query || []);
    } else if (q.length === 0) {
      const result = await getMovieList();
      setPopularMovies(result || []);
    }
  };

  const MovieList = ({ movies }) => {
    if (movies.length === 0) {
      return <p>No movies found.</p>;
    }

    return movies.map((movie) => (
      <Card
        variant="outlined"
        className="Movie-wrapper"
        key={movie.id} // Use movie.id as key instead of index
        sx={{ width: 250 }} // Changed to match the styling
      >
        <Link to={`/movie/${movie.id}`}>
          <div className="Movie-image-wrapper">
            <img
              className="Movie-image"
              src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="Movie-overlay">
              <div className="Movie-title">{movie.title}</div>
            </div>
          </div>
        </Link>
      </Card>
    ));
  };

  const scrollMovies = (containerRef, direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction * 300, // Move left or right based on direction
        behavior: "smooth",
      });
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="Header-container">
            <div className="Logo-container">
              <img src={logo} alt="CariiN" className="Title-logo" />
            </div>
            <nav className="Nav-menu">
              <Link to="/" className="Nav-link">
                Home
              </Link>
              {/* Combo box genre di sebelah kanan Home */}
              <Autocomplete
                options={genres} // Gunakan daftar genre
                getOptionLabel={(option) => option.name} // Ambil nama genre
                onChange={(event, value) => {
                  // Lakukan pencarian berdasarkan genre yang dipilih
                  if (value) {
                    search(value.name); // Misalkan Anda ingin melakukan pencarian berdasarkan nama genre
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Genre"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        backgroundColor: "#ffffff", // Ubah latar belakang menjadi putih
                      },
                    }}
                  />
                )}
                style={{ width: 200, marginLeft: "20px" }} // Ukuran combo box dan margin kiri
              />
            </nav>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="Search-container">
                  <ThemeProvider theme={customTheme}>
                    <TextField
                      label="Find Your Favorite Film"
                      className="Title-search"
                      onChange={({ target }) => {
                        setSearchQuery(target.value);
                        search(target.value);
                      }}
                      variant="outlined"
                      InputProps={{
                        style: {
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                    />
                  </ThemeProvider>
                </div>

                <h2>Popular Movies</h2>
                <div className="Movie-section">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <button
                      className="Scroll-button left"
                      onClick={() => scrollMovies(popularMovieContainerRef, -1)}
                    >
                      &lt; {/* Tombol Kiri */}
                    </button>
                    <button
                      className="Scroll-button right"
                      onClick={() => scrollMovies(popularMovieContainerRef, 1)}
                    >
                      &gt; {/* Tombol Kanan */}
                    </button>
                  </div>
                  <div
                    className="Movie-container"
                    ref={popularMovieContainerRef}
                    style={{ position: "relative" }}
                  >
                    <MovieList movies={popularMovies} />
                  </div>
                </div>

                <h2>Upcoming Movies</h2>
                <div className="Movie-section">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <button
                      className="Scroll-button left"
                      onClick={() =>
                        scrollMovies(upcomingMovieContainerRef, -1)
                      }
                    >
                      &lt; {/* Tombol Kiri */}
                    </button>
                    <button
                      className="Scroll-button right"
                      onClick={() => scrollMovies(upcomingMovieContainerRef, 1)}
                    >
                      &gt; {/* Tombol Kanan */}
                    </button>
                  </div>
                  <div
                    className="Movie-container"
                    ref={upcomingMovieContainerRef}
                    style={{ position: "relative" }}
                  >
                    <MovieList movies={upcomingMovies} />
                  </div>
                </div>
              </>
            }
          />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>

        <footer className="App-footer">
          <div>
            <p>2024 Cariin. For Portfolio Only.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
