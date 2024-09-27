import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieCast } from "./api"; // Pastikan getMovieCast diimpor
import "./MovieDetail.css"; // Pastikan CSS juga ada
import { Rating } from "@mui/material"; // Pastikan untuk mengimpor komponen Rating

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]); // State untuk menyimpan data cast

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetail = await getMovieDetails(id); // Mengambil detail film berdasarkan ID
        setMovie(movieDetail);

        // Ambil data pemeran setelah mendapatkan detail film
        const movieCast = await getMovieCast(id); // Ambil data pemeran
        setCast(movieCast); // Mengatur state cast dengan hasil dari getMovieCast
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>; // Tampilkan loading saat data diambil
  }

  return (
    <div className="movie-detail">
      <div
        className="backdrop"
        style={{
          backgroundImage: `url(${process.env.REACT_APP_BASEIMGURL}${movie.backdrop_path})`,
        }}
      >
        <button className="back-button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
      <header className="header-content">
        <div className="content">
          <div className="poster-container">
            <img
              src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`}
              alt={movie.title}
              className="poster"
            />
          </div>
          <div className="details">
            <h1 className="movie-title">{movie.title}</h1>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")} |{" "}
              <strong>Release Date:</strong>{" "}
              {new Date(movie.release_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              <Rating
                name="half-rating"
                value={movie.vote_average / 2} // Sesuaikan skala 0-5 jika diperlukan
                precision={0.5}
                readOnly // Jika Anda hanya ingin menampilkan tanpa interaksi
              />
            </p>
            <h2 className="movie-tagline">{movie.tagline}</h2>
            <p className="movie-overview">{movie.overview}</p>
          </div>
        </div>
      </header>

      {/* Tambahkan info-container untuk menyatukan kedua section */}
      <div className="info-container">
        <section className="cast">
          <h2>Cast</h2>
          <div className="cast-cards">
            {cast.length > 0 ? (
              cast.map((actor) => (
                <div className="cast-card" key={actor.id}>
                  <img
                    src={`${process.env.REACT_APP_BASEIMGURL}${actor.profile_path}`}
                    alt={actor.name}
                    className="cast-photo"
                  />
                  <h3>{actor.name}</h3>
                  <p>
                    <strong>Character:</strong> {actor.character}
                  </p>
                </div>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </div>
        </section>

        <section className="additional-info">
          <h2>Additional Info</h2> {/* Judul section */}
          <p>
            <strong>Budget:</strong> ${movie.budget.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {movie.status} {/* Menambahkan status */}
          </p>
          <p>
            <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}{" "}
            {/* Menambahkan pendapatan */}
          </p>
          <h3>Production Companies</h3>{" "}
          {/* Mengubah menjadi h3 untuk hierarki yang lebih baik */}
          <ul>
            {movie.production_companies.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default MovieDetail;
