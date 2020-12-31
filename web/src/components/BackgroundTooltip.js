import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'

const BackgroundTooltip = ({ description, bounds, setSelectedBackgroundRegion }) => {

  return (
    <div className='eventPopupWrapper' onClick={() => setSelectedBackgroundRegion(null)}>
      <div className='eventPopup'>
        <div className='title'>
          {description}
        </div>
        <div className='close'>
          <button onClick={() => {
            setSelectedBackgroundRegion(null)
          }}>
            <VscChromeClose size={18} />
          </button>
        </div>
        <div className='description'>{description || 'No description available.'}</div>
      </div>
    </div>
  )
}

export default BackgroundTooltip
