import React from "react";
import "./App.css";
import "./sdForward.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Stage from "./components/Stage";
import YearSelector from "./components/YearSelector";
import TimelineContext from "./TimelineContext";
import { IoIosPin } from "react-icons/io";

import { EventDataProvider } from './EventDataContext'

function App() {
  return (
    <TimelineContext.Consumer>
      {({ toggleShowFilter, selectedDec, selectedSectors, updateResults, stageResults }) => (
        <div className="container flex">
          <Header />
          <div className="content flex">
            {/* <img src={backgroundLandscape} alt="san diego landscape" />
            <img src={road} alt="stage" /> */}
            <button className="categories button" onClick={toggleShowFilter}>
              {" "}
              <IoIosPin />
              categories
            </button>
            <div className="column flex">
              <div className="row">
                {/* {showFilter ? <Sidebar /> : null} */}
                <Sidebar
                  selectedDec={selectedDec}
                  selectedSectors={selectedSectors}
                  updateResults={updateResults}
                />
                {/* <Stage
                  selectedSectors={selectedSectors}
                  events={stageResults}
                /> */}
                <EventDataProvider>
                  <Stage />
                </EventDataProvider>
              </div>
              <div className="row fixed-100">
                <YearSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
}

export default App;
