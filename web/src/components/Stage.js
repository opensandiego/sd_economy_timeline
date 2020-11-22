import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import './stage.scss'
import backgroudImagePath from '../assets/sandag-background@3x.png'
import teardrop from '../assets/teardrop@3x.png'
import { iconInfo, categoryToIcon } from './icons'

const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
const timelinePaddingExpansion = 1.2
const endToScreenRatio = 1.1
const vanishTop = 0.3
let width = 600
let height = 600
let maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion

const cardSize = 720
const timeline3DLength = 1000
let rects = []
let selectedEvents
let eventTextElements = {}
let eventTextBuilt = false
let eventTeardrop
const rectCount = 10
const x = 0.25
const yIncrement = timeline3DLength / rectCount
for (let i = 0; i < rectCount; i++) {
  const rectY = timeline3DLength - (yIncrement + (i * yIncrement))
  const nextRect = {
    x: i % 2 ? x + 0.5 : x,
    y: rectY
  }
  rects.push(nextRect)
}

const makeEventKey = e => {
  const { Category, Description, Year } = e
  return `${Category}-${Year}-${Description.replace(/\W/g, '-')}`
}

const createImage = (path, width, height) => {
  const image = document.createElement('img')
  image.width = width
  image.height = height
  image.src = path
  return image
}

const drawEventText = (info, width, height) => {
  const { Category, Year } = info
  const textCanvas = document.createElement('canvas')
  textCanvas.style = {
    width: `${width}px`,
    height: `${height}px`
  }
  textCanvas.width = width * deviceScale
  textCanvas.height = height * deviceScale
  const dateSize = {
    fontSize: 15,
    x: 12,
    y: 22
  }
  const textSize = {
    fontSize: 24,
    x: 12,
    y: 46
  }
  const textFillStyle = 'rgba(60, 60, 60, 1)'
  const dateFillStyle = 'rgba(110, 110, 110, 1)'
  const panelStyle = 'rgba(255, 255, 255, 1)'
  const dateFont = '"Helvetica","sans-serif"'
  const textFont = '"Helvetica","sans-serif"'
  const ctx = textCanvas.getContext('2d')
  ctx.scale(deviceScale, deviceScale)
  ctx.fillStyle = panelStyle;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = textFillStyle;
  ctx.textAlign = "left";
  ctx.font = "Bold " + textSize.fontSize + 'px ' + textFont;
  ctx.fillText(Category, textSize.x, textSize.y)
  ctx.fillStyle = dateFillStyle;
  ctx.font = dateSize.fontSize + 'px ' + dateFont;
  ctx.fillText(Year, dateSize.x, dateSize.y);
  return textCanvas
}

const Stage = ({data, selectedSectors})=> {
  selectedEvents = data && data.filter(event => selectedSectors.includes(event.Category))
  if (data && data.length && selectedEvents.length && !eventTextBuilt) {
    data.forEach(event => {
      eventTextElements[makeEventKey(event)] = drawEventText(event, 200, 92)
    })
    eventTextBuilt = true
  }
  // console.log('selectedEvents', selectedEvents)
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [sceneSizeEstablished, setSceneSizeEstablished] = useState(false)
  const [sceneSize, setSceneSize] = useState({
    width,
    height
  })
  const timelineGradColor = 'rgb(24,105,169' // sdforward blue...

  const timelineToScreen = position => {
    // console.log('timelineToScreen', width)
    const viewOffset = 0
    const screenWidth = sceneSize.width
    const screenHeight = Math.round(sceneSize.height * timelinePaddingExpansion);
    // console.log('screenWidth', screenWidth, 'screenHeight', screenHeight)
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
    const xPos = (sceneSize.width - widthOnScreen) / 2 + hOffset * widthOnScreen;
    // console.log('xpos', xPos)
    const yPos = pos.top + (widthOnScreen / itemWidth) * vanishingHeight;
    const offset = Math.min(widthOnScreen / itemWidth * viewOffset);
    return {
        x: xPos + offset,
        y: yPos,
        sliceWidth: widthOnScreen,
        offset: offset
    }
  }

  const drawBoundaries = vanishingPoint => {
    const numCols = 1

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
      const gradient = contextRef.current.createLinearGradient(0, height * vanishTop, 0, height);
      gradient.addColorStop(0, `${timelineGradColor},0)`)
      gradient.addColorStop(0.06, `${timelineGradColor},0)`)
      gradient.addColorStop(0.8, `${timelineGradColor},1)`)
      gradient.addColorStop(1, `${timelineGradColor},1)`)
      contextRef.current.fillStyle = gradient
      contextRef.current.beginPath()
      contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y);
      contextRef.current.lineTo(blPos.x, blPos.y);
      contextRef.current.lineTo(brPos.x, brPos.y);
      contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y);
      contextRef.current.closePath();
      contextRef.current.fill();
    }
  }

  const drawEvents = (change = 0) => {
    console.log('selectedEvents', selectedEvents)
    if (!selectedEvents || selectedEvents.length === 0) {
      return
    }
    const nextRects = rects.map(rect => ({
      x: rect.x,
      y: rect.y - (-change * 25) // <-- flip scroll direction
      // y: rect.y - (change * 25)
    }))
    nextRects.forEach((rect, i) => {
      // console.log('selected event?', selectedEvents[i])
      const screenPosition = timelineToScreen(rect)
      // console.log('screenPosition', screenPosition.x, screenPosition.y)
      const scaleFactor = screenPosition.sliceWidth / cardSize
      // console.log('scaleFactor', scaleFactor, `(${screenPosition.sliceWidth})`)
      const cardWidth = 200 * scaleFactor
      const teardropWidth = 77 * scaleFactor
      if (cardWidth < 3) {
        return
      }
      const gradColor = "rgba(255,255,255,";
      // var numTextLines = (marker.lines3DText && marker.lines3DText.length > 2) ? marker.lines3DText.length : 2;
      const numTextLines = 4 // TODO:  calculate on a per event basis, see commented line above
      const vTextAdjust = (numTextLines - 2) * 16 * scaleFactor
      const textHolderHeight = 60 * scaleFactor + vTextAdjust;
      const teardropHeight = 95 * scaleFactor + vTextAdjust;
      const shadowBlockHeight = 60 * scaleFactor
      const imageBoxHeight = 150 * scaleFactor
      const arrowHeight = 50 * scaleFactor
      const arrowWidth = 100 * scaleFactor
      const itemHeight = textHolderHeight + imageBoxHeight + arrowHeight
      const itemHeightNoImage = textHolderHeight + arrowHeight
      const textPadding = cardWidth / 30
      const vShift = 0
      let opacity = 1
      const fadeOutLimit = sceneSize.height - (0.05 * sceneSize.height)
      if (screenPosition.y > fadeOutLimit) {
          opacity = 1 - (screenPosition.y - fadeOutLimit) / (timeline3DLength - fadeOutLimit);
          opacity = opacity < 0 ? 0 : opacity
          // console.log('over fade out limit', opacity, screenPosition.y)
          // marker.marker3DScreenInfo.active = (opacity > 0.6) ? true : false;
      } else {
          opacity = screenPosition.sliceWidth * timelinePaddingExpansion / (0.3 * maxTimelineWidth);
      }
      contextRef.current.globalAlpha = opacity;
      // contextRef.current.fillStyle = panelColor;
      contextRef.current.fillStyle = `rgba(255,255,255,${opacity})`
      let startPos = {
          x: screenPosition.x,
          y: screenPosition.y - vShift
      }
      // triangle only
      // contextRef.current.beginPath();
      // contextRef.current.moveTo(startPos.x, startPos.y);
      // startPos.x -= arrowWidth / 3;
      // startPos.y -= arrowHeight * 1.25;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.x += arrowWidth / 1.5;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.x -= arrowWidth / 3;
      // startPos.y += arrowHeight * 1.25;
      // contextRef.current.closePath();
      // contextRef.current.fill();

      // main card panel with beak
      // contextRef.current.beginPath();
      // contextRef.current.moveTo(startPos.x, startPos.y);
      // startPos.x -= arrowWidth / 2;
      // startPos.y -= arrowHeight;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.x -= (cardWidth / 2 - arrowWidth / 2);
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.y -= textHolderHeight;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.x += cardWidth;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.y += textHolderHeight;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.x -= (cardWidth / 2 - arrowWidth / 2);
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // contextRef.current.lineTo(screenPosition.x, screenPosition.y - vShift);
      // contextRef.current.closePath();
      // contextRef.current.fill();

      const eventText = eventTextElements[makeEventKey(selectedEvents[i])]
      const dxText = screenPosition.x - 0.5 * cardWidth
      const dyText = screenPosition.y - arrowHeight - 2.5 * textHolderHeight - vShift
      // console.log('draw image params', dx, dy, cardWidth, textHolderHeight)
      contextRef.current.drawImage(eventText, dxText, dyText, cardWidth, textHolderHeight);

      const dx = screenPosition.x - 0.5 * teardropWidth
      const dy = screenPosition.y - teardropHeight - vShift
      contextRef.current.drawImage(eventTeardrop, dx, dy, teardropWidth, teardropHeight);

      const eventIcon = iconInfo[categoryToIcon[selectedEvents[i].Category]]
      // console.log('eventIcon', selectedEvents[i].Category, eventIcon)
      if (eventIcon) {
        const iconWidth = eventIcon.width * scaleFactor
        const iconHeight = eventIcon.height * scaleFactor
        const iconHeightAdjust = teardropHeight - (20 * scaleFactor)
        const dxIcon = screenPosition.x - 0.5 * iconWidth
        const dyIcon = screenPosition.y - iconHeightAdjust
        contextRef.current.drawImage(eventIcon.image, dxIcon, dyIcon, iconWidth, iconHeight);
      }

      // reflection
      startPos = {
        x: screenPosition.x,
        y: screenPosition.y + vShift
      }
      const grad = contextRef.current.createLinearGradient(screenPosition.x, screenPosition.y, screenPosition.x, screenPosition.y + shadowBlockHeight + arrowWidth);
      grad.addColorStop(0, gradColor + "0.5)");
      grad.addColorStop(0.3, gradColor + "0.2)");
      grad.addColorStop(0.7, gradColor + "0.05)");
      grad.addColorStop(1, gradColor + "0)");
      contextRef.current.fillStyle = grad;
      contextRef.current.beginPath();
      contextRef.current.moveTo(startPos.x, startPos.y);
      startPos.x += arrowWidth / 2;
      startPos.y += arrowHeight;
      contextRef.current.lineTo(startPos.x, startPos.y);
      startPos.x += (cardWidth / 2 - arrowWidth / 2);
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.y += shadowBlockHeight;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      startPos.x -= cardWidth;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      // startPos.y -= shadowBlockHeight;
      // contextRef.current.lineTo(startPos.x, startPos.y);
      startPos.x += (cardWidth / 2 - arrowWidth / 2);
      contextRef.current.lineTo(startPos.x, startPos.y);
      contextRef.current.lineTo(screenPosition.x, screenPosition.y + vShift);
      contextRef.current.closePath();
      contextRef.current.fill();
      contextRef.current.globalAlpha = 1
    })
    rects = nextRects
  }



  useEffect(() => {
    const {
      width: sceneWidth,
      height: sceneHeight
    } = sceneRef.current.getBoundingClientRect()
    width = sceneWidth
    height = sceneHeight
    maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion
    // console.log('useEffect...width and height', width, height)
    setSceneSize({
      width,
      height
    })
    setSceneSizeEstablished(true)
    eventTeardrop = createImage(teardrop, 95, 137)
    Object.values(iconInfo).forEach(info => {
      const { path, width, height } = info
      info.image = createImage(path, width, height)
    })
    console.log('icons', iconInfo)
  }, [])

  useEffect(() => {
    // if (!sceneSizeEstablished) return
    contextRef.current = canvasRef.current.getContext('2d')
    contextRef.current.scale(deviceScale, deviceScale)

    const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
    contextRef.current.clearRect(0, 0, width * 2, height)

    contextRef.current.fillStyle = 'rgba(0,0,0,0)'
    contextRef.current.fillRect(0, 0, width, height)

    drawBoundaries(vanishingPoint)
    drawEvents()

    const handler = function (event) {
      let delta = 0
      if (event.wheelDelta) {
          delta = event.wheelDelta / 120;
      }
      if (event.detail) {
          delta = -event.detail / 3;
      }
      contextRef.current.clearRect(0, 0, width, height)
      drawBoundaries(vanishingPoint)
      drawEvents(delta)
    }
    containerRef.current.addEventListener('mousewheel', handler, {
      passive: false
    })
    const containerElement = containerRef.current

    return () => {
      containerElement.removeEventListener('mousewheel', handler, false)
    }
  }, [
    sceneSizeEstablished
  ])

  useEffect(() => {
    drawEvents()
  }, [
    selectedEvents
  ])

  return (
    <div className='stage' ref={containerRef}>
      <div className='viewport'>
        <div className='scene3D-container'>
          <img
            alt='San Diego sunset as background for timeline '
            src={backgroudImagePath}
            width={width}
            height={height}
          />
          <div className='scene3D' ref={sceneRef}>
            <canvas
              ref={canvasRef}
              style={{
                width: `${sceneSize.width}px`,
                height: `${sceneSize.height}px`
              }}
              width={`${sceneSize.width * deviceScale}`}
              height={`${sceneSize.height * deviceScale}`}
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Stage
