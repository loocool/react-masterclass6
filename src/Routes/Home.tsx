import { AnimatePresence } from "framer-motion";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import { useMoviesQuery } from "../api";
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

function Home() {
  const bigMovieMatch = useRouteMatch<{ list: string; movieId: string }>(
    "/movies/:list/:movieId"
  );
  const [
    { data: nowPlaying, isLoading: loadingNowPlaying },
    { data: popular, isLoading: loadingPopular },
    { data: topRated, isLoading: loadingTopRated },
    { data: upcoming, isLoading: loadingUpcoming },
  ] = useMoviesQuery();
  const clickedMovie =
    bigMovieMatch?.params.list &&
    bigMovieMatch?.params.movieId &&
    (bigMovieMatch.params.list === "now-playing"
      ? nowPlaying
      : bigMovieMatch.params.list === "popular"
      ? popular
      : bigMovieMatch.params.list === "top-rated"
      ? topRated
      : upcoming
    )?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {loadingNowPlaying ||
      loadingPopular ||
      loadingTopRated ||
      loadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>

          <Slider list="now-playing" data={nowPlaying} />
          <Slider list="popular" data={popular} />
          <Slider list="top-rated" data={topRated} />
          <Slider list="upcoming" data={upcoming} />

          <AnimatePresence>
            {clickedMovie ? <Detail data={clickedMovie} /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
