import React, {
  useRef,
  useEffect
} from 'react'
import './stage.scss'

const Stage = props => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
  const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
  const width = 600
  const height = 600
  const canvasStyle = {
    width: `${width}px`,
    height: `${height}px`
  }
  const timeline3DLength = 1000
  const timelineGradColor = 'rgb(24,105,169' // sdforward blue...

  const timelineToScreen = position => {
    const timelinePaddingExpansion = 1.2
    const endToScreenRatio = 1.40833
    const viewOffset = 0
    const vanishTop = 0.2016
    const screenWidth = width
    const screenHeight = Math.round(height * timelinePaddingExpansion);
    const pos = {
        top: screenHeight * vanishTop,
        topLeft: screenWidth * 0.5,
        topRight: screenWidth * 0.5,
        bottom: screenHeight * 1,
        bottomLeft: -screenWidth * .25 * timelinePaddingExpansion,
        bottomRight: screenWidth * endToScreenRatio * timelinePaddingExpansion
    }
    const distance = position.y;
    const hOffset = position.x;
    const itemWidth = pos.bottomRight - pos.bottomLeft;
    const vanishingHeight = pos.bottom - pos.top;
    const maxDistance = timeline3DLength;
    const k = 0.006;
    const widthOnScreen = itemWidth * Math.pow(Math.E, -k * (maxDistance - distance));
    const xPos = (width - widthOnScreen) / 2 + hOffset * widthOnScreen;
    const yPos = pos.top + (widthOnScreen / itemWidth) * vanishingHeight;
    const offset = Math.min(widthOnScreen / itemWidth * viewOffset);
    return {
        x: xPos + offset,
        y: yPos - 10,
        sliceWidth: widthOnScreen,
        offset: offset
    }
  }

  useEffect(() => {
    const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
    console.log('vanishing point', vanishingPoint)
    const canvasContext = canvasRef.current.getContext('2d')
    canvasContext.clearRect(0, 0, width, height)
    canvasContext.scale(deviceScale, deviceScale)

    const numCols = 1
    for (var endPt = 0; endPt <= numCols; endPt++) {
      var end = timelineToScreen({
        x: endPt / numCols,
        y: timeline3DLength
      })
      console.log('end', end)
      canvasContext.beginPath();
      var gradient = canvasContext.createLinearGradient(vanishingPoint.x, vanishingPoint.y, end.x, end.y);
      gradient.addColorStop(0, `${timelineGradColor},0)`)
      gradient.addColorStop(0.06, `${timelineGradColor},0)`)
      gradient.addColorStop(0.8, `${timelineGradColor},1)`)
      gradient.addColorStop(1, `${timelineGradColor},1)`)
      canvasContext.strokeStyle = gradient;
      canvasContext.moveTo(vanishingPoint.x, vanishingPoint.y)
      canvasContext.lineTo(end.x, end.y)
      canvasContext.closePath()
      canvasContext.stroke()
    }

    const handler = function (event) {
      // const orgEvent = event || window.event
        // , args = [].slice.call(arguments, 1)
      let delta = 0
        // , deltaX = 0
        // , deltaY = 0;
      // event = $.event.fix(orgEvent);
      // event.type = 'mousewheel'
      if (event.wheelDelta) {
          delta = event.wheelDelta / 120;
      }
      if (event.detail) {
          delta = -event.detail / 3;
      }
      // deltaY = delta;
      // if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
      //     deltaY = 0;
      //     deltaX = -1 * delta;
      // }
      // if (orgEvent.wheelDeltaY !== undefined) {
      //     deltaY = orgEvent.wheelDeltaY / 120;
      // }
      // if (orgEvent.wheelDeltaX !== undefined) {
      //     deltaX = -1 * orgEvent.wheelDeltaX / 120;
      // }
      // args.unshift(event, delta, deltaX, deltaY);
      console.log('wheel...', delta)
      // return $.event.handle.apply(this, args);
    }
    containerRef.current.addEventListener('mousewheel', handler, {
      passive: false
    })

    return () => {
      containerRef.current.removeEventListener('mousewheel', handler, false)
    }
  }, [])

  console.log('refs', containerRef, sceneRef)

  return (
    <div className='stage' ref={containerRef}>
      <div className='viewport'>
        <div className='scene3D-container'>
          <div className='scene3D' ref={sceneRef}>
            <h2>Timeline events...</h2>
            <canvas
              ref={canvasRef}
              style={canvasStyle}
              width={`${width * deviceScale}`}
              height={`${height * deviceScale}`}
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stage
