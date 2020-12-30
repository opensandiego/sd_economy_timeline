import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './popup.scss'

const Popup = ({ category, year, description, setEventForPopup }) => {

  return (
    <div className='eventPopupWrapper' onClick={() => setEventForPopup(null)}>
      <div className='eventPopup'>
        <div className='title'>
          <span className='year'>{year}:  </span>
          <span className='category'>{category}</span>
        </div>
        <div className='close'>
          <button onClick={() => {
            setEventForPopup(null)
          }}>
            <VscChromeClose size={18} />
          </button>
        </div>
        <div className='description'>{description || 'No description available.'}</div>
      </div>
    </div>
  )
}

export default Popup
