import React from 'react'
import sdForwardLogo from '../sdForwardLogo.png'

const Header = () => {
  return (
    <div className='header'>
      <img
        src={sdForwardLogo}
        alt='San Diego Forward Logo'
        className='logo'
      />
    </div>
  )
}

export default Header
