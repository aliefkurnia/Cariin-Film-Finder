import axios from "axios";

// Pastikan ini sudah ditetapkan di file .env
const apiKey = process.env.REACT_APP_APIKEY; // Pastikan ini sudah benar
const baseUrl = process.env.REACT_APP_BASEURL; // Pastikan ini sudah benar

export const getMovieList = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/movie/popular?api_key=${apiKey}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    throw error; // Tangani kesalahan lebih lanjut sesuai kebutuhan
  }
};

export const searchMovie = async (q) => {
  try {
    const response = await axios.get(
      `${baseUrl}/search/movie?query=${q}&api_key=${apiKey}`
    );
    return response.data.results; // Pastikan ini sesuai dengan struktur data yang Anda inginkan
  } catch (error) {
    console.error("Error searching movie:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_APITOKEN}`, // Pastikan token ini valid
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error; // Tangani kesalahan lebih lanjut sesuai kebutuhan
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `${baseUrl}/movie/upcoming?page=${page}&api_key=${apiKey}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_APITOKEN}`, // Pastikan token ini valid
          accept: "application/json",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw error; // Tangani kesalahan lebih lanjut sesuai kebutuhan
  }
};

// Tambahkan fungsi untuk mendapatkan daftar genre film
export const getMovieGenres = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/genre/movie/list?language=en`, // URL untuk daftar genre
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_APITOKEN}`, // Pastikan token ini valid
          accept: "application/json",
        },
      }
    );
    return response.data.genres; // Mengembalikan daftar genre
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw error; // Tangani kesalahan lebih lanjut sesuai kebutuhan
  }
};
