import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Rating from '@mui/material/Rating';

const MovieDetail = ({ movies }) => {
  const { id } = useParams();
  const movie = movies.find(movie => movie.id === parseInt(id));

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Setelah komponen dimuat, atur isLoaded menjadi true setelah sedikit penundaan
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Membersihkan timeout saat komponen tidak lagi dimuat
    return () => clearTimeout(timeout);
  }, []);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className={`movie-detail-container ${isLoaded ? 'loaded' : ''}`}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '90%', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white', marginRight: '20px' }}>
            <IconButton>
              <ArrowBackIosIcon fontSize="inherit" style={{ color: 'white', cursor: 'pointer' }} />
            </IconButton>
          </Link>
          
          <img 
            src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} 
            alt={movie.title} 
            style={{ 
              maxWidth: '50%', 
              height: 'auto', 
              marginRight: '20px',
              transition: 'transform 0.5s ease',
              cursor: 'pointer',
            }} 
          />

          <div style={{ textAlign: 'left', color: 'white' }}>
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
            <div>{`Release Date: ${movie.release_date}`}</div>
            <div>{`Vote Average: ${movie.vote_average}`}</div>
            <Rating readOnly color='white' value={movie.vote_average / 2} max={5} />
            <div>{`Vote Count: ${movie.vote_count}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
