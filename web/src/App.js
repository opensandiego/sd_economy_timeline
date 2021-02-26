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
          <Sidebar />
          <div className="column flex">
            <div className="row">
              <TimelineContext.Consumer>
                {({data, selectedSectors}) => (
                  <Stage
                    data={data}
                    selectedSectors={selectedSectors}
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
