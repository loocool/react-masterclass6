import { useQuery } from "react-query";

const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
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

function getNowPlaying() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getPopular() {
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
  const nowPlaying = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getNowPlaying);
  const popular = useQuery<IGetMoviesResult>(["movie", "popular"], getPopular);
  const topRated = useQuery<IGetMoviesResult>(["movie", "topRated"], getTopRated);
  const upcoming = useQuery<IGetMoviesResult>(["movie", "upcoming"], getUpcoming);
  return [nowPlaying, popular, topRated, upcoming];
}

export function getMovie(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}


function getTvAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getTvOnTheAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getTvPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

function getTvTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function useTvQuery() {
  const tvAiringToday = useQuery<IGetMoviesResult>(["tv", "airingToday"], getTvAiringToday);
  const tvOnTheAir = useQuery<IGetMoviesResult>(["tv", "onTheAir"], getTvOnTheAir);
  const tvPopular = useQuery<IGetMoviesResult>(["tv", "popular"], getTvPopular);
  const tvTopRated = useQuery<IGetMoviesResult>(["tv", "topRated"], getTvTopRated);
  return [tvAiringToday, tvOnTheAir, tvPopular, tvTopRated];
}

function searchMovie(keyword: string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then(
    (response) => response.json()
  );
}

function searchTv(keyword: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then(
    (response) => response.json()
  );
}

export function useSearchQuery(keyword: string) {
  const movie = useQuery<IGetMoviesResult>(["searchMovie", keyword], () => searchMovie(keyword));
  const tv = useQuery<IGetMoviesResult>(["searchTv", keyword], () => searchTv(keyword));
  return [movie, tv];
}
