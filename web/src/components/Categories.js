import React from 'react'
import { IoIosPin } from "react-icons/io";
import EventDataContext from '../EventDataContext'

const Categories = () => {
  return (
    <EventDataContext.Consumer>
      {({updateShowFilter}) => (
        <button className="categories button" onClick={updateShowFilter}>
          {" "}
          <IoIosPin />
          Categories
        </button>
      )}
    </EventDataContext.Consumer>
  )
}

export default Categories
