import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './backgroundTooltip.scss'
const tooltipHeight = 60

const BackgroundTooltip = ({ description, bounds, setSelectedBackgroundRegion }) => {
  const position = {
    left: `${(bounds[0] + bounds[2]) / 2}px`,
    top: `${bounds[3] - tooltipHeight}px`
  }
  return (
    <div className='tooltip' style={position} onClick={() => setSelectedBackgroundRegion(null)}>
      <div className='close'>
        <button onClick={() => {
          setSelectedBackgroundRegion(null)
        }}>
          <VscChromeClose size={18} />
        </button>
      </div>
      <div className='description'>{description || 'No description available.'}</div>
    </div>
  )
}

export default BackgroundTooltip
