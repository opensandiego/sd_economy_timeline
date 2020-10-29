import React from 'react'
import { IoIosPin } from "react-icons/io";
import TimelineContext from '../TimelineContext'

const Categories = () => {
  return (
    <TimelineContext.Consumer>
      {({updateShowFilter}) => (
        <button className="categories button" onClick={updateShowFilter}>
          {" "}
          <IoIosPin />
          Categories
        </button>
      )}
    </TimelineContext.Consumer>
  )
}

export default Categories
