import React from 'react'
import {
  BsX,
  BsCheckBox,
  BsSquare,
  BsInfoCircle
} from "react-icons/bs"
import './sidebar.css'

const selectedSectors = [
  'Civic',
  'Mobility',
  'Military',
  'Political',
  'Tourism'
]

const allSectors = [
  ...selectedSectors,
  'Healthcare',
  'Tech',
  'Manufacturing',
  'Goods Movement',
  'Tribal',
  'Crossborder',
  'Landuse'
]

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-title'>
        A History of San Diego
      </div>

      <div className='sidebar-label'>
        Filtered By:
      </div>
      <div className='selected-sectors'>
        {selectedSectors.map(sector => (
          <div className='sector-filter-tag' key={sector}>
            <BsX />{sector}
          </div>
        ))}
      </div>

      <div className='sidebar-label'>
        Key Sectors
      </div>
      <div className='active-sectors'>
        {selectedSectors.map(sector => (
          <div className='key-sector-selector' key={sector}>
            <BsCheckBox />{sector}<BsInfoCircle />
          </div>
        ))}
      </div>

      <div className='sidebar-label'>
        All Sectors
      </div>
      <div className='all-sectors'>
        {allSectors.map(sector => (
          <div className='all-sector-selector' key={sector}>
            <BsSquare />{sector}<BsInfoCircle />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
