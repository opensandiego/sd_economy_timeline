import React, { useEffect, useRef } from "react";
import "./App.css";
import "./sdForward.css";
import Header from "./components/Header";
import About from "./components/About";
import Sidebar from "./components/Sidebar";
import Stage from "./components/Stage";
import YearSelector from "./components/YearSelector";
import Categories from "./components/Categories";
import OutsideClick from "./components/OutsideClick";
import TimelineContext, { TimelineContextProvider } from "./TimelineContext";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";

function App() {
  return (
    <TimelineContextProvider>
      <div className="container flex">
        <Header />
        <TimelineContext.Consumer>
          {({ getAboutDescription }) => (
            <About getAboutDescription={getAboutDescription} />
          )}
        </TimelineContext.Consumer>
        <div className="content flex">
          <Categories />
          <OutsideClick>
            <Sidebar />
          </OutsideClick>
          <div className="column flex">
            <div className="row">
              <TimelineContext.Consumer>
                {({
                  data,
                  selectedSectors,
                  selectedYear,
                  setSelectedYear,
                  setTimelineScroll,
                }) => (
                  <Stage
                    data={data}
                    selectedSectors={selectedSectors}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    setTimelineScroll={setTimelineScroll}
                  />
                )}
              </TimelineContext.Consumer>
            </div>
            <YearSelector />
          </div>
        </div>
        <div className="disclaimer">
          Disclaimer
          <div className="tooltip">
            <BsInfoCircle />
            <BsInfoCircleFill />
            <span
              className="tooltiptext"
              // style={{transform: `translateY(calc(-100% + calc(-23px + -${scrollTop}px)))`}}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </span>
          </div>
        </div>
      </div>
    </TimelineContextProvider>
  );
}

export default App;
