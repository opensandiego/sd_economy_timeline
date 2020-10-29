import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { BiMinus, BiPlus } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import "./sidebar.css";
import TimelineContext from '../TimelineContext'

const Sidebar = (props) => {
  return (
    <TimelineContext.Consumer>
      {({
        selectedSectors,
        keySectors,
        allSectors,
        showAllSectors,
        showFilter,
        updateSelectedSectors,
        removeSector,
        clearSelectedSectors,
        updateShowAllSectors,
        updateShowFilter
      }) => (
        <div className={showFilter ? "column fixed-270 show" : "column fixed-270 hide"}>
          <div id="sidebar">
            <div className="close"><button onClick={updateShowFilter}><VscChromeClose size={18}/></button></div>
            {/* <div className="sidebar-title">A History of San Diego</div> */}

            <div className="sidebar-label">
              <p>Filtered By:</p>
              <button className="clear" onClick={clearSelectedSectors}>
                Clear all
              </button>
            </div>

            {selectedSectors.length === 0 ? (
              <p className="empty">No sectors selected</p>
            ) : (
              <div className="selected-sectors">
                {selectedSectors.map((sector) => (
                  <div className="sector-filter-tag" key={sector}>
                    <button onClick={(e) => removeSector(sector)}>
                      <VscChromeClose />
                    </button>
                    {sector}
                  </div>
                ))}
              </div>
            )}

            <div className="sidebar-label">
              <p>All Sectors<br/>(max of five)</p>

              {showAllSectors ? (
                <button onClick={updateShowAllSectors}>
                  <BiMinus size={15}/>
                </button>
              ) : (
                <button onClick={updateShowAllSectors}>
                  <BiPlus size={15}/>
                </button>
              )}
            </div>
            {showAllSectors ? (
              <div className="all-sectors">
                {keySectors.map((sector) => (
                  <div className="key-sector-selector" key={sector}>
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      value={sector}
                      // disabled={selectedSectors.length < 5 ? false : true}
                      onChange={(e) => {
                        updateSelectedSectors(e, sector)
                      }}
                    />
                    <span className="key-sector-selector-item">{sector}</span>
                    <BsInfoCircle />
                  </div>
                ))}
                {allSectors.map((sector) => (
                  <div className="all-sector-selector" key={sector}>
                    <input
                      type="checkbox"
                      value={sector}
                      checked={selectedSectors.includes(sector)}
                      // disabled={selectedSectors.length < 5 ? false : true}
                      onChange={(e) => {
                        updateSelectedSectors(e, sector)
                      }}
                    />
                    <span className="all-sector-selector-item">{sector}</span>
                    <BsInfoCircle />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </TimelineContext.Consumer>

  );
};

export default Sidebar;
