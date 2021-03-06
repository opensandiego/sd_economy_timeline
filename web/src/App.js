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
      </div>
    </TimelineContextProvider>
  );
}

export default App;
