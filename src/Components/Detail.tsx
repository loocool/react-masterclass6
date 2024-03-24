import { motion, useViewportScroll } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

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

function Detail({ data }: { data: IMovie }) {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const pageMatch = useRouteMatch<{
    page: string;
    list: string;
    movieId: string;
  }>("/:page/:list/:movieId");
  const { scrollY } = useViewportScroll();
  const onOverlayClick = () =>
    history.push(
      pageMatch?.params.page === "tv"
        ? "/tv"
        : pageMatch?.params.page === "search"
        ? `/search?keyword=${keyword}`
        : "/"
    );
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigMovie
        style={{ top: scrollY.get() + 100 }}
        layoutId={(pageMatch?.params.list ?? "-") + pageMatch?.params.movieId}
      >
        {data && (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  data.backdrop_path,
                  "w500"
                )})`,
              }}
            />
            <BigTitle>{data.title ?? data.name}</BigTitle>
            <BigOverview>{data.overview}</BigOverview>
          </>
        )}
      </BigMovie>
    </>
  );
}
export default Detail;
