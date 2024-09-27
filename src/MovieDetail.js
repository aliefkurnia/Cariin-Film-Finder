import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieCast, getMovieVideos } from "./api"; // Ganti getMovieTrailers dengan getMovieVideos
import Modal from "react-modal"; // Import React Modal
import "./MovieDetail.css"; // Pastikan CSS juga ada
import { Rating } from "@mui/material"; // Pastikan untuk mengimpor komponen Rating

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState([]); // State untuk menyimpan data trailer
  const [modalIsOpen, setModalIsOpen] = useState(false); // State untuk kontrol modal
  const [trailerKey, setTrailerKey] = useState(""); // State untuk menyimpan trailer key

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetail = await getMovieDetails(id);
        setMovie(movieDetail);

        const movieCast = await getMovieCast(id);
        setCast(movieCast);

        // Gunakan getMovieVideos untuk mengambil trailer
        const movieTrailers = await getMovieVideos(id);
        setTrailers(movieTrailers);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // Handle watch trailer
  const handleWatchTrailer = (trailerKey) => {
    setTrailerKey(trailerKey); // Set trailer key
    setModalIsOpen(true); // Buka modal
  };

  // Function to close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setTrailerKey(""); // Reset trailer key
  };

  if (!movie) {
    return <div>Loading...</div>;
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
                readOnly
              />
              {trailers.length > 0 && (
                <button
                  className="watch-trailer-button"
                  onClick={() => handleWatchTrailer(trailers[0].key)} // Ambil trailer pertama
                >
                  Watch Trailer
                </button>
              )}
            </p>
            <h2 className="movie-tagline">{movie.tagline}</h2>
            <p className="movie-overview">{movie.overview}</p>
          </div>
        </div>
      </header>

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
          <h2>Additional Info</h2>
          <p>
            <strong>Budget:</strong> ${movie.budget.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {movie.status}
          </p>
          <p>
            <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}{" "}
          </p>
          <h3>Production Companies</h3>
          <ul>
            {movie.production_companies.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Modal untuk trailer */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Trailer"
        ariaHideApp={false} // Menghindari error aksesibilitas
      >
        <h2>Trailer</h2>
        {trailerKey && (
          <iframe
            width="100%"
            height="700vh"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default MovieDetail;
