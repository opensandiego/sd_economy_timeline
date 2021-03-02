import React from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import TimelineContext from "../TimelineContext";
import "./year-selector.scss";

const YearSelector = ({setSelectedYear}) => {
  const dummyResults = [
    {
      category: "Military",
      description: "NAVWAR Redevelopment Exclusivity Agreement",
      year: "2020",
    },
    {
      category: "Mobility",
      description:
        "Launched South Bay Rapid Service between the Otay Mesa Transit Center (at the Otay Mesa international border crossing), the communities of eastern Chula Vista, and downtown San Diego.",
      year: "2019",
    },
    {
      category: "Mobility",
      description: "dockless mobility exploded in San Diego",
      year: "2018",
    },
    {
      category: "Political",
      description: "Paul McNamara elected Mayor of Escondido",
      year: "2018",
    },
  ];
  return (
    <TimelineContext.Consumer>
      {({ selectedDec, showYears, handleYearSelector, decades, setSelectedYear }) => {
        return (
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
        )}}
    </TimelineContext.Consumer>
  );
};

export default YearSelector;
