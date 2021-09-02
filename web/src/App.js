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
                  selectedStory
                }) => (
                  <Stage
                    data={data}
                    selectedSectors={selectedSectors}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    setTimelineScroll={setTimelineScroll}
                    selectedStory={selectedStory}
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
              SANDAG has used reasonable efforts to ensure that the data used in this tool is complete, accurate, and useful. However, because SANDAG does not create these data, we cannot be liable for omissions or inaccuracies.
            </span>
          </div>
        </div>
      </div>
    </TimelineContextProvider>
  );
}

export default App;
