import React from "react";
import "./App.css";
import "./sdForward.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Stage from "./components/Stage";
import YearSelector from "./components/YearSelector";
import Categories from "./components/Categories";

import TimelineContext, { TimelineContextProvider } from './TimelineContext'

function App() {
  return (
    <TimelineContextProvider>
      <div className="container flex">
        <Header />
        <div className="content flex">
          <Categories />
          <div className="column flex">
            <div className="row">
              <Sidebar />
              <TimelineContext.Consumer>
                {({data, selectedSectors, selectedYear}) => (
                  <Stage
                    data={data}
                    selectedSectors={selectedSectors}
                    selectedYear={selectedYear}
                  />
                )}
              </TimelineContext.Consumer>
            </div>
            <div className="row fixed-100">
              <YearSelector />
            </div>
          </div>
        </div>
      </div>
    </TimelineContextProvider>
  );
}

export default App;
