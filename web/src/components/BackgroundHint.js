import React from 'react'
import { FaHandPointUp } from 'react-icons/fa'
import './backgroundHint.scss'

const BackgroundHint = () => {
  return (
    <div className='background-hint'>
      <div className='icon'>
        <div className='action-container'>
          <div className='action' />
          <div className='action' />
          <div className='action' />
        </div>
        <FaHandPointUp />
      </div>
      <div className='hint'>
        Tap on objects to learn about iconic sites in the San Diego region!
      </div>
    </div>
  )
}

export default BackgroundHint
