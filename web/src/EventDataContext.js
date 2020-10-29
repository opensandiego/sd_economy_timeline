import React, {
  createContext,
  useState,
  useEffect
} from 'react'
import timelineService from './timelineService'

const Context = createContext({
  data: [],
  loaded: false
})
export default Context

export const EventDataProvider  = ({children}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const getEventData = async () => {
    setLoading(true)
    const events = await timelineService.readCSV()
    setData(events)
    setLoading(false)
  }
  useEffect(() => {
    getEventData()
  }, [])

  const value = {
    loading,
    data
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

