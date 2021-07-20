import React from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import './popup.scss'

const publicPath = `${process.env.PUBLIC_URL}/photos/`

const Popup = ({ category, year, description, image, setEventForPopup }) => {

  const showImage = () => {
    const popupImage = image ?
      <img src={`${publicPath}${image}`} /> :
      null
    return popupImage
  }

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
        <div className='description'>
          {showImage()}
          <span>{description || 'No description available.'}</span>
        </div>
      </div>
    </div>
  )
}

export default Popup
