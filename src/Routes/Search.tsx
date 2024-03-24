import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import { useSearchQuery } from "../api";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  padding: 100px 50px;
  font-size: 36px;
  height: 300px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigMovieMatch = useRouteMatch<{ list: string; movieId: string }>(
    "/search/:list/:movieId"
  );
  const [
    { data: movie, isLoading: loadingMovie },
    { data: tv, isLoading: loadingTv },
  ] = useSearchQuery(keyword ?? "");
  const clickedMovie =
    bigMovieMatch?.params.list &&
    bigMovieMatch?.params.movieId &&
    (bigMovieMatch.params.list === "movies" ? movie : tv)?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {loadingMovie || loadingTv ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Title>Search results for [{keyword}]</Title>

          <Slider list="movies" data={movie} />
          <Slider list="tv" data={tv} />

          <AnimatePresence>
            {clickedMovie ? <Detail data={clickedMovie} /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;
