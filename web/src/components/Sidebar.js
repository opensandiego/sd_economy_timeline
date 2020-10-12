import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { BiMinus, BiPlus } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
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
      {({
        selectedSectors,
        keySectors,
        allSectors,
        showKSector,
        showASector,
        handleCheckbox,
        removeSector,
        clearFilter,
        toggleShowKSector,
        toggleShowASector,
        toggleShowFilter
      }) => (
        <div className="column fixed-300">
          <div className="sidebar">
            <div className="close"><button onClick={toggleShowFilter}><VscChromeClose /></button></div>
            {/* <div className="sidebar-title">A History of San Diego</div> */}

            <div className="sidebar-label">
              <p>Filtered By:</p>
              <button className="clear" onClick={clearFilter}>
                Clear all
              </button>
            </div>

            {selectedSectors.length === 0 ? (
              <p className="empty">No sectors selected</p>
            ) : (
              <div className="selected-sectors">
                {selectedSectors.map((sector) => (
                  <div className="sector-filter-tag" key={sector}>
                    <button onClick={(e) => removeSector(sector)}>
                      <VscChromeClose />
                    </button>
                    {sector}
                  </div>
                ))}
              </div>
            )}

            <div className="sidebar-label">
              <p>Key Sectors</p>
              {showKSector ? (
                <p onClick={toggleShowKSector}>
                  <BiMinus />
                </p>
              ) : (
                <p onClick={toggleShowKSector}>
                  <BiPlus />
                </p>
              )}
            </div>
            {showKSector ? (
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
            ) : null}

            <div className="sidebar-label">
              <p>All Sectors</p>
              {showASector ? (
                <p onClick={toggleShowASector}>
                  <BiMinus />
                </p>
              ) : (
                <p onClick={toggleShowASector}>
                  <BiPlus />
                </p>
              )}
            </div>
            {showASector ? (
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
            ) : null}
          </div>
        </div>
      )}
    </TimelineContext.Consumer>

  );
};

export default Sidebar;
