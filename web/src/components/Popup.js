import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './popup.css'

const Popup = ({ category, year, description, setEventForPopup }) => {

  return (
    <div className='eventPopupWrapper' onClick={() => setEventForPopup(null)}>
      <div className='eventPopup'>
        <div className='close'>
          <button onClick={() => {
            setEventForPopup(null)
          }}>
            <VscChromeClose size={18} />
          </button>
        </div>
        <div>{year}: {category}</div>
        <div>{description || 'No description available.'}</div>
      </div>
    </div>
  )
}

export default Popup
