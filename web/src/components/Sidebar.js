import React, {useEffect} from "react";
import { VscChromeClose, VscChevronUp, VscChevronDown } from "react-icons/vsc";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import "./sidebar.css";
import TimelineContext from "../TimelineContext";
import ScrollableFilter from "./ScrollableFilter";

const Sidebar = (props) => {

  useEffect(() => {
    let filterHeight = document.getElementById('selected-sectors').clientHeight;
  })


  return (
    <TimelineContext.Consumer>
      {({
        selectedSectors,
        showAllSectors,
        showFilter,
        removeSector,
        clearSelectedSectors,
        updateShowFilter,
        showCategories,
        setShowCategories,
        showStories,
        setShowStories,
        storiesList,
        selectedStory,
        updateSelectedStory
      }) => (
        <div
          className={
            showFilter ? "column fixed-270 show" : "column fixed-270 hide"
          }
        >
          <div id="sidebar">
            <div className="container-sidebar">
              <div id="bkground"></div>

              <div className="sidebar-label">
                <p>Filtered By</p>
                <div className="close">
                  <button onClick={updateShowFilter}>
                    <VscChromeClose size={18} />
                  </button>
                </div>
              </div>
              <div className="selected-sectors" id="selected-sectors">
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
                  Stories
                </p>
                <p style={showStories ? {display: "block"} : {display: "none"}}>(Select 1 Max)</p>
                <button onClick={e => setShowStories(!showStories)}>
                  {showStories ? <VscChevronUp /> : <VscChevronDown />}
                </button>
              </div>
              <div className={showStories ? "stories open" : "stories"} id="stories">
                {storiesList.map((story, index) => (
                  <div className="stories-selector" key={index}>
                  <div className="sector-left">
                    <input
                      type="radio"
                      className="checkbox-input"
                      name="story"
                      value={story.name}
                      onChange={(e) => {
                        updateSelectedStory(story.name)
                      }}
                      checked={story.name === selectedStory}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="story-name">
                      {story.name}
                    </span>
                  </div>
                  <div className="tooltip">
                    <BsInfoCircle />
                    <BsInfoCircleFill />
                    <span className="tooltiptext">
                      {story.description}
                    </span>
                  </div>
                </div>
                ))}
              </div>

              <div className="sidebar-label">
                <p>
                  Categories
                </p>
                <p style={showCategories ? {display: "block"} : {display: "none"}}>(Select 5 Max)</p>
                <button onClick={e => setShowCategories(!showCategories)}>
                  {showCategories ? <VscChevronUp /> : <VscChevronDown />}
                </button>

              </div>
              <ScrollableFilter />
            </div>
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default Sidebar;
