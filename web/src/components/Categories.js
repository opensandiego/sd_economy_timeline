import React from 'react'
import { FaFilter } from "react-icons/fa"
import TimelineContext from '../TimelineContext'

const Categories = () => {
  return (
    <TimelineContext.Consumer>
      {({updateShowFilter}) => (
        <button className="categories button" onClick={updateShowFilter}>
          {" "}
          <FaFilter />
          Categories
        </button>
      )}
    </TimelineContext.Consumer>
  )
}

export default Categories
