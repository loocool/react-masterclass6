import { useQuery } from "react-query";

const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getLatest() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function useMoviesQuery() {
  const nowPlaying = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovies);
  const popular = useQuery<IGetMoviesResult>(["movie", "popular"], getLatest);
  const topRated = useQuery<IGetMoviesResult>(["movie", "topRated"], getTopRated);
  const upcoming = useQuery<IGetMoviesResult>(["movie", "upcoming"], getUpcoming);
  return [nowPlaying, popular, topRated, upcoming];
}

export function getMovie(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
