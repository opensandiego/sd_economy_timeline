import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './backgroundTooltip.scss'
const tooltipHeight = 60

const BackgroundTooltip = ({ description, bounds, setSelectedBackgroundRegion }) => {
  const left = bounds[0] > 700 ? 700 : bounds[0]
  const top = (bounds[3] - tooltipHeight) < 10 ? 10 : bounds[3] - tooltipHeight
  const position = {
    left: `${left}px`,
    top: `${top}px`
  }
  return (
    <div className='tooltip' style={position} onClick={() => setSelectedBackgroundRegion(null)}>
      <div className='description'>{description || 'No description available.'}</div>
      <div className='close'>
        <button onClick={() => {
          setSelectedBackgroundRegion(null)
        }}>
          <VscChromeClose size={12} />
        </button>
      </div>
    </div>
  )
}

export default BackgroundTooltip
