import React, { Component } from "react";
import TimelineContext from "../TimelineContext";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";

export default class ScrollableFilter extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
    this.state = { scrollTop: 0 };
  }

  onScroll = () => {
    const scrollTop = this.myRef.current.scrollTop;
    this.setState({
      scrollTop: scrollTop,
    });
  };
  render() {
    const {scrollTop} = this.state;
    return (
      <TimelineContext.Consumer>
        {({ selectedSectors, allSectors, updateSelectedSectors, showCategories, activeFilter, selectedStory }) => (
          <div
            className={activeFilter === "categories" ? "all-sectors open" : "all-sectors"}
            ref={this.myRef}
            onScroll={this.onScroll}
          >
            {selectedStory && <div>Deselect the current story to enable category selection</div>}
            {allSectors.map((sector, index) => (
              <div className="all-sector-selector" key={index}>
                <div className="sector-left">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={sector.name}
                    checked={!selectedStory && selectedSectors.includes(sector.name)}
                    onChange={(e) => {
                      updateSelectedSectors(e, sector);
                    }}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="all-sector-selector-item">
                    {sector.name}
                  </span>
                </div>
                <div className="tooltip">
                  <BsInfoCircle />
                  <BsInfoCircleFill />
                  <span className="tooltiptext" style={{transform: `translateY(calc(-100% + calc(-23px + -${scrollTop}px)))`}}>{sector.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </TimelineContext.Consumer>
    );
  }
}
