import React, { createContext, useState, useEffect } from "react";
import timelineService from "./timelineService";

//  -------- for testing --------
//const selectedSectorsDefault = [
//   "Civic",
//   "Transportation",
//   "Military",
//   "Innovation",
//   "Tourism",
// ];
// const keySectorsDefault = [
//   "Civic",
//   "Mobility",
//   "Military",
//   "Political",
//   "Tourism",
// ];
// const allSectorsDefault = [
//   "Healthcare",
//   "Tech",
//   "Manufacturing",
//   "Goods Movement",
//   "Tribal",
//   "Crossborder",
//   "Landuse",
// ];
//  -------- for testing --------

const selectedSectorsDefault = [
  "Civic",
  "Transportation",
  "Tourism",
  "Innovation",
  "Military",
];
const keySectorsDefault = [
  {name: "Civic", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Transportation", desc: `A historic look at the evolution of transportation in the San Diego region.`},
  {name: "Tourism", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Innovation", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing selit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Military", desc: `San Diego’s location on the Pacific Ocean is ideal for many military operations in the southwest portion of the country. San Diego’s military installations include a variety of sizes and uses, and provide a large employment base for the region.`},
];
const allSectorsDefault = [
  {name: "Tribal Nation", desc: `The San Diego region is home to 18 Native American reservations represented by 17 tribal governments, the most in any county in the United States. There are more than 73,000 acres of tribal reservation lands in the region. As sovereign domestic nations, tribal governments govern land use on their reservations and land holdings. SANDAG and the regional tribal governments work together to facilitate governmentto-government planning and coordination.`},
  {name: "Crossborder", desc: `The San Diego region’s borders are an important part of the San Diego Regional economy with strong ties to  its neighboring counties (Imperial County, Orange County, and Riverside County), the Republic of Mexico, and the 18 tribal governments.`},
  {name: "Historic Land Use", desc: `The San Diego region is located in the southwestern corner of the United States and is bordered by Mexico to the south, the Pacific Ocean to the west, Orange, and Riverside counties to the north, and Imperial County to the east. The San Diego region encompasses over 4,260 square miles and includes 18 incorporated cities, 17 tribal reservations, and unincorporated San Diego County.`},
  {name: "Education", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Retail", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Healthcare", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Manufacturing", desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim nunc leo, ac accumsan metus lacinia dictum. Integer accumsan finibus leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`},
  {name: "Goods Movement", desc: `Beyond people, the movement of goods and freight throughout the San Diego region is an important component for continued economic development. `},
  {name: "Professional", desc: ``}
];

const decadesDefault = [1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];

const TimelineContext = createContext({
  data: [],
  loaded: false,
  selectedDec: 2010,
  selectedSectors: [],
  keySectors: [],
  allSectors: [],
  showAllSectors: true,
  showFilter: false,
  decades: [],
  showYears: false,
});
export default TimelineContext;

export const TimelineContextProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDec, setSelectedDecade] = useState(null);
  const [selectedSectors, setSelectedSectors] = useState(
    selectedSectorsDefault
  );
  const [keySectors, setKeySectors] = useState(keySectorsDefault);
  const [allSectors, setAllSectors] = useState(allSectorsDefault);
  const [showAllSectors, setShowAllSectors] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [decades, setDecades] = useState(decadesDefault);
  const [showYears, setShowYears] = useState(false);

  const getEventData = async () => {
    setLoading(true);
    const events = await timelineService.readCSV();
    setData(events);
    setLoading(false);
  };
  useEffect(() => {
    getEventData();
  }, []);

  const updateSelectedSectors = (e, sector) => {
    const { checked } = e.target;
    if (checked) {
      if (selectedSectors.length === 5) {
        // TODO:  shows a message in the UI for this
        console.log("you can only select 5 sectors at a time");
        return;
      } else {
        setSelectedSectors([...selectedSectors, e.target.value]);
      }
    }
    if (!checked) {
      const nextSectors = [...selectedSectors];
      const sectorToRemove = nextSectors.indexOf(sector);
      nextSectors.splice(sectorToRemove, 1);
      setSelectedSectors(nextSectors);
    }
  };

  const updateShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const updateShowAllSectors = () => {
    setShowAllSectors(!showAllSectors);
  };

  const removeSector = (sector) => {
    let index = selectedSectors.indexOf(sector);
    let newSelected = [...selectedSectors];
    newSelected.splice(index, 1);
    setSelectedSectors(newSelected);
  };

  const clearSelectedSectors = () => {
    setSelectedSectors([]);
  };
  const handleYearSelector = (decade) => {
    if (selectedDec === decade) {
      setShowYears(!showYears); //if user is "minimizing" the decade/selecting the same decade
    } else {//if the user is selecting a new decade
      updateSelectedDecade(decade);
      setShowYears(true);
    } //if the user is selecting a new decade
  };

  const updateSelectedDecade = (value) => {
    console.log("beep boop bop - you've selected this decade:", value)
    setSelectedDecade(value);
  };

  const value = {
    loading,
    data,
    showFilter,
    showAllSectors,
    selectedSectors,
    keySectors,
    allSectors,
    selectedDec,
    decades,
    showYears,
    updateSelectedSectors,
    removeSector,
    clearSelectedSectors,
    updateShowFilter,
    updateShowAllSectors,
    updateSelectedDecade,
    handleYearSelector,
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};
