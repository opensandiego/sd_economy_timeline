import React, {
  useRef
} from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import TimelineContext from "../TimelineContext";
import "./year-selector.scss";

const YearSelector = () => {
  const containerRef = useRef(null)

  const updateTimelineScroll = (scroll) => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.getBoundingClientRect().width
    const xScroll = scroll * containerWidth
    containerRef.current.scroll(xScroll, 0)
  }
  return (
    <TimelineContext.Consumer>
      {({ selectedDec, showYears, handleYearSelector, decades, setSelectedYear, timelineScroll }) => {
        if (!selectedDec) {
          updateTimelineScroll(timelineScroll)
        }
        return (
          <div className="row fixed-100" ref={containerRef}>
            <div className="years">
              {Object.entries(decades).map(([decade, years], index) => {
                return (
                  <div key={index} className={selectedDec === decade ? `year active counts-${years.length}`: "year"}>
                    <div className="left">
                      <p
                        style={
                          selectedDec === decade
                            ? { fontWeight: "bold" }
                            : { fontWeight: "normal" }
                        }
                      >
                        {decade}s
                      </p>
                      <button
                        className={
                          selectedDec === decade && showYears
                            ? "decade show"
                            : "decade hide"
                        }
                        value={decade}
                        onClick={() => handleYearSelector(decade)}
                      >
                        {selectedDec === decade && showYears ? (
                          <BiMinus />
                        ) : (
                          <BiPlus />
                        )}
                      </button>
                    </div>
                    <div
                      className={
                        selectedDec === decade && showYears
                          ? `right open-${years.length}`
                          : `right collapsed-${years.length}`
                      }
                      // style={
                      //   selectedDec === decade && showYears
                      //     ? { display: "flex" }
                      //     : { display: "none" }
                      // }
                    >
                      {decades && selectedDec && decades[selectedDec].map((year, index) => {
                        if (selectedDec === decade && showYears)
                          return (
                            <div
                              className="y-res"
                              key={index}
                              onClick={() => setSelectedYear(year)}
                            >
                              <button>{year}</button>
                              <div className="vl"></div>
                            </div>
                          );
                      })}
                      <hr className="dash" />
                    </div>

                    <hr
                      className={
                        selectedDec === decade && showYears ? "solid hide" : "solid show"
                      }
                    ></hr>
                  </div>
                )}
              )}
            </div>
          </div>
        )}}
    </TimelineContext.Consumer>
  );
};

export default YearSelector;
