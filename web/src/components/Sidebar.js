import React from "react";
import { BsX, BsCheckBox, BsSquare, BsInfoCircle } from "react-icons/bs";
import "./sidebar.css";
import TimelineService from "../timelineService";
import TimelineContext from "../TimelineContext";

// const selectedSectors = [
//   { label: "Civic", checked: true },
//   { label: "Mobility", checked: true },
//   { label: "Military", checked: true },
//   { label: "Political", checked: true },
//   { label: "Tourism", checked: true },
// ];

const keySectors = [
  { label: "Civic", checked: true },
  { label: "Mobility", checked: true },
  { label: "Military", checked: true },
  { label: "Political", checked: true },
  { label: "Tourism", checked: true },
];

// const allSectors = [
//   // ...keySectors,
//   { label: "Healthcare", checked: false },
//   { label: "Tech", checked: false },
//   { label: "Manufacturing", checked: false },
//   { label: "Goods Movement", checked: false },
//   { label: "Tribal", checked: false },
//   { label: "Crossborder", checked: false },
//   { label: "Landuse", checked: false },
// ];

// // const selectedSectors = [
// //   {label: 'Civic', checked: true},
// //   {label: 'Mobility', checked: true},
// //   {label: 'Military', checked: true},
// //   {label: 'Political', checked: true},
// //   {label: 'Tourism', checked: true},
// // ]

function handleCheckbox(e) {
  console.log("HANDLING CHECK", e.target.value, e.target.checked);
}

const Sidebar = () => {
  console.log("in sidebar");
  TimelineService.readCSV();

  return (
    <TimelineContext.Consumer>
      {({ selectedSectors, keySectors, allSectors, handleCheckbox, removeSector }) => (
        <div className="sidebar">
          <div className="sidebar-title">A History of San Diego</div>

          <div className="sidebar-label">Filtered By:</div>
          <div className="selected-sectors">
            {selectedSectors.map((sector) => (
              <div className="sector-filter-tag" key={sector}>
                <button onClick={(e) => removeSector(sector)}><BsX /></button>
                {sector}
              </div>
            ))}
          </div>

          <div className="sidebar-label">Key Sectors</div>
          <div className="active-sectors">
            {keySectors.map((sector) => (
              <div className="key-sector-selector" key={sector}>
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(sector)}
                  value={sector}
                  disabled={selectedSectors.length < 5 ? false : true}
                  onChange={(e) => handleCheckbox(e)}
                />
                <span className="key-sector-selector-item">{sector}</span>
                <BsInfoCircle />
              </div>
            ))}
          </div>

          <div className="sidebar-label">All Sectors</div>
          <div className="all-sectors">
            {allSectors.map((sector) => (
              <div className="all-sector-selector" key={sector}>
                <input
                  type="checkbox"
                  value={sector}
                  checked={selectedSectors.includes(sector)}
                  disabled={selectedSectors.length < 5 ? false : true}
                  onChange={(e) => handleCheckbox(e)}
                />
                <span className="all-sector-selector-item">{sector}</span>
                <BsInfoCircle />
              </div>
            ))}
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
    // <>
    // <div className="sidebar-label">Key Sectors</div>
    //       <div className="active-sectors">
    //         {keySectors.map((sector) => (
    //           <div className="key-sector-selector" key={sector.label}>
    //             <input
    //               type="checkbox"
    //               defaultChecked={true}
    //               value={sector.label}
    //               onChange={(e) => handleCheckbox(e)}
    //             />
    //             <span className="key-sector-selector-item">{sector.label}</span>
    //             <BsInfoCircle />
    //           </div>
    //         ))}
    //       </div>
    // </>
    
  );
};

export default Sidebar;
