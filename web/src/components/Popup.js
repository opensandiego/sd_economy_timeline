import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './popup.css'

const Popup = ({ category, year, description, setEventForPopup }) => {

  return (
    <div className='eventPopup'>
      <div className='close'>
        <button onClick={() => {
          console.log('closing!')
          setEventForPopup(null)
        }}>
          <VscChromeClose size={18} />
        </button>
      </div>
      <div>{year}: {category}</div>
      <div>{description || 'No description available.'}</div>
    </div>
  )
}

export default Popup
