import React, {
  createContext,
  useState,
  useEffect
} from 'react'
import timelineService from './timelineService'

const selectedSectorsDefault = ["Civic", "Mobility", "Military", "Political", "Tourism"]
const keySectorsDefault = ["Civic", "Mobility", "Military", "Political", "Tourism"]
const allSectorsDefault = [
  "Healthcare",
  "Tech",
  "Manufacturing",
  "Goods Movement",
  "Tribal",
  "Crossborder",
  "Landuse",
]
const Context = createContext({
  data: [],
  loaded: false,
  selectedDec: 2010,
  selectedSectors: [],
  keySectors: [],
  allSectors: [],
  showAllSectors: true,
  showFilter: false,
})
export default Context

export const EventDataProvider  = ({children}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [selectedSectors, setSelectedSectors] = useState(selectedSectorsDefault)
  const [keySectors, setKeySectors] = useState(keySectorsDefault)
  const [allSectors, setAllSectors] = useState(allSectorsDefault)
  const [showAllSectors, setShowAllSectors] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const getEventData = async () => {
    setLoading(true)
    const events = await timelineService.readCSV()
    setData(events)
    setLoading(false)
  }
  useEffect(() => {
    getEventData()
  }, [])

  const updateSelectedSectors = (e, sector) => {
    const { checked } = e.target
    if (checked) {
      if (selectedSectors.length === 5) {
        // TODO:  shows a message in the UI for this
        console.log("you can only select 5 sectors at a time");
        return
      } else {
        setSelectedSectors([...selectedSectors, e.target.value])
      }
    }
    if (!checked) {
      const nextSectors = [ ...selectedSectors ]
      const sectorToRemove = nextSectors.indexOf(sector)
      nextSectors.splice(sectorToRemove, 1)
      setSelectedSectors(nextSectors)
    }
  }

  const updateShowFilter = () => {
    console.log('toggling filter')
    setShowFilter(!showFilter)
  }

  const updateShowAllSectors = () => {
    setShowAllSectors(!showAllSectors)
  }

  const removeSector = (sector) => {
    let index = selectedSectors.indexOf(sector);
    let newSelected = [ ...selectedSectors ]
    newSelected.splice(index, 1);
    setSelectedSectors(newSelected)
  }

  const clearSelectedSectors = () => {
    setSelectedSectors([])
  }

  const value = {
    loading,
    data,
    showFilter,
    showAllSectors,
    selectedSectors,
    keySectors,
    allSectors,
    updateSelectedSectors,
    removeSector,
    clearSelectedSectors,
    updateShowFilter,
    updateShowAllSectors
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

