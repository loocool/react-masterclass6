import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: absolute;
  bottom: calc(80vh - 400px);
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ list: string; movieId: string }>(
    "/movies/:list/:movieId"
  );
  const { scrollY } = useViewportScroll();
  const [
    { data: nowPlaying, isLoading: loadingNowPlaying },
    { data: popular, isLoading: loadingPopular },
    { data: topRated, isLoading: loadingTopRated },
    { data: upcoming, isLoading: loadingUpcoming },
  ] = useMoviesQuery();
  const onOverlayClick = () => history.push("/");
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
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={
                    bigMovieMatch.params.list + bigMovieMatch.params.movieId
                  }
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
