import React, {
  useRef,
  useEffect
} from 'react'
import './stage.scss'

const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
const timelinePaddingExpansion = 1.1
const endToScreenRatio = 1.1
const vanishTop = 0.2016
const width = 600
const height = 600
const maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion

const cardSize = 720
const timeline3DLength = 600
let rects = []
const rectCount = 5
const x = 0.25
const yIncrement = timeline3DLength / rectCount
for (let i = 0; i < rectCount; i++) {
  const rectY = timeline3DLength - (yIncrement + (i * yIncrement))
  const nextRect = {
    x: i % 2 ? x + 0.5 : x,
    y: rectY
  }
  console.log('nextRect', nextRect)
  rects.push(nextRect)
}


const Stage = props => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
  const canvasStyle = {
    width: `${width}px`,
    height: `${height}px`
  }
  const timelineGradColor = 'rgb(24,105,169' // sdforward blue...

  const timelineToScreen = position => {
    const viewOffset = 0
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
    // console.log('E exponent', -k * (maxDistance - distance))
    const widthOnScreen = itemWidth * Math.pow(Math.E, -k * (maxDistance - distance));
    const xPos = (width - widthOnScreen) / 2 + hOffset * widthOnScreen;
    console.log('xpos', xPos)
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
    canvasContext.scale(deviceScale, deviceScale) // necessary? check if other one does this

    const drawBoundaries = () => {
      const numCols = 1
      // lines on surface boundaries
      // for (let endPt = 0; endPt <= numCols; endPt++) {
      //   const end = timelineToScreen({
      //     x: endPt / numCols,
      //     y: timeline3DLength
      //   })
      //   // console.log('end', end)

      //   canvasContext.beginPath();
      //   const gradient = canvasContext.createLinearGradient(vanishingPoint.x, vanishingPoint.y, end.x, end.y);
      //   gradient.addColorStop(0, `${timelineGradColor},0)`)
      //   gradient.addColorStop(0.06, `${timelineGradColor},0)`)
      //   gradient.addColorStop(0.8, `${timelineGradColor},1)`)
      //   gradient.addColorStop(1, `${timelineGradColor},1)`)
      //   canvasContext.strokeStyle = gradient;
      //   canvasContext.moveTo(vanishingPoint.x, vanishingPoint.y)
      //   canvasContext.lineTo(end.x, end.y)
      //   canvasContext.closePath()
      //   canvasContext.stroke()
      // }

      // filled surface
      for (let endPt = 0; endPt < numCols; endPt++) {
        const blPos = timelineToScreen({
          x: endPt / numCols,
          y: timeline3DLength
        })
        var brPos = timelineToScreen({
          x: (endPt + 1) / numCols,
          y: timeline3DLength
        })
        const gradient = canvasContext.createLinearGradient(0, height * vanishTop, 0, height);
        gradient.addColorStop(0, `${timelineGradColor},0)`)
        gradient.addColorStop(0.06, `${timelineGradColor},0)`)
        gradient.addColorStop(0.8, `${timelineGradColor},1)`)
        gradient.addColorStop(1, `${timelineGradColor},1)`)
        canvasContext.fillStyle = gradient
        canvasContext.beginPath()
        canvasContext.moveTo(vanishingPoint.x, vanishingPoint.y);
        canvasContext.lineTo(blPos.x, blPos.y);
        canvasContext.lineTo(brPos.x, brPos.y);
        canvasContext.moveTo(vanishingPoint.x, vanishingPoint.y);
        canvasContext.closePath();
        canvasContext.fill();
      }
    }

    // rects on the canvas
    const drawRects = (change = 0) => {
      // console.log('drawRect change...', change)
      const nextRects = rects.map(rect => ({
        x: rect.x,
        y: rect.y - (-change * 25) // <-- flip scroll direction
        // y: rect.y - (change * 25)
      }))
      nextRects.forEach((rect, i) => {
        const screenPosition = timelineToScreen(rect)
        console.log('screenPosition', screenPosition.x, screenPosition.y)
        const scaleFactor = screenPosition.sliceWidth / cardSize
        console.log('scaleFactor', scaleFactor, `(${screenPosition.sliceWidth})`)
        const cardWidth = 600 * scaleFactor
        // console.log('cardWidth', cardWidth, rect.x, rect.y)
        if (cardWidth < 3) {
          return
        }
        const gradColor = "rgba(255,255,255,";
        // var numTextLines = (marker.lines3DText && marker.lines3DText.length > 2) ? marker.lines3DText.length : 2;
        const numTextLines = 4
        const vTextAdjust = (numTextLines - 2) * 16 * scaleFactor
        const textHolderHeight = 60 * scaleFactor + vTextAdjust;
        const shadowBlockHeight = 60 * scaleFactor
        const imageBoxHeight = 150 * scaleFactor
        const arrowHeight = 50 * scaleFactor
        const arrowWidth = 100 * scaleFactor
        const itemHeight = textHolderHeight + imageBoxHeight + arrowHeight
        const itemHeightNoImage = textHolderHeight + arrowHeight
        const textPadding = cardWidth / 30
        const vShift = 0
        let opacity = 1
        const fadeOutLimit = timeline3DLength - (0.05 / (0.05 + 1) * timeline3DLength)
        // console.log('fadeOutLimit', fadeOutLimit)
        if (screenPosition.y > fadeOutLimit) {
            opacity = 1 - (screenPosition.y - fadeOutLimit) / (timeline3DLength - fadeOutLimit);
            opacity = opacity < 0 ? 0 : opacity
            console.log('over fade out limit', opacity)
            // marker.marker3DScreenInfo.active = (opacity > 0.6) ? true : false;
        } else {
            opacity = screenPosition.sliceWidth * timelinePaddingExpansion / (0.3 * maxTimelineWidth);
        }
        canvasContext.globalAlpha = opacity;
        // canvasContext.fillStyle = panelColor;
        canvasContext.fillStyle = `rgba(255,255,255,${opacity})`
        let startPos = {
            x: screenPosition.x,
            y: screenPosition.y - vShift
        }
        // main card panel with beak
        canvasContext.beginPath();
        canvasContext.moveTo(startPos.x, startPos.y);
        startPos.x -= arrowWidth / 2;
        startPos.y -= arrowHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x -= (cardWidth / 2 - arrowWidth / 2);
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.y -= textHolderHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x += cardWidth;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.y += textHolderHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x -= (cardWidth / 2 - arrowWidth / 2);
        canvasContext.lineTo(startPos.x, startPos.y);
        canvasContext.lineTo(screenPosition.x, screenPosition.y - vShift);
        canvasContext.closePath();
        canvasContext.fill();
        // reflection
        startPos = {
          x: screenPosition.x,
          y: screenPosition.y + vShift
        }
        // console.log('shadowBlockHeight', shadowBlockHeight, '; arrowHeight', arrowHeight)
        const grad = canvasContext.createLinearGradient(screenPosition.x, screenPosition.y, screenPosition.x, screenPosition.y + shadowBlockHeight + arrowWidth);
        grad.addColorStop(0, gradColor + "0.5)");
        grad.addColorStop(0.3, gradColor + "0.2)");
        grad.addColorStop(0.7, gradColor + "0.05)");
        grad.addColorStop(1, gradColor + "0)");
        canvasContext.fillStyle = grad;
        canvasContext.beginPath();
        canvasContext.moveTo(startPos.x, startPos.y);
        startPos.x += arrowWidth / 2;
        startPos.y += arrowHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x += (cardWidth / 2 - arrowWidth / 2);
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.y += shadowBlockHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x -= cardWidth;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.y -= shadowBlockHeight;
        canvasContext.lineTo(startPos.x, startPos.y);
        startPos.x += (cardWidth / 2 - arrowWidth / 2);
        canvasContext.lineTo(startPos.x, startPos.y);
        canvasContext.lineTo(screenPosition.x, screenPosition.y + vShift);
        canvasContext.closePath();
        canvasContext.fill();
        canvasContext.globalAlpha = 1
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