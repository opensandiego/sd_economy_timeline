import React from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import TimelineContext from "../TimelineContext";
import "./year-selector.css";

const YearSelector = () => {
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
      {({ selectedDec, showYears, handleYearSelector, decades }) => (
        <div className="years">
          {decades.map((decade, index) => (
            <div key={index} className="year">
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
                    ? "right open"
                    : "right collapsed"
                }
                // style={
                //   selectedDec === decade && showYears
                //     ? { display: "flex" }
                //     : { display: "none" }
                // }
              >
                {dummyResults.map((res, index) => {
                  if (selectedDec === decade && showYears)
                    return (
                      <div key={index}>
                        <button>{res.year}</button>
                        <div className="vl"></div>
                      </div>
                    );
                })}
                <hr
                  className="dash"
                ></hr>
              </div>

              <hr
                className={
                  selectedDec === decade && showYears ? "solid hide" : "solid show"
                }
              ></hr>
            </div>
          ))}
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default YearSelector;
