import React, {
  useRef
} from "react";
import { BiMinus } from "react-icons/bi";
import TimelineContext from "../TimelineContext";
import "./year-selector.scss";
import { ReactComponent as Plussign } from '../assets/plusSignwcircle.svg';


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
      {({ previousDecade, selectedDec, showYears, handleYearSelector, decades, setSelectedYear, timelineScroll }) => {
        if (!selectedDec && !previousDecade) {
          updateTimelineScroll(timelineScroll.fraction)
        }
        return (
          <div className="row fixed-100" ref={containerRef}>
            <div className="years">
              {Object.entries(decades).map(([decade, years], index) => {
                const scrolledDecade = timelineScroll.stageDecade === decade ? 'selected' : ''
                const classes = selectedDec === decade ? `year active counts-${years.length} ${scrolledDecade}`: `year ${scrolledDecade}`
                return (
                  <div key={index} className={classes}>
                    <div className="left">
                      <p
                        style={
                          selectedDec === decade
                            ? { cursor: "pointer", fontWeight: "bold" }
                            : { cursor: "pointer", fontWeight: "normal" }
                        }
                        onClick={() => setSelectedYear(decade)}
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
                          //<BiPlus />
                          <Plussign />
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
