import React, { createContext, useState, useEffect } from "react";
import timelineService from "./timelineService";

const decadesDefault = { 1850: [], 1860: [], 1870: [], 1880: [], 1890: [], 1900: [], 1910: [], 1920: [], 1930: [], 1940: [], 1950: [], 1960: [], 1970: [], 1980: [], 1990: [], 2000: [], 2010: [], 2020: [] };

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
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [allSectors, setAllSectors] = useState([]);
  const [showAllSectors, setShowAllSectors] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [decades, setDecades] = useState(decadesDefault);
  const [showYears, setShowYears] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const buildDecades = events => {
    const after1850 = events.filter(event => +event.Year >= 1850)
    let decades = {}
    after1850.forEach(event => {
      const year = event.Year
      const decadeStart = `${year.slice(0, 3)}0`
      if (!Object.keys(decades).includes(decadeStart)) {
        decades[decadeStart] = [year]
      }
      if (!decades[decadeStart].includes(year)) {
        decades[decadeStart].push(year)
      }
    })
    // console.log('decades', decades)
    return decades
  }

  const getEventData = async () => {
    setLoading(true);
    const events = await timelineService.readCSV();
    setData(events);
    setDecades(buildDecades(events));
    setLoading(false);
  };

  useEffect(() => {
    getEventData();
  }, []);

  const getCategoryData = async () => {
    const response = await timelineService.readCategories();
    setSelectedSectors(response.slice(0, 5).map(sector => sector.name))
    setAllSectors(response)
  }

  useEffect(() => {
    getCategoryData();
  }, [])

  useEffect(() => {
    if (!data) return
    const eventsForSelectedSectors = data.filter(event => selectedSectors.includes(event.Category))
    setDecades(buildDecades(eventsForSelectedSectors))
  }, [
    data,
    selectedSectors
  ])

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
      const sectorToRemove = nextSectors.indexOf(sector.name);
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

  const outsideClickUpdate = () => {
    setShowFilter(false);
  }

  const value = {
    loading,
    data,
    showFilter,
    showAllSectors,
    selectedSectors,
    allSectors,
    selectedDec,
    decades,
    showYears,
    selectedYear,
    setSelectedYear,
    updateSelectedSectors,
    removeSector,
    clearSelectedSectors,
    updateShowFilter,
    updateShowAllSectors,
    updateSelectedDecade,
    handleYearSelector,
    outsideClickUpdate
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};
