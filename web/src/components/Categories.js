import React from 'react'
import { VscChromeClose } from "react-icons/vsc";
import TimelineContext from '../TimelineContext'
import { ReactComponent as CatIcon } from '../assets/categories_icon.svg'
import './categories.scss'

const Categories = () => {
  return (
    <TimelineContext.Consumer>
      {({selectedSectors, removeSector, updateShowFilter, selectedStory, updateSelectedStory, smallScreen}) => {
        if (smallScreen) return <></>
        return (
          <div className="fixed background-blur">
            <button className="categories button" onClick={updateShowFilter}>
              <CatIcon />
              Categories
            </button>
            {selectedSectors.length > 0 && !selectedStory &&
              <div className="category-quick-look">
                <div className="category-quick-look-heading">Filtered by:</div>
                <div className="category-quick-look-selected">
                  {selectedSectors.map(sector => {
                    return (
                      <div
                        key={`category-pill-${sector}`}
                        onClick={(e) => removeSector(sector)}
                      >
                        <VscChromeClose />
                        {sector}
                      </div>
                    )
                  })}
                </div>
              </div>
            }
            {selectedStory &&
              <div className="category-quick-look">
                <div className="category-quick-look-heading">Filtered by:</div>
                <div className="category-quick-look-selected">
                  <div
                    key={`category-pill-${selectedStory}`}
                    onClick={() => updateSelectedStory(null)}
                  >
                    <VscChromeClose />
                    {selectedStory}
                  </div>
                </div>
              </div>
            }
          </div>
        )
      }}
    </TimelineContext.Consumer>
  )
}

export default Categories
