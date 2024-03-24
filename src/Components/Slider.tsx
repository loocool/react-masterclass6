import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  position: relative;
  top: -100px;
  height: 250px;
  margin-bottom: 50px;
`;

const Title = styled.h3`
  margin: 0 0 10px 50px;
  font-size: 24px;
  font-weight: 700;
  text-transform: capitalize;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  height: 200px;
  width: 100%;
  padding: 0 50px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Arrow = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 200px;
  font-size: 24px;
  font-weight: 700;
  color: white;
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const LeftArrow = styled(Arrow)`
  left: 0;
`;

const RightArrow = styled(Arrow)`
  right: 0;
`;

const rowVariants = {
  hidden: (custom: boolean) => ({
    x: (window.outerWidth + 5) * (custom ? 1 : -1),
  }),
  visible: {
    x: 0,
  },
  exit: (custom: boolean) => ({
    x: (window.outerWidth + 5) * (custom ? -1 : 1),
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Slider({ list, data }: { list: string; data?: IGetMoviesResult }) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [forward, setForward] = useState(true);
  const pageMatch = useRouteMatch<{ page: string }>("/:page");
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const changeIndex = (step: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setForward(step > 0);
      setIndex((prev) => {
        let nextIndex = prev + step;
        if (nextIndex < 0) nextIndex = maxIndex;
        else if (nextIndex > maxIndex) nextIndex = 0;
        return nextIndex;
      });
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(
      `/${pageMatch?.params.page ?? "movies"}/${list}/${movieId}` +
        (keyword ? `?keyword=${keyword}` : "")
    );
  };
  return (
    <>
      <Wrapper>
        <Title>{list.replace("-", " ")}</Title>
        <LeftArrow onClick={() => changeIndex(-1)}>&lt;</LeftArrow>
        <RightArrow onClick={() => changeIndex(1)}>&gt;</RightArrow>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={forward}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            custom={forward}
            key={index}
          >
            {data?.results
              .slice(list === "now-playing" || list === "airing-today" ? 1 : 0)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={list + movie.id}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  onClick={() => onBoxClicked(movie.id)}
                  transition={{ type: "tween" }}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title ?? movie.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default Slider;
