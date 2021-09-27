import React, {
  useRef
} from "react";
import { BiMinus } from "react-icons/bi";
import TimelineContext from "../TimelineContext";
import "./year-selector.scss";
import { ReactComponent as Plussign } from '../assets/plusSignwcircle.svg';
import eras from './eras'

const erasWithGenericLabel = eras.filter(era => era.genericYearSelectorLabel)
const FUTURE = 3000

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
        // Integrate the labels for pre-colonial and colonization
        const decadesWithGenericLabels = Object.entries(decades)
          // order the decades correctly
          .sort((a, b) => {
            const aYears = a[1]
            const bYears = b[1]
            if (!aYears.length || !bYears.length) return

            let aFirstYear = aYears[0]
            let bFirstYear = bYears[0]
            if (aFirstYear > FUTURE) {
              aFirstYear *= -1
            }
            if (bFirstYear > FUTURE) {
              bFirstYear *= -1
            }
            return aFirstYear - bFirstYear
          })
          // update decade labels with the required labels
          .map(([decade, years]) => {
            let updatedDecadeLabel = decade
            let lastYearInDecade = +years[years.length - 1]
            if (lastYearInDecade > FUTURE) {
              lastYearInDecade *= -1
            }
            erasWithGenericLabel.forEach(era => {
              if (lastYearInDecade >= era.start && lastYearInDecade < era.end) {
                updatedDecadeLabel = era.title
              }
            })
            return [updatedDecadeLabel, years]
          })
          // combine labeled decades and retain all years
          .reduce((acc, cur) => {
            let [decade, years] = cur
            const existingDecade = acc.find(([label, existingYears]) => label === decade)
            if (existingDecade) {
              existingDecade[1] = [ ...existingDecade[1], ...years ]
            } else {
              acc.push([decade, years])
            }
            return acc
          }, [])

        return (
          <div className="row fixed-100" ref={containerRef}>
            <div className="years">
              {decadesWithGenericLabels.map(([decade, years], index) => {
                const scrolledDecade = timelineScroll.stageDecade === decade ? 'selected' : ''
                const wide = +decade ? '' : 'wide' // allow text labels to take the required space on a single line
                const classes = selectedDec === decade ?
                  `year active counts-${years.length} ${scrolledDecade} ${wide}`:
                  `year ${scrolledDecade} ${wide}`
                return (
                  <div key={index} className={classes}>
                    <div className="left">
                      <p
                        style={
                          selectedDec === decade
                            ? { cursor: "pointer", fontWeight: "bold" }
                            : { cursor: "pointer", fontWeight: "normal" }
                        }
                        onClick={() => setSelectedYear(years[0])}
                      >
                        {+decade ? `${decade}s` : decade}
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
                      {decades && selectedDec && years.map((year, index) => {
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
