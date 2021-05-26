import React from "react";
import { VscChromeClose } from "react-icons/vsc";
import "./sidebar.css";
import TimelineContext from "../TimelineContext";
import ScrollableFilter from "./ScrollableFilter";

const Sidebar = (props) => {
  return (
    <TimelineContext.Consumer>
      {({
        selectedSectors,
        showAllSectors,
        showFilter,
        removeSector,
        clearSelectedSectors,
        updateShowFilter,
      }) => (
        <div
          className={
            showFilter ? "column fixed-270 show" : "column fixed-270 hide"
          }
        >
          <div id="sidebar">
            <div className="container-sidebar">
              <div id="bkground"></div>
              {/* <div className="close">
              <button onClick={updateShowFilter}>
                <VscChromeClose size={18} />
              </button>
            </div> */}
              {/* <div className="sidebar-title">A History of San Diego</div> */}

              <div className="sidebar-label">
                <p>Filtered By</p>
                {/* <button className="clear" onClick={clearSelectedSectors}>
                  Clear all
                </button> */}
                <div className="close">
                  <button onClick={updateShowFilter}>
                    <VscChromeClose size={18} />
                  </button>
                </div>
              </div>
              <div className="selected-sectors">
                {selectedSectors.length === 0 ? (
                  <p className="empty">No sectors selected</p>
                ) : (
                  <>
                    {selectedSectors.map((sector) => (
                      <div className="sector-filter-tag" key={sector}>
                        <button onClick={(e) => removeSector(sector)}>
                          <VscChromeClose />
                        </button>
                        {sector}
                      </div>
                    ))}
                  </>
                )}
                <button className="clear" onClick={clearSelectedSectors}>
                  Clear all
                </button>
              </div>

              <div className="sidebar-label">
                <p>
                  Categories<span>(Select 5 Max)</span>
                </p>
              </div>
              {showAllSectors ? <ScrollableFilter /> : null}
            </div>
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default Sidebar;
