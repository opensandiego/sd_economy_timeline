import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import './stage.scss'
import backgroudImagePath from '../assets/sandag-background@3x.png'
import teardrop from '../assets/purple-teardrop@3x.png'
import arrowsLeft from '../assets/sandag-timeline-arrows-left.svg'
import arrowsRight from '../assets/sandag-timeline-arrows-right.svg'
import faHandPointUp from '../assets/fa-hand-point-up.svg'
import { iconInfo, categoryToIcon } from './icons'
import { regions, descriptions } from './regions'
import {
  makeEventKey,
  createImage,
  drawEventText,
  getDecade
} from './utils'
import Popup from './Popup'
import BackgroundTooltip from './BackgroundTooltip'

const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
const timelinePaddingExpansion = 1.2
const endToScreenRatio = 1.1
const vanishTop = 0.3
const font = 'Montserrat'
let width = 600
let height = 600
let maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion

const cardSize = 720
let timeline3DLength = 3000
let selectedEvents
let currentHover
let eventTextElements = {}
let eventTextDimensions = {}
let eventTextBuilt = false
let eventTeardrop, arrowsLeftImage, arrowsRightImage, faHandPointUpImage
let rectCount = 30
let scrollTotal = 0
let totalDraws = 0
let yearPositions = {}
const yIncrement = timeline3DLength / rectCount
const initializePositions = (events = []) => {
  let rows = Math.ceil(rectCount / 1.5)
  let positions = []
  if (events.length) {
    let eventsProcessed = 0
    let totalEvents = events.length
    let currentRow = 0
    let rowCount = 0
    while (eventsProcessed < totalEvents) {
      const previousRowHasOneEvent = positions.filter(p => p.row === currentRow - 2).length === 1
      positions.push({
        x: 0.5,
        y: timeline3DLength - (yIncrement + (currentRow * yIncrement)),
        row: currentRow,
        year: events[eventsProcessed].Year
      })
      currentRow += 1
      if (rowCount === 0) {
        rowCount = 1
        const previousEventIsCentered = positions[positions.length - 2] && positions[positions.length - 2].x === 0.5
        if (previousEventIsCentered) {
          positions[positions.length - 1].x = 0.75
        }
      }
      const currentDecade = getDecade(events[eventsProcessed])
      if (positions.length > 1 && rowCount === 1 && previousRowHasOneEvent) {
        const previousDecade = getDecade(events[eventsProcessed - 1])
        if (currentDecade === previousDecade) {
          positions[positions.length - 1].x = 0.75
          positions[positions.length - 2].x = 0.25
          positions[positions.length - 1].y = positions[positions.length - 2].y
          positions[positions.length - 1].row = positions[positions.length - 2].row
          currentRow -= 1
          rowCount = 2
        }
      } else {
        rowCount = 0
      }
      eventsProcessed += 1
    }
    return positions
  }
  for (let i = 0; i < rows; i++) {
    // alternate between 1 event and 2 events per row
    if (i % 2 === 0) {
      positions.push({
        x: 0.25,
        y: timeline3DLength - (yIncrement + (i * yIncrement)),
        row: i
      })
      positions.push({
        x: 0.75,
        y: timeline3DLength - (yIncrement + (i * yIncrement)),
        row: i
      })
    } else {
      positions.push({
        x: 0.5,
        y: timeline3DLength - (yIncrement + (i * yIncrement)),
        row: i
      })
    }
  }
  return positions
}
const updatePositions = (change, positions) => {
  return positions.map(position => ({
    row: position.row,
    x: position.x,
    y: position.y - (-change * 25) // <-- flip scroll direction
    // y: rect.y - (change * 25)
  }))
}
let rects = initializePositions()

const Stage = ({data, selectedSectors, selectedYear, setTimelineScroll})=> {
  // console.log('selectedSectors', selectedSectors)
  // console.log({ selectedYear })
  selectedEvents = data && data
    .filter(event => selectedSectors.includes(event.Category))
    .map(event => {
      return {
        ...event,
        position: event.position || {}
      }
    })
  if (data && data.length && (selectedEvents.length - 1 !== rectCount)) {
    rectCount = (selectedEvents.length) ? selectedEvents.length - 1 : 3000
    timeline3DLength = rectCount * yIncrement
    rects = initializePositions(selectedEvents)
    yearPositions = rects.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.year]: cur.y
      }
    }, {})
    // console.log({ rects, yearPositions })
  }
  // console.log('stage updated selectedEvents', selectedEvents)
  if (data && data.length && selectedEvents.length && !eventTextBuilt) {
    data.forEach(event => {
      eventTextElements[makeEventKey(event)] = drawEventText(event, 1, eventTextDimensions, deviceScale)
      eventTextElements[`${makeEventKey(event)}-high-res`] = drawEventText(event, 2, eventTextDimensions, deviceScale)
    })
    eventTextBuilt = true
    // console.log(eventTextElements)
  }
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [sceneSizeEstablished, setSceneSizeEstablished] = useState(false)
  const [sceneSize, setSceneSize] = useState({
    width,
    height
  })
  const [eventForPopup, setEventForPopup] = useState(null)
  const [selectedBackgroundRegion, setSelectedBackgroundRegion] = useState(null)

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
    // hint to click on background objects
    contextRef.current.font = `14px ${font}`
    contextRef.current.fillStyle = 'black'
    contextRef.current.fillText('Tap on objects to learn', 822, 345)
    contextRef.current.fillText('about iconic sites in the', 822, 362)
    contextRef.current.fillText('San Diego region!', 822, 379)
    contextRef.current.drawImage(faHandPointUpImage, 800, 352, 18, 18)
    contextRef.current.strokeStyle = 'white'
    contextRef.current.beginPath()
    contextRef.current.moveTo(806.5, 349)
    contextRef.current.lineTo(806.5, 344)
    contextRef.current.closePath()
    contextRef.current.stroke()
    const r = 5
    contextRef.current.beginPath()
    contextRef.current.moveTo(812, 341 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.lineTo(812 - Math.cos(65 * Math.PI / 180) * r, 345 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.closePath()
    contextRef.current.stroke()

    contextRef.current.beginPath()
    contextRef.current.moveTo(801, 341 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.lineTo(801 + Math.cos(65 * Math.PI / 180) * r, 345 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.closePath()
    contextRef.current.stroke()

    // the stage
    const blPos = timelineToScreen({
      x: 0,
      y: timeline3DLength
    })
    var brPos = timelineToScreen({
      x: 1,
      y: timeline3DLength
    })
    const gradient = contextRef.current.createLinearGradient(0, height * vanishTop, 0, height);
    gradient.addColorStop(0, `rgb(69,109,131,0)`)
    gradient.addColorStop(0.13, `rgb(12,70,110,0.31)`)
    gradient.addColorStop(0.32, `rgb(12,70,110,0.67)`)
    gradient.addColorStop(0.59, `rgb(12,70,110,0.82)`)
    gradient.addColorStop(1, `rgb(8,36,56,1)`)
    contextRef.current.fillStyle = gradient
    contextRef.current.beginPath()
    contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y)
    contextRef.current.lineTo(blPos.x, blPos.y)
    contextRef.current.lineTo(brPos.x, brPos.y)
    contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y)
    contextRef.current.closePath()
    contextRef.current.fill()
    contextRef.current.drawImage(arrowsLeftImage, 328, 528, 47, 46)
    contextRef.current.drawImage(arrowsRightImage, 656, 528, 47, 46)
  }

  const eventIsCurrentHover = e => {
    return currentHover.Year === e.Year &&
      currentHover.Category === e.Category &&
      currentHover.Description === e.Description
  }

  const drawDecadeMark = (rect, year) => {
    const screenPosition = timelineToScreen({
      x: 0,
      y: rect.y + 5
    })
    const { x, y, sliceWidth } = screenPosition
    const scaleFactor = sliceWidth / cardSize
    const xOffset = 180 * scaleFactor
    const yOffset = 5 * scaleFactor
    contextRef.current.font = `${32 * scaleFactor}px ${font}`
    contextRef.current.fillStyle = 'white'
    contextRef.current.fillText(year, x - xOffset, y + yOffset)
    contextRef.current.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    contextRef.current.lineTo(x + sliceWidth, y)
    contextRef.current.closePath()
    contextRef.current.stroke()
  }

  const drawEvents = (change = 0) => {
    scrollTotal += change
    // console.log('draw events change', change, scrollTotal)
    // console.log('drawEvent current hover?', currentHover)
    if (!selectedEvents || selectedEvents.length === 0) {
      return
    }
    const nextRects = updatePositions(change, rects)
    let decade = getDecade(selectedEvents[0])
    nextRects.forEach((rect, i) => {
      const screenPosition = timelineToScreen(rect)
      // console.log('screenPosition', screenPosition.x, screenPosition.y)
      const scaleFactor = screenPosition.sliceWidth / cardSize
      // console.log('scaleFactor', scaleFactor, `(${screenPosition.sliceWidth})`)
      const eventTextWidth = eventTextDimensions[`${selectedEvents[i].Description}-1`].width
      const eventTextHeight = eventTextDimensions[`${selectedEvents[i].Description}-1`].height
      // console.log('eventText dims', eventTextWidth, eventTextHeight)
      const cardWidth = eventTextWidth * scaleFactor
      const teardropWidth = 60 * scaleFactor
      if (cardWidth < 3) {
        selectedEvents[i].position.active = false
        return
      }

      // add decade lines as necessary
      if (nextRects[i + 2]) {
        const eventDecade = getDecade(selectedEvents[i + 2])
        if (eventDecade !== decade) {
          drawDecadeMark(nextRects[i + 2], eventDecade)
          decade = eventDecade
        }
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
      // console.log('selected event', selectedEvents[i])
      // var numTextLines = (marker.lines3DText && marker.lines3DText.length > 2) ? marker.lines3DText.length : 2;
      const numTextLines = 4 // TODO:  calculate on a per event basis, see commented line above
      const vTextAdjust = (numTextLines - 2) * scaleFactor
      const textHolderHeight = eventTextHeight * scaleFactor + vTextAdjust
      const teardropHeight = 86.5 * scaleFactor + vTextAdjust;
      const arrowHeight = (eventTextHeight + 35) * scaleFactor
      const vShift = (currentHover && eventIsCurrentHover(selectedEvents[i])) ? 5 * scaleFactor : 0
      let opacity = 1
      const fadeOutLimit = sceneSize.height - (0.25 * sceneSize.height)
      if (screenPosition.y > fadeOutLimit) {
        opacity = 1 - (screenPosition.y - 100 - fadeOutLimit) / (sceneSize.height - fadeOutLimit)
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
      const dyText = screenPosition.y - arrowHeight - textHolderHeight - vShift
      // console.log('draw image params', dx, dy, cardWidth, textHolderHeight)
      // console.log(selectedEvents[i].Category, eventTextWidth, cardWidth, eventTextHeight, textHolderHeight)
      // Draw the text for the event
      const eventTextImg = new Image()
      eventTextImg.src = eventText
      contextRef.current.drawImage(eventTextImg, dxText, dyText, cardWidth, textHolderHeight)

      const dx = screenPosition.x - 0.5 * teardropWidth
      const dy = screenPosition.y - teardropHeight - vShift
      // Draw the tear drop
      contextRef.current.drawImage(eventTeardrop, dx, dy, teardropWidth, teardropHeight)

      // keep track of dimensions to test if a timeline item is clicked
      selectedEvents[i].position = {
        x: dx,
        y: dy,
        width: teardropWidth,
        height: teardropHeight,
        active: true
      }
      // console.log(selectedEvents[i].Category, selectedEvents[i].Year, selectedEvents[i].position.x)

      const eventIcon = iconInfo[categoryToIcon[selectedEvents[i].Category]]
      // console.log('eventIcon', selectedEvents[i].Category, eventIcon)
      if (eventIcon) {
        const iconWidth = eventIcon.width * scaleFactor
        const iconHeight = eventIcon.height * scaleFactor
        const iconVerticalShift = 10 - (eventIcon.verticalShift || 0)
        const iconHeightAdjust = teardropHeight - (iconVerticalShift * scaleFactor)
        const dxIcon = screenPosition.x - 0.5 * iconWidth
        const dyIcon = screenPosition.y - iconHeightAdjust - vShift
        // Draw the event icon on the tear drop
        contextRef.current.drawImage(eventIcon.image, dxIcon, dyIcon, iconWidth, iconHeight)
        contextRef.current.font = `${14 * scaleFactor}px ${font}`
        const xNudge = `${selectedEvents[i].Year}`.slice(0,1) === '1' ? 14 : 15
        // Draw the event's year under the icon
        contextRef.current.fillText(selectedEvents[i].Year, dx + (xNudge * scaleFactor), dy + teardropHeight - (32 * scaleFactor))
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
      contextRef.current.beginPath()
      contextRef.current.moveTo(centerX, centerY - height);
      contextRef.current.bezierCurveTo(
        centerX + width / 2, centerY - height,
        centerX + width / 2, centerY + height,
        centerX, centerY + height
      )
      contextRef.current.bezierCurveTo(
        centerX - width / 2, centerY + height,
        centerX - width / 2, centerY - height,
        centerX, centerY - height
      )
      contextRef.current.fill()
      contextRef.current.closePath()

      contextRef.current.globalAlpha = 1
    })
    totalDraws += 1
    rects = nextRects

    if (totalDraws % 5 === 0) {
      const allPositions = Object.values(yearPositions)
      const start = allPositions[0]
      const end = allPositions[allPositions.length - 1]
      const range = start - end
      const scrollFraction = ((scrollTotal * 25) / range)
      const scrollClamped = (scrollFraction >= 1) ?
        1 :
          (scrollFraction < 0) ?
            0 :
            scrollFraction
      setTimelineScroll(scrollClamped)
    }
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
    arrowsLeftImage = createImage(arrowsLeft, 47, 46)
    arrowsRightImage = createImage(arrowsRight, 47, 46)
    faHandPointUpImage = createImage(faHandPointUp, 18, 18)
    Object.values(iconInfo).forEach(info => {
      const { path, width, height } = info
      info.image = createImage(path, width, height)
    })
    console.log('icons', iconInfo)

    return () => {
      console.log('UNMOUNTING!!!!')
    }
  }, [])

  useEffect(() => {
    if (!sceneSizeEstablished) return
    contextRef.current = canvasRef.current.getContext('2d')
    contextRef.current.scale(deviceScale, deviceScale)

    const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
    contextRef.current.clearRect(0, 0, width * 2, height)

    contextRef.current.fillStyle = 'rgba(0,0,0,0)'
    contextRef.current.fillRect(0, 0, width, height)

    // Reach up to the .row element and set a height so
    // that the timeline sits flush with the stage
    // ...there's probably a better way to do this but as a quick fix this work
    containerRef.current.parentElement.style.height = `${height}px`
    containerRef.current.parentElement.style.overflow = 'hidden'
    containerRef.current.parentElement.style.flex = 'none'

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

    const hitTest = e => {
      let clickedMarker
      const {
        x: horizontalOffset,
        y: verticalOffset
      } = canvasRef.current.getBoundingClientRect()
      const { clientX, clientY } = e
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
      return clickedMarker
    }

    const hitTestBackground = e => {
      let backgroundHover
      const {
        x: horizontalOffset,
        y: verticalOffset
      } = canvasRef.current.getBoundingClientRect()
      const { clientX, clientY } = e
      const coords = { x: clientX, y: clientY }
      const scr = {
        x: coords.x - horizontalOffset,
        y: coords.y - verticalOffset
      }
      Object.entries(regions).forEach(([region, bounds]) => {
        const [left, bottom, right, top] = bounds
        if (scr.x > left && scr.x < right && scr.y < bottom && scr.y > top) {
          backgroundHover = region
        }
      })
      return backgroundHover
    }

    const canvasClickHandler = clickEvent => {
      const { offsetX: x, offsetY: y } = clickEvent
      const clickedMarker = hitTest(clickEvent)
      if (clickedMarker) {
        setEventForPopup(clickedMarker)
        setSelectedBackgroundRegion(null)
      }
      if (!clickedMarker) {
        let backgroundRegionClick
        Object.entries(regions).forEach(([region, bounds]) => {
          const [left, bottom, right, top] = bounds
          if (x > left && x < right && y < bottom && y > top) {
            backgroundRegionClick = region
          }
        })
        if (backgroundRegionClick) {
          setSelectedBackgroundRegion(backgroundRegionClick)
        } else {
          setSelectedBackgroundRegion(null)
        }
      }
      // console.log('canvas click', clickEvent, clientX, clientY)
    }
    canvasRef.current.addEventListener('click', canvasClickHandler)

    const canvasMouseMoveHandler = mouseMoveEvent => {
      let redraw = false
      if (currentHover) {
        delete currentHover.hovered
        currentHover = null
        redraw = true
      }
      const hoveredMarker = hitTest(mouseMoveEvent)
      if (hoveredMarker) {
        currentHover = hoveredMarker
        currentHover.hovered = true
        redraw = true
        canvasRef.current.style.cursor = 'pointer'
      } else {
        canvasRef.current.style.cursor = 'auto'
      }
      const backgroundMarker = hitTestBackground(mouseMoveEvent)
      if (!hoveredMarker) {
        if (backgroundMarker) {
          canvasRef.current.style.cursor = 'pointer'
        } else {
          canvasRef.current.style.cursor = 'auto'
        }
      }
      if (redraw) {
        contextRef.current.clearRect(0, 0, width, height)
        drawBoundaries(vanishingPoint)
        drawEvents()
      }
    }
    canvasRef.current.addEventListener('mousemove', canvasMouseMoveHandler)

    const containerElement = containerRef.current
    const canvasElement = canvasRef.current

    return () => {
      containerElement.removeEventListener('mousewheel', handler, false)
      canvasElement.removeEventListener('mousemove', canvasMouseMoveHandler, false)
      canvasElement.removeEventListener('click', canvasClickHandler, false)
    }
  }, [
    sceneSizeEstablished
  ])

  useEffect(() => {
    if (!contextRef || !contextRef.current) return
    const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
    contextRef.current.clearRect(0, 0, width, height)
    drawBoundaries(vanishingPoint)
    drawEvents()
  })

  useEffect(() => {
    if (!contextRef || !contextRef.current) return
    // console.log('year selected', selectedYear, '; position', yearPositions[selectedYear])
    // calculate total change needed:
    // - have existing scroll position --> scrollTotal
    // - starting position is Object.values(yearSelector)[0]
    // - current position is:  starting position - (scrollTotal * 25)
    // - desired position is:  (yearPositions[selectedYear] - current position) / 25

    const selectedYearPosition = yearPositions[selectedYear]
    const currentPosition = Object.values(yearPositions)[0] - (scrollTotal * 25)
    // the + 3 in the next line moves the selected year slightly closer to the foreground
    const totalChangeNeeded = ((currentPosition - selectedYearPosition) / 25) + 3
    const direction = (totalChangeNeeded < 0) ? -1 : 1
    const step = 1 * direction
    let steps = 0
    const totalAnimationTime = 2000
    const timePerStep = (totalAnimationTime / totalChangeNeeded > 50) ? 50 : totalAnimationTime / totalChangeNeeded
    const interval = setInterval(() => {
      const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
      contextRef.current.clearRect(0, 0, width, height)
      drawBoundaries(vanishingPoint)
      drawEvents(step)
      if (Math.abs(steps * step) < Math.abs(totalChangeNeeded)) {
        steps += 1
      } else {
        clearInterval(interval)
      }
    }, timePerStep)
  }, [
    selectedYear
  ])

  return (
    <div className='stage' ref={containerRef}>
      {eventForPopup &&
        <Popup
          category={eventForPopup.Category}
          year={eventForPopup.Year}
          description={eventForPopup.Description}
          setEventForPopup={setEventForPopup}
        />
      }
      {selectedBackgroundRegion &&
        <BackgroundTooltip
          description={descriptions[selectedBackgroundRegion]}
          bounds={regions[selectedBackgroundRegion]}
          setSelectedBackgroundRegion={setSelectedBackgroundRegion}
        />
      }
      <div className='viewport'>
        <div className='scene3D-container'>
          <img
            alt='Various landmarks and components of the San Diego region'
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

export default React.memo(Stage)
