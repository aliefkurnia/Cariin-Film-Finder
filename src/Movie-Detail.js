import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "./api"; // Pastikan ini ada
import "./MovieDetail.css"; // Pastikan CSS juga ada

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetail = await getMovieDetails(id); // Mengambil detail film berdasarkan ID
        setMovie(movieDetail);
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
        <div className="content">
          <div className="poster-container">
            <img
              src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`}
              alt={movie.title}
              className="poster"
            />
          </div>
          <div className="details">
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
