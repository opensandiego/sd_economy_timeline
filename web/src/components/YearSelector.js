import React from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import TimelineContext from "../TimelineContext"
import "./year-selector.css";

const YearSelector = () => {
  // console.log("IN YEAR SELECTOR", selectedDecade);
  const decades = [
    2010,
    2000,
    1990,
    1980,
    1970,
    1960,
    1950,
    1940,
    1930,
    1920,
    1910,
    1900,
    1890,
    1880,
    1870,
    1860,
    1850,
  ];

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
      {({ selectedDec, updateSelectedDecade }) => (
        <div className="years">
          {decades.map((decade, index) => (
            <div key={index} className="year">
              <div className="left">
                <p>{decade}s</p>
                <button
                  className={
                    selectedDec === decade ? "decade show" : "decade hide"
                  }
                  value={decade}
                  onClick={() =>
                    updateSelectedDecade(decade)
                  }
                >
                  {selectedDec === decade ? <BiMinus /> : <BiPlus />}
                </button>
              </div>
              <div
                className="right"
                style={
                  selectedDec === decade
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                {dummyResults.map((res, index) => {
                  if (selectedDec === decade)
                    return (
                      <div key={index}>
                        <button>{res.year}</button>
                        <div className="vl"></div>
                      </div>
                    );
                })}
              </div>

              <hr className={selectedDec === decade ? "dash" : "solid"}></hr>
            </div>
          ))}
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default YearSelector;
