import { AnimatePresence } from "framer-motion";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import { useTvQuery } from "../api";
import { makeImagePath } from "../utils";

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

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Tv() {
  const bigMovieMatch = useRouteMatch<{ list: string; movieId: string }>(
    "/tv/:list/:movieId"
  );
  const [
    { data: airingToday, isLoading: loadingAiringToday },
    { data: onTheAir, isLoading: loadingOnTheAir },
    { data: popular, isLoading: loadingPopular },
    { data: topRated, isLoading: loadingTopRated },
  ] = useTvQuery();
  const clickedMovie =
    bigMovieMatch?.params.list &&
    bigMovieMatch?.params.movieId &&
    (bigMovieMatch.params.list === "airing-today"
      ? airingToday
      : bigMovieMatch.params.list === "popular"
      ? popular
      : bigMovieMatch.params.list === "top-rated"
      ? topRated
      : onTheAir
    )?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {loadingAiringToday ||
      loadingOnTheAir ||
      loadingPopular ||
      loadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(airingToday?.results[0].backdrop_path || "")}
          >
            <Title>{airingToday?.results[0].name}</Title>
            <Overview>{airingToday?.results[0].overview}</Overview>
          </Banner>

          <Slider list="airing-today" data={airingToday} />
          <Slider list="on-the-air" data={onTheAir} />
          <Slider list="popular" data={popular} />
          <Slider list="top-rated" data={topRated} />

          <AnimatePresence>
            {clickedMovie ? <Detail data={clickedMovie} /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
