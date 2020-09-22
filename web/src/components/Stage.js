import React, {
  useRef
} from 'react'
import './stage.scss'

const Stage = props => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  console.log('refs', containerRef, sceneRef)

  return (
    <div className='stage' ref={containerRef}>
      <div className='viewport'>
        <div className='scene3D-container'>
          <div className='scene3D' ref={sceneRef}>
            Timeline events...
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stage
