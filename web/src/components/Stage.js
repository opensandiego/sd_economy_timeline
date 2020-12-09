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
const timeline3DLength = 2000
let rects = []
let selectedEvents
let eventTextElements = {}
let eventTextDimensions = {}
let eventTextBuilt = false
let eventTeardrop
const borderWidth = 10
const rectCount = 20
const x = 0.25
const yIncrement = timeline3DLength / rectCount
const rows = Math.ceil(rectCount / 1.5)
for (let i = 0; i < rows; i++) {
  // alternate between 1 event and 2 events per row
  if (i % 2 === 0) {
    rects.push({
      x: 0.25,
      y: timeline3DLength - (yIncrement + (i * yIncrement)),
      row: i
    })
    rects.push({
      x: 0.75,
      y: timeline3DLength - (yIncrement + (i * yIncrement)),
      row: i
    })
  } else {
    rects.push({
      x: 0.5,
      y: timeline3DLength - (yIncrement + (i * yIncrement)),
      row: i
    })
  }
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

const drawEventText = (info, multiplier) => {
  const { Category, Year } = info
  const textDimensionsKey = `${Category}-${multiplier}`
  const fontSize = 8

  // dynamically calculate text width/height
  if (!eventTextDimensions[textDimensionsKey]) {
    const span = document.createElement('span')
    span.innerHTML = Category
    span.style.opacity = 0
    span.style.fontSize = `${fontSize}px`
    span.style.fontFamily = 'Helvetica, sans-serif'
    span.style.padding = '4px'
    document.body.appendChild(span)
    const { width, height } = span.getBoundingClientRect()
    console.log(Category, width, height)
    // console.log('span width height', width, height, Category)
    eventTextDimensions[textDimensionsKey] = {
      width: width * multiplier,
      height: height * multiplier
    }
    document.body.removeChild(span)
    // console.log(Category, eventTextDimensions[textDimensionsKey])
  }
  const {
    width: textWidth,
    height: textHeight
  } = eventTextDimensions[textDimensionsKey]
  const rectWidth = textWidth
  const rectHeight = textHeight
  // console.log(`rectWidth ${rectWidth}, rectHeight ${rectHeight}`)

  const textCanvas = document.createElement('canvas')
  textCanvas.style = `width: ${rectWidth}px; height: ${rectHeight}px`
  textCanvas.width = rectWidth * deviceScale
  textCanvas.height = rectHeight * deviceScale
  const textSize = {
    fontSize: fontSize * multiplier,
    x: rectWidth / 2,
    y: 8 * multiplier
  }
  const dateSize = {
    fontSize: (fontSize * 0.75) * multiplier,
    x: rectWidth / 2,
    y: 14 * multiplier
  }
  const textFillStyle = 'rgba(60, 60, 60, 1)'
  const dateFillStyle = 'rgba(110, 110, 110, 1)'
  const opaque = 'rgba(255, 255, 255, 1)'
  const dateFont = '"Helvetica","sans-serif"'
  const textFont = '"Helvetica","sans-serif"'
  const ctx = textCanvas.getContext('2d')
  ctx.scale(deviceScale, deviceScale)
  ctx.fillStyle = opaque;
  ctx.fillRect(0, 0, rectWidth, rectHeight);
  // console.log('rect width and height', rectWidth, rectHeight, Category)
  ctx.fillStyle = textFillStyle;
  ctx.textAlign = "center";
  ctx.font = `${textSize.fontSize}px ${textFont}`;
  // console.log('text size', textSize.fontSize)
  ctx.fillText(Category, textSize.x, textSize.y)
  ctx.fillStyle = dateFillStyle;
  ctx.font = `${dateSize.fontSize}px ${dateFont}`;
  ctx.fillText(Year, dateSize.x, dateSize.y);
  return textCanvas
  // console.log({ Category })
  // console.log('text canvas', textCanvas)
  // const withFadedBorder = addFadeBorderForText(textCanvas, rectWidth, rectHeight, multiplier)
  // console.log('with faded border', withFadedBorder)
  // return withFadedBorder
}

const addFadeBorderForText = (textCanvas, width, height) => {
  const fadedBorderCanvas = document.createElement('canvas')
  const totalWidth = width + (borderWidth * 2)
  // console.log('total width', totalWidth)
  const totalHeight = height + (borderWidth * 2)
  fadedBorderCanvas.style = `width: ${totalWidth}px; height: ${totalHeight}px`
  fadedBorderCanvas.width = totalWidth * deviceScale
  fadedBorderCanvas.height = totalHeight * deviceScale
  const ctx = fadedBorderCanvas.getContext('2d')
  const fadeStep = 0.1
  const fades = Array.from(Array(borderWidth)).map((_, i) => {
    return `rgba(255, 255, 255, ${(fadeStep * i).toFixed(1)})`
  })
  fades.forEach((fill, index) => {
    ctx.fillStyle = fill
    const twiceIndex = index * 2
    ctx.fillRect(index, index, totalWidth - twiceIndex, totalHeight - twiceIndex)
  })
  ctx.drawImage(textCanvas, borderWidth, borderWidth, width, height)

  return fadedBorderCanvas
}

const Stage = ({data, selectedSectors})=> {
  selectedEvents = data && data
    .filter(event => selectedSectors.includes(event.Category) && +event.Year > 1899)
    .map(event => {
      return {
        ...event,
        position: {}
      }
    })
  if (data && data.length && selectedEvents.length && !eventTextBuilt) {
    data.forEach(event => {
      eventTextElements[makeEventKey(event)] = drawEventText(event, 1)
      eventTextElements[`${makeEventKey(event)}-high-res`] = drawEventText(event, 2)
    })
    eventTextBuilt = true
    // console.log(eventTextElements)
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
  const timelineGradColor = 'rgb(19,72,100'

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
      gradient.addColorStop(0.4, `${timelineGradColor},1)`)
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
    // console.log('selectedEvents', selectedEvents)
    if (!selectedEvents || selectedEvents.length === 0) {
      return
    }
    const nextRects = rects.map(rect => ({
      row: rect.row,
      x: rect.x,
      y: rect.y - (-change * 25) // <-- flip scroll direction
      // y: rect.y - (change * 25)
    }))
    const rowYears = {}
    nextRects.forEach((rect, i) => {
      // const selectedEvent = selectedEvents[i]
      // if (rowYears[rect.row]) {
      //   rowYears[rect.row].push(selectedEvent.Year)
      // } else {
      //   rowYears[rect.row] = [selectedEvent.Year]
      // }
      // if (rowYears[rect.row].length === 2) {
      //   const [year1, year2] = rowYears[rect.row]
      //   const yearDiffence = +year2 - (+year1)
      //   // rect.y = rect.y + 10
      // }
      const screenPosition = timelineToScreen(rect)
      // console.log('screenPosition', screenPosition.x, screenPosition.y)
      const scaleFactor = screenPosition.sliceWidth / cardSize
      // console.log('scaleFactor', scaleFactor, `(${screenPosition.sliceWidth})`)
      const eventTextWidth = eventTextDimensions[`${selectedEvents[i].Category}-1`].width
      const eventTextHeight = eventTextDimensions[`${selectedEvents[i].Category}-1`].height
      console.log('eventText dims', eventTextWidth, eventTextHeight)
      const cardWidth = eventTextWidth * 2 * scaleFactor
      const teardropWidth = 60 * scaleFactor
      if (cardWidth < 3) {
        selectedEvents[i].position.active = false
        return
      }
      // console.log('cardWidth', cardWidth, selectedEvents[i], ';text width', eventTextDimensions[selectedEvents[i].Category].width)
      let eventTextKey
      if (cardWidth > (1.5 * eventTextWidth)) {
        // need higher res event text
        eventTextKey = `${makeEventKey(selectedEvents[i])}-high-res`
        // console.log('...high-res', selectedEvents[i].Category)
      } else {
        eventTextKey = makeEventKey(selectedEvents[i])
      }
      const gradColor = "rgba(255,255,255,";
      // var numTextLines = (marker.lines3DText && marker.lines3DText.length > 2) ? marker.lines3DText.length : 2;
      const numTextLines = 4 // TODO:  calculate on a per event basis, see commented line above
      const vTextAdjust = (numTextLines - 2) * 10 * scaleFactor
      const textHolderHeight = eventTextHeight * scaleFactor + vTextAdjust;
      const teardropHeight = 69 * scaleFactor + vTextAdjust;
      const arrowHeight = (eventTextHeight + 40) * scaleFactor
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
      const eventText = eventTextElements[eventTextKey]
      // console.log('event text', eventText, selectedEvents[i].Category)
      const dxText = screenPosition.x - 0.5 * cardWidth
      const dyText = screenPosition.y - arrowHeight - 2 * textHolderHeight - vShift
      // console.log('draw image params', dx, dy, cardWidth, textHolderHeight)
      // console.log(selectedEvents[i].Category, eventTextWidth, cardWidth, eventTextHeight, textHolderHeight)
      contextRef.current.drawImage(eventText, dxText, dyText, cardWidth, textHolderHeight);

      // experimenting with some shadow stuff...not happy with it
      // contextRef.current.strokeStyle = 'white';
      // contextRef.current.shadowColor = "rgba(105, 105, 105, 1)";
      // contextRef.current.shadowBlur = 5;
      // contextRef.current.shadowOffsetX = 0;
      // contextRef.current.shadowOffsetY = 0;
      // contextRef.current.strokeRect(dxText, dyText, cardWidth, textHolderHeight);
      // contextRef.current.shadowBlur = 0
      // contextRef.current.shadowOffsetX = 0
      // contextRef.current.shadowOffsetY = 0

      const dx = screenPosition.x - 0.5 * teardropWidth
      const dy = screenPosition.y - teardropHeight - vShift
      contextRef.current.drawImage(eventTeardrop, dx, dy, teardropWidth, teardropHeight);

      // keep track of dimensions to test if a timeline item is clicked
      selectedEvents[i].position = {
        x: dx,
        y: dy,
        width: teardropWidth,
        height: teardropHeight,
        active: true
      }

      const eventIcon = iconInfo[categoryToIcon[selectedEvents[i].Category]]
      // console.log('eventIcon', selectedEvents[i].Category, eventIcon)
      if (eventIcon) {
        const iconWidth = eventIcon.width * scaleFactor
        const iconHeight = eventIcon.height * scaleFactor
        const iconHeightAdjust = teardropHeight - (15 * scaleFactor)
        const dxIcon = screenPosition.x - 0.5 * iconWidth
        const dyIcon = screenPosition.y - iconHeightAdjust
        contextRef.current.drawImage(eventIcon.image, dxIcon, dyIcon, iconWidth, iconHeight);
      }

      startPos = {
        x: screenPosition.x,
        y: screenPosition.y + vShift
      }
      const { x, y } = startPos
      const radius = 15 * scaleFactor
      const centerX = x
      const centerY = y + (20 * scaleFactor)
      const width = 60 * scaleFactor
      const height = 5 * scaleFactor
      const radialGradient = contextRef.current.createRadialGradient(x, y + radius + 5, 1, x, y + radius + 5, width)
      radialGradient.addColorStop(0, 'rgba(51, 51, 51, 0.2)');
      radialGradient.addColorStop(0.4, 'rgba(51, 51, 51, 0)');
      radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      contextRef.current.fillStyle = radialGradient;

      // draws the ellipse to use for the shadow under a teardrop
      contextRef.current.beginPath();
      contextRef.current.moveTo(centerX, centerY - height);
      contextRef.current.bezierCurveTo(
        centerX + width / 2, centerY - height,
        centerX + width / 2, centerY + height,
        centerX, centerY + height
      );
      contextRef.current.bezierCurveTo(
        centerX - width / 2, centerY + height,
        centerX - width / 2, centerY - height,
        centerX, centerY - height
      );
      contextRef.current.fill();
      contextRef.current.closePath();

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

    const canvasClickHandler = clickEvent => {
      let clickedMarker
      const {
        x: horizontalOffset,
        y: verticalOffset
      } = canvasRef.current.getBoundingClientRect()
      const { clientX, clientY } = clickEvent
      const coords = { x: clientX, y: clientY }
      const scr = {
        x: coords.x - horizontalOffset,
        y: coords.y - verticalOffset
      }
      const v2 = 0
      const num = selectedEvents.length
      for (let c = num - 1; c >= 0; c--) {
        var m = selectedEvents[c];
        var ma = m.position;
        if (!ma || m.searchHidden || m.madeInvisible) {
            continue
        }
        if (ma.active && scr.x > ma.x && scr.x < (ma.x + ma.width) && (scr.y - v2) > ma.y && (scr.y - v2) < (ma.y + ma.height)) {
          clickedMarker = m;
          break;
        }
      }
      if (clickedMarker) {
        console.log('clicked...?', clickedMarker)
      }
      // console.log('canvas click', clickEvent, clientX, clientY)
    }
    canvasRef.current.addEventListener('click', canvasClickHandler)

    const containerElement = containerRef.current
    const canvasElement = canvasRef.current

    return () => {
      containerElement.removeEventListener('mousewheel', handler, false)
      canvasElement.removeEventListener('click', canvasClickHandler, false)
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
                width: `${sceneSize.width - 30}px`,
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
