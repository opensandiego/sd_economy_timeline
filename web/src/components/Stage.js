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
    var screenWidth = width
    var screenHeight = Math.round(height * timelinePaddingExpansion);
    var pos = {
        top: screenHeight * vanishTop,
        topLeft: screenWidth * 0.5,
        topRight: screenWidth * 0.5,
        bottom: screenHeight * 1,
        bottomLeft: -screenWidth * .25 * timelinePaddingExpansion,
        bottomRight: screenWidth * endToScreenRatio * timelinePaddingExpansion
    }
    var distance = position.y;
    var hOffset = position.x;
    var itemWidth = pos.bottomRight - pos.bottomLeft;
    var vanishingHeight = pos.bottom - pos.top;
    var maxDistance = timeline3DLength;
    var k = 0.006;
    var widthOnScreen = itemWidth * Math.pow(Math.E, -k * (maxDistance - distance));
    var xPos = (width - widthOnScreen) / 2 + hOffset * widthOnScreen;
    var yPos = pos.top + (widthOnScreen / itemWidth) * vanishingHeight;
    var offset = Math.min(widthOnScreen / itemWidth * viewOffset);
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
