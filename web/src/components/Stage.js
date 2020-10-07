import React, {
  useRef,
  useEffect
} from 'react'
import './stage.scss'

const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
const width = 600
const height = 600
const rectSide = 10
let rects = []
const x = width / 2 - rectSide / 2
const y = height/ 2 - rectSide / 2 - 250
for (let i = 1; i < 10; i++) {
  const rectY = y + (i * rectSide * 5)
  rects.push({
    x,
    y: rectY
  })
}

const Stage = props => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
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

    const drawBoundaries = () => {
      const numCols = 1
      for (var endPt = 0; endPt <= numCols; endPt++) {
        var end = timelineToScreen({
          x: endPt / numCols,
          y: timeline3DLength
        })
        // console.log('end', end)
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
    }

    // rects on the canvas
    const drawRects = (change = 0) => {
      console.log('drawRect change...', change)
      const nextRects = rects.map(rect => ({
        x: rect.x,
        // y: rect.y - (-change * 25) // <-- flip scroll direction
        y: rect.y - (change * 25)
      }))
      nextRects.forEach((rect, i) => {
        canvasContext.fillStyle = `rgb(0, ${Math.floor(255 - 42.5 * i)}, ${Math.floor(255 - 42.5 * i)})`;
        canvasContext.fillRect(rect.x, rect.y, rectSide, rectSide)
      })
      rects = nextRects
    }

    drawBoundaries()
    drawRects()

    const handler = function (event) {
      let delta = 0
      if (event.wheelDelta) {
          delta = event.wheelDelta / 120;
      }
      if (event.detail) {
          delta = -event.detail / 3;
      }
      canvasContext.clearRect(0, 0, width, height)
      drawBoundaries()
      drawRects(delta)
    }
    containerRef.current.addEventListener('mousewheel', handler, {
      passive: false
    })

    return () => {
      containerRef.current.removeEventListener('mousewheel', handler, false)
    }
  }, [])

  // console.log('refs', containerRef, sceneRef)

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
