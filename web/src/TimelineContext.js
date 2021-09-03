import React, { createContext, useState, useEffect, useRef } from "react";
import timelineService from "./timelineService";
import eras from './components/eras'

const earliestEraStart = eras
  .map(era => era.start)
  .reduce((oldest, current) => {
    return current < oldest ? current : oldest
  }, new Date().getFullYear())

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
  aboutDescription: null,
  storiesList: [],
  selectedStory: null,
  openMenuItem: ""

});
export default TimelineContext;

export const TimelineContextProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDec, setSelectedDecade] = useState(null);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [allSectors, setAllSectors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [decades, setDecades] = useState(decadesDefault);
  const [showYears, setShowYears] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [timelineScroll, setTimelineScroll] = useState({
    fraction: 0,
    currentDecade: null
  });
  const [summaryDescription, setSummaryDescription] = useState(null);
  const [aboutDescription, setAboutDescription] = useState(null);
  const [showCategories, setShowCategories] = useState(true);
  const [showStories, setShowStories] = useState(false);
  const [storiesList, setStoriesList] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [openMenuItem, setOpenMenuItem] = useState("");

  const previouslySelectedDecade = useRef(null)
  useEffect(() => {
    previouslySelectedDecade.current = selectedDec
  })
  const previousDecade = previouslySelectedDecade.current

  const buildDecades = events => {
    const numericYears = events.filter(event => +event.Year >= earliestEraStart)
    let decades = {}
    if (numericYears.length) {
      numericYears.forEach(event => {
        const year = event.Year
        const decadeStart = `${year.slice(0, 3)}0`
        if (!Object.keys(decades).includes(decadeStart)) {
          decades[decadeStart] = [year]
        }
        if (!decades[decadeStart].includes(year)) {
          decades[decadeStart].push(year)
        }
      })
    } else {
      for (let i = 185; i <= 202; i++){
        decades[`${i}0`] = []
      }
    }
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
  const getStoriesList = async () => {
    const res = await timelineService.readStories();
    setStoriesList(res);

  }
  useEffect(() => {
    getStoriesList();
  }, [])
  const getCategoryData = async () => {
    const response = await timelineService.readCategories();
    setSelectedSectors(response.slice(0, 5).map(sector => sector.name))
    // setSelectedSectors(["Education"])
    setAllSectors(response)
  }

  useEffect(() => {
    getCategoryData();
  }, [])

  useEffect(() => {
    if (!data) return
    let eventsForSelected
    if (selectedStory) {
      const standardized = selectedStory.replace(/[^a-zA-Z]/g, '').toLowerCase()
      eventsForSelected = data.filter(event => event.StoryStandardized === standardized)
    } else {
      eventsForSelected = data.filter(event => selectedSectors.includes(event.Category))
    }
    const decades = buildDecades(eventsForSelected)
    setDecades(decades)
    setTimelineScroll({ fraction: 0, stageDecade: Object.keys(decades)[0] })
  }, [
    data,
    selectedSectors,
    selectedStory
  ])

  const updateSelectedSectors = (e, sector) => {
    const { checked } = e.target;
    if (checked) {
      if (selectedSectors.length === 5) {
        // TODO:  shows a message in the UI for this
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
      updateSelectedDecade(null);
    } else {//if the user is selecting a new decade
      updateSelectedDecade(decade);
      setShowYears(true);
    } //if the user is selecting a new decade
  };

  const updateSelectedDecade = (value) => {
    setSelectedDecade(value);
  };

  const outsideClickUpdate = () => {
    setShowFilter(false);
  }

  const getAboutDescription = async () => {
    const res = await timelineService.readDescription();
    setSummaryDescription(res[0].summary);
    setAboutDescription(res[0].about);
  }
  useEffect(() => {
    getAboutDescription();
  }, []);

  const updateSelectedStory = (val) => {
    setSelectedStory(val);
  }

  const updateOpenMenuItem = (item) => {
    if (item === openMenuItem) {
      setOpenMenuItem("")
    } else setOpenMenuItem(item);
    
  }


  const value = {
    loading,
    data,
    showFilter,
    selectedSectors,
    allSectors,
    previousDecade,
    selectedDec,
    decades,
    showYears,
    selectedYear,
    timelineScroll,
    aboutDescription,
    summaryDescription,
    showCategories,
    showStories,
    storiesList,
    selectedStory,
    openMenuItem,
    setTimelineScroll,
    setSelectedYear,
    updateSelectedSectors,
    removeSector,
    clearSelectedSectors,
    updateShowFilter,
    updateSelectedDecade,
    handleYearSelector,
    outsideClickUpdate,
    getAboutDescription,
    setShowCategories,
    setShowStories,
    updateSelectedStory,
    updateOpenMenuItem
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};
