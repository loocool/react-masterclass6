import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useLocation } from "react-router";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Slider from "../Components/Slider";
import { useSearchQuery } from "../api";
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

const Title = styled.h2`
  padding: 100px 50px;
  font-size: 36px;
  height: 300px;
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ list: string; movieId: string }>(
    "/search/:list/:movieId"
  );
  const { scrollY } = useViewportScroll();
  const [
    { data: movie, isLoading: loadingMovie },
    { data: tv, isLoading: loadingTv },
  ] = useSearchQuery(keyword ?? "");
  const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
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
                      <BigTitle>{clickedMovie.title ?? clickedMovie.name}</BigTitle>
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
export default Search;
