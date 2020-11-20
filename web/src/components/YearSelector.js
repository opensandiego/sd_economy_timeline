import React from "react";
import "./year-selector.css";

const YearSelector = ({ selectedDecade }) => {
  console.log("IN YEAR SELECTOR", selectedDecade);
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
    <div className="years">
      {/* pick a year...between 1900 and 2020 */}
      {decades.map((decade, index) => (
        <div key={index} className="year">
          <div className="left">
            <p>{decade}s</p>
            <button
              className={
                selectedDecade === decade ? "decade show" : "decade hide"
              }
            >
              {selectedDecade === decade ? "-" : "+"}
            </button>
          </div>
          {/* {selectedDecade === decade ? dummyResults.map((res, index) => {
            <div className="right" key={index}>{res.year}</div>
          }) : null} */}
          <div className="right" style={selectedDecade === decade ? {display: "flex"} : {display: "none"}}>
          {dummyResults.map((res, index) => {
              // selectedDecade === decade ? (
              //   <div key={index}>{res.year}</div>
              // ) : null;
              if(selectedDecade === decade)
               return <div key={index}><p>{res.year}</p><div className="vl"></div></div>
            })}
          </div>



          <hr className={selectedDecade === decade ? "dash" : "solid"}></hr>
        </div>
      ))}
    </div>
  );
};

export default YearSelector;
