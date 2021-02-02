import React from 'react'
import './arrows.scss'
import arrowsLeft from '../assets/sandag-timeline-arrows-left.svg'
import arrowsRight from '../assets/sandag-timeline-arrows-right.svg'

const Arrows = () => {
  return (
    <div className='zoom'>
      <img
        alt=''
        src={arrowsLeft}
        className='arrows left'
      />
      <img
        alt=''
        src={arrowsRight}
        className='arrows right'
      />
    </div>
  )
}

export default Arrows
