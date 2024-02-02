import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  }
});

export const fetchMovieDetails = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/movie/${movieId}?language=en-US`);
    return response.data;
  } catch (error) {
    console.log("Err ", error);
    throw new Error('Error while fetching movies details');
  }
};

export const fetchMovieGenres = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/genre/movie/list?language=en-US`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    return response.data.genres;
  } catch (error) {
    throw new Error(`Error while fetching movies`);
  }
};

export const fetchTopRatedMovies = async (startPage: number, pageCount: number) => {
  let movies: any[] = [];
  let currentPage = startPage;
  const endPage = startPage + pageCount;

  while (currentPage < endPage) {
    try {
      const response = await apiClient.get(`/movie/top_rated?language=en-US&page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      });
      movies = movies.concat(response.data.results);
      currentPage++;
    } catch (error) {
      throw new Error(`Error`);
    }
  }

  return movies;
};

export const fetchMoviesByIds = async (movieIds: string[]) => {
  try {
    const moviePromises = movieIds.map((id: string) =>
    apiClient.get(`/movie/${id}?language=en-US`)
    );
    const movies = await Promise.all(moviePromises);
    return movies.map((response) => response.data);
  } catch (error) {
    console.log("Err ", error);
    throw new Error('Error while fetching movies details');
  }
};