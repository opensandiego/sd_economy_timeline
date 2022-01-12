import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import { BsInfoCircle, BsInfoCircleFill } from 'react-icons/bs'
// import backgroudImagePath from '../assets/Background-kth.png'
import backgroudImagePath from '../assets/TallerBackground_SANDAG@2x.png'
import eras from './eras'
import arrowsLeft from '../assets/stage-arrows-left.png'
import arrowsRight from '../assets/stage-arrows-right.png'
import faHandPointUp from '../assets/fa-hand-point-up.svg'
import { iconInfo, categoryToIcon } from './icons'
import { regions, descriptions } from './regions'
import {
  makeEventKey,
  createImage,
  drawEventText,
  getDecade,
  createTeardropImages,
  createEraLookup
} from './utils'
import Popup from './Popup'
import BackgroundTooltip from './BackgroundTooltip'

const deviceScale = (window.devicePixelRatio) ? window.devicePixelRatio : 1
const timelinePaddingExpansion = 1.1
const endToScreenRatio = 1
const vanishTop = 0.382
let width = 600
let height = 660
let maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion

const eraTeardrops = createTeardropImages(eras)
const eraLookupByYear = createEraLookup(eras)
const eraInfo = eras.reduce((all, era) => {
  all[era.name] = era
  return all
}, {})

const cardSize = 720
let timeline3DLength = 3000
let selectedEvents
let currentHover
let eventTextElements = {}
let eventTextDimensions = {}
let eventTextBuilt = false
let arrowsLeftImage, arrowsRightImage, faHandPointUpImage
let rectCount = 30
let scrollTotal = 0
let totalDraws = -1
let yearPositions = {}
let timelineCurrentYear
let yearsToTrackScrolling = []
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
      let rowYears = []
      rowCount = 0
      positions.push({
        x: 0.3,
        y: timeline3DLength - (yIncrement + (currentRow * yIncrement)),
        row: currentRow,
        year: events[eventsProcessed].Year
      })
      rowYears.push(events[eventsProcessed].Year)
      eventsProcessed += 1
      rowCount += 1
      if (!events[eventsProcessed]) {
        continue
      }

      positions.push({
        x: 0.7,
        y: timeline3DLength - (yIncrement + (currentRow * yIncrement)),
        row: currentRow,
        year: events[eventsProcessed].Year
      })
      rowYears.push(events[eventsProcessed].Year)
      eventsProcessed += 1
      rowCount += 1
      if (!events[eventsProcessed]) {
        continue
      }

      if (currentRow % 2 === 0 && events[eventsProcessed]) {
        positions[positions.length - 2].x = 0.2
        positions[positions.length - 1].x = 0.5
        positions.push({
          x: 0.8,
          y: timeline3DLength - (yIncrement + (currentRow * yIncrement)),
          row: currentRow,
          year: events[eventsProcessed].Year
        })
        rowYears.push(events[eventsProcessed].Year)
        eventsProcessed += 1
        rowCount += 1
      }
      currentRow += 1

      let rowsAdded = 0
      rowYears.forEach((year, index) => {
        const oneAhead = index + 1
        if (rowYears[oneAhead]) {
          const currentDecade = year.slice(0, 3)
          const nextDecade = rowYears[index + 1].slice(0, 3)
          if (currentDecade !== nextDecade) {
            const updatedY = timeline3DLength - (yIncrement + ((currentRow + rowsAdded) * yIncrement))
            if (index === 0) {
              // going to be a single event in the row, center it
              positions[positions.length - (rowYears.length)].x = 0.5
              // move additional event in this row to the next row since the decade changed
              positions[positions.length - (rowYears.length - 1 - index)].x = 0.3
              positions[positions.length - (rowYears.length - 1 - index)].y = updatedY
              if (rowYears.length === 3){
                positions[positions.length - 1].x = 0.7
                positions[positions.length - 1].y = updatedY
              }
            }
            if (index === 1) {
              // two events in this row after adjustment
              positions[positions.length - (rowYears.length)].x = 0.3
              positions[positions.length - (rowYears.length - 1)].x = 0.7
              // third event in this row is in a different decade, move to a new row
              positions[positions.length - 1].x = 0.5
              positions[positions.length - 1].y = updatedY
            }
            rowsAdded += 1
          }
        }
      })
      currentRow += rowsAdded
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
    year: position.year,
    x: position.x,
    y: position.y - (-change * 25) // <-- flip scroll direction
    // y: rect.y - (change * 25)
  }))
}
let rects = initializePositions()

const earliestEraStart = eras
  .map(era => era.start)
  .reduce((oldest, current) => {
    return current < oldest ? current : oldest
  }, new Date().getFullYear())

const Stage = ({data, selectedSectors, selectedYear, setSelectedYear, setTimelineScroll, selectedStory, smallScreen, setSmallScreen })=> {
  selectedEvents = data && data
    .filter(event => selectedSectors.includes(event.Category))
    .map(event => {
      return {
        ...event,
        position: event.position || {}
      }
    })
  if (selectedStory) {
    const standardized = selectedStory.replace(/[^a-zA-Z]/g, '').toLowerCase()
    selectedEvents = data
      .filter(event => event.StoryStandardized === standardized)
      .map(event => {
        return {
          ...event,
          position: event.position || {}
        }
      })
  }
  if (selectedEvents && selectedEvents.length) {
    selectedEvents.sort((a, b) => {
      const firstYear = +a.Year
      const secondYear = +b.Year
      if (firstYear < secondYear) {
        return -1
      }
      if (firstYear > secondYear) {
        return 1
      }
      return 0
    })
  }
  if (data && data.length && (selectedEvents.length - 1 !== rectCount)) {
    rectCount = (selectedEvents.length) ? selectedEvents.length - 1 : 3000
    timeline3DLength = rectCount * yIncrement
    rects = initializePositions(selectedEvents)
    yearPositions = rects.reduce((acc, cur) => {
      let year
      if (cur && cur.year) {
        year = +cur.year.replace(/[^0-9]*/g, '')
      }
      if (!acc[year]) {
        acc[year] = cur.y
      }
      return acc
    }, {})
    yearsToTrackScrolling = rects.map(rect => {
      return {
        year: rect.year,
        position: rect.y
      }
    })
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
  const [eraTitle, setEraTitle] = useState(null)
  const [eraPeriod, setEraPeriod] = useState(null)
  const [eraDescription, setEraDescription] = useState(null)
  const [eraColor, setEraColor] = useState(null)

  if (data && data.length && selectedEvents.length && !eventTextBuilt && sceneSizeEstablished) {
    data.forEach(event => {
      eventTextElements[makeEventKey(event)] = drawEventText(event, 1, eventTextDimensions, deviceScale)
      eventTextElements[`${makeEventKey(event)}-high-res`] = drawEventText(event, 2, eventTextDimensions, deviceScale)
    })
    eventTextBuilt = true
    // console.log(eventTextElements)
  }

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
    contextRef.current.font = `12px Montserrat`
    contextRef.current.fillStyle = 'black'
    contextRef.current.fillText('Tap on objects', 880, 425)
    contextRef.current.fillText('to learn about', 880, 442)
    contextRef.current.fillText('iconic sites in', 880, 459)
    contextRef.current.fillText('the San Diego', 880, 476)
    contextRef.current.fillText('region!', 880, 493)
    contextRef.current.drawImage(faHandPointUpImage, 858, 432, 20, 20)
    contextRef.current.strokeStyle = 'white'
    contextRef.current.beginPath()
    contextRef.current.moveTo(864.5, 429)
    contextRef.current.lineTo(864.5, 424)
    contextRef.current.closePath()
    contextRef.current.stroke()
    const r = 5
    contextRef.current.beginPath()
    contextRef.current.moveTo(870, 421 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.lineTo(870 - Math.cos(65 * Math.PI / 180) * r, 425 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.closePath()
    contextRef.current.stroke()

    contextRef.current.beginPath()
    contextRef.current.moveTo(859, 421 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.lineTo(859 + Math.cos(65 * Math.PI / 180) * r, 425 + Math.sin(65 * Math.PI / 180) * r)
    contextRef.current.closePath()
    contextRef.current.stroke()

    // the stage
    const blPos = timelineToScreen({
      x: -0.1,
      y: timeline3DLength
    })
    var brPos = timelineToScreen({
      x: 1.1,
      y: timeline3DLength
    })
    const gradient = contextRef.current.createLinearGradient(0, height * vanishTop, 0, height);
    // gradient.addColorStop(0, `rgb(230,200,173,0)`)
    gradient.addColorStop(0.096, `rgb(230,200,173,0)`)
    gradient.addColorStop(0.10, `rgb(230,200,173,.8)`)
    gradient.addColorStop(0.32, `rgb(213,185,161,.9)`)
    gradient.addColorStop(0.59, `rgb(213,185,161,1)`)
    gradient.addColorStop(1, `rgb(204,180,156,1)`)
    contextRef.current.fillStyle = gradient
    contextRef.current.beginPath()
    contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y)
    contextRef.current.lineTo(blPos.x, blPos.y)
    contextRef.current.lineTo(brPos.x, brPos.y)
    contextRef.current.moveTo(vanishingPoint.x, vanishingPoint.y)
    contextRef.current.closePath()
    contextRef.current.fill()
    contextRef.current.drawImage(arrowsLeftImage, 328, 648, 47, 46)
    contextRef.current.drawImage(arrowsRightImage, 618, 648, 47, 46)
  }

  const eventIsCurrentHover = e => {
    return currentHover.Year === e.Year &&
      currentHover.Category === e.Category &&
      currentHover.Description === e.Description
  }

  const drawDecadeMark = (rect, year) => {
    const screenPosition = timelineToScreen({
      x: -0.1,
      y: rect.y + 5
    })
    const { x, y, sliceWidth } = screenPosition
    const scaleFactor = sliceWidth / cardSize
    if (scaleFactor < 0.15 || scaleFactor > 3) return
    const xOffset = 200 * scaleFactor
    const yOffset = 5 * scaleFactor
    contextRef.current.font = `${32 * scaleFactor}px Montserrat`
    contextRef.current.fillStyle = 'white'
    contextRef.current.fillText(year, x - xOffset, y + yOffset)
    contextRef.current.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    contextRef.current.lineTo(x + sliceWidth * 1.2, y)
    contextRef.current.closePath()
    contextRef.current.stroke()
  }

  const drawEvents = (change = 0, force = false) => {
    scrollTotal += change
    // console.log('draw events change', change, scrollTotal)
    // console.log('drawEvent current hover?', currentHover)
    if (!selectedEvents || selectedEvents.length === 0) {
      return
    }
    const nextRects = updatePositions(change, rects)
    for (let i = nextRects.length - 1; i >= 0; i--) {
      const rect = nextRects[i]
      const screenPosition = timelineToScreen(rect)
      // console.log('screenPosition', screenPosition.x, screenPosition.y)
      const scaleFactor = screenPosition.sliceWidth / cardSize
      // console.log('scaleFactor', scaleFactor, `(${screenPosition.sliceWidth})`)
      const eventTextWidth = eventTextDimensions[`${selectedEvents[i].Description}-1`].width
      const eventTextHeight = eventTextDimensions[`${selectedEvents[i].Description}-1`].height
      const eventTextLines = eventTextDimensions[`${selectedEvents[i].Description}-1`].lineCount
      const oneLineDescription = eventTextLines === 1 ? 19 * scaleFactor : 0 // line height is 19px, used to move one line description up so it's visible
      // console.log('eventText dims', eventTextWidth, eventTextHeight)
      const cardWidth = eventTextWidth * scaleFactor
      const teardropWidth = 60 * scaleFactor
      if (cardWidth < 3) {
        selectedEvents[i].position.active = false
        continue
      }

      // add decade lines as necessary
      if (nextRects[i - 1]) {
        const currentDecade = getDecade(selectedEvents[i])
        const eventDecade = getDecade(selectedEvents[i - 1])
        if (eventDecade !== currentDecade) {
          drawDecadeMark(nextRects[i], currentDecade)
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
      contextRef.current.fillStyle = `rgba(255,255,255,${opacity})`
      const eventText = eventTextElements[eventTextKey]
      const dxText = screenPosition.x - 0.5 * cardWidth
      const dyText = screenPosition.y - arrowHeight - textHolderHeight - vShift - oneLineDescription
      // console.log('draw image params', dx, dy, cardWidth, textHolderHeight)
      // console.log(selectedEvents[i].Category, eventTextWidth, cardWidth, eventTextHeight, textHolderHeight)
      // Draw the text for the event
      contextRef.current.drawImage(eventText, dxText, dyText, cardWidth, textHolderHeight)

      const dx = screenPosition.x - 0.5 * teardropWidth
      const dy = screenPosition.y - teardropHeight - vShift
      // Draw the tear drop
      let eventYear = selectedEvents[i].Year
      // special case handling for "8,000+ B.C." events
      if (!eventYear.match(/\d{4}/)) {
        eventYear = eventYear.replace(/[^0-9]*/g, '')
      }
      const eventEra = eraLookupByYear[eventYear] || eraLookupByYear[`-${eventYear}`]
      const eraTeardrop = eraTeardrops[eventEra] || eraTeardrops.life // fallback to pink teardrop when none exists
      contextRef.current.drawImage(eraTeardrop, dx, dy, teardropWidth, teardropHeight)

      // keep track of dimensions to test if a timeline item is clicked
      selectedEvents[i].position = {
        x: dx,
        y: dy,
        width: teardropWidth,
        height: teardropHeight,
        text: {
          x: dxText,
          y: dyText,
          width: cardWidth,
          height: textHolderHeight
        },
        active: true
      }
      // console.log(selectedEvents[i].Category, selectedEvents[i].Year, selectedEvents[i].position.x)

      const eventIcon = iconInfo[categoryToIcon[selectedEvents[i].Category]]
      // console.log('eventIcon', selectedEvents[i].Category, eventIcon)
      if (eventIcon && opacity > 0) {
        const iconWidth = eventIcon.width * scaleFactor
        const iconHeight = eventIcon.height * scaleFactor
        const iconVerticalShift = 10 - (eventIcon.verticalShift || 0)
        const iconHeightAdjust = teardropHeight - (iconVerticalShift * scaleFactor)
        const dxIcon = screenPosition.x - 0.5 * iconWidth
        const dyIcon = screenPosition.y - iconHeightAdjust - vShift
        // Draw the event icon on the tear drop
        const yearFont = `bold ${14 * scaleFactor}px Montserrat`
        contextRef.current.drawImage(eventIcon.image, dxIcon, dyIcon, iconWidth, iconHeight)
        contextRef.current.font = yearFont
        const ones = (`${selectedEvents[i].Year}`.match(/1/g) || []).length
        const zeroZeroTwo = (`${selectedEvents[i].Year}`.match(/00[0|2-9]/g) || []).length ? -1 : 0
        // const xNudge = `${selectedEvents[i].Year}`.slice(0,1) === '1' ? 14 : 15
        const is8000 = +eventYear === 8000 ? 2 : 0
        const xNudge = 13 + ones - zeroZeroTwo - is8000
        // Draw the event's year under the icon
        contextRef.current.fillText(eventYear, dx + (xNudge * scaleFactor), dy + teardropHeight - (32 * scaleFactor))
        if (is8000) {
          contextRef.current.font = `bold ${10 * scaleFactor}px Montserrat`
          contextRef.current.fillText('B.C.', dx + ((xNudge + 8) * scaleFactor), dy + teardropHeight - (20 * scaleFactor))
          contextRef.current.font = yearFont
        }
      }

      const startPos = {
        x: screenPosition.x,
        y: screenPosition.y + vShift
      }
      const { x, y } = startPos
      const radius = 15 * scaleFactor
      const centerX = x
      const centerY = y + (20 * scaleFactor)
      const width = 60 * scaleFactor
      const height = 3 * scaleFactor
      const radialGradient = contextRef.current.createRadialGradient(x, y + radius + 5, 0, x, y + radius + 5, width)
      radialGradient.addColorStop(0, 'rgba(51, 51, 51, 0.3)')
      radialGradient.addColorStop(0.2, 'rgba(51, 51, 51, 0.18)')
      radialGradient.addColorStop(0.3, 'rgba(51, 51, 51, .07)')
      radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
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
    }
    totalDraws += 1
    rects = nextRects

    if (totalDraws % 10 === 0 || force) {
      const allPositions = yearsToTrackScrolling.map(o => o.position)
      const start = allPositions[0]
      const end = allPositions[allPositions.length - 1]
      const range = start - end
      const scrollFraction = ((scrollTotal * 25) / range)
      const scrollClamped = (scrollFraction >= 1) ?
        1 :
          (scrollFraction < 0) ?
            0 :
            scrollFraction

      const allYears = yearsToTrackScrolling.map(o => o.year)
      // console.log(allYears)
      const currentScroll = scrollTotal * 25
      let distance = 0
      let position = 0
      while (distance < currentScroll) {
        position += 1
        distance += allPositions[position - 1] - allPositions[position]
      }
      // position = (position > 1) ? position - 1 : position
      let currentYear = allYears[position]
      timelineCurrentYear = currentYear
      if (!currentYear) {
        return
      }
      // check if currentYear is a four-digit year
      // this is required because some events have "8,000+ B.C." as their year
      if (!currentYear.match(/\d{4}/)) {
        // convert to four-digit year
        currentYear = currentYear.replace(/[^0-9]*/g, '')
      }
      let stageDecade = `${currentYear.slice(0, 3)}0`
      if (force) {
        stageDecade = `${selectedYear.slice(0, 3)}0`
      }

      // fallback to "negative" year so that we use BC years correctly
      const nextEra = eraInfo[eraLookupByYear[currentYear]] || eraInfo[eraLookupByYear[`-${currentYear}`]]
      const nextTitle = nextEra.title
      const nextPeriod = `(${nextEra.startDisplay || nextEra.start} - ${nextEra.end})`
      setEraTitle(nextTitle)
      setEraPeriod(nextPeriod)
      setEraDescription(nextEra.description)
      setEraColor(nextEra.color)
      setTimelineScroll({ fraction: scrollClamped, stageDecade })
    }
  }

  useEffect(() => {
    if (!yearsToTrackScrolling) {
      return
    }
    const allPositions = yearsToTrackScrolling.map(o => o.position)
    const allYears = yearsToTrackScrolling.map(o => o.year)
    const currentScroll = scrollTotal * 25
    let distance = 0
    let position = 0
    while (distance < currentScroll) {
      position += 1
      distance += allPositions[position - 1] - allPositions[position]
    }
    position = (position > 1) ? position - 1 : position
    let currentYear = allYears[position] ?? allYears[0]
    if (!currentYear) {
      return
    }
    // check if currentYear is a four-digit year
    // this is required because some events have "8,000+ B.C." as their year
    if (!currentYear.match(/\d{4}/)) {
      // convert to four-digit year
      currentYear = currentYear.replace(/[^0-9]*/g, '')
    }
    const stageDecade = `${currentYear.slice(0, 3)}0`
    // fallback to "negative" year so that we use BC years correctly
    const nextEra = eraInfo[eraLookupByYear[currentYear]] || eraInfo[eraLookupByYear[`-${currentYear}`]]
    const nextTitle = nextEra.title
    const nextPeriod = `(${nextEra.startDisplay || nextEra.start} - ${nextEra.end})`
    setEraTitle(nextTitle)
    setEraPeriod(nextPeriod)
    setEraDescription(nextEra.description)
    setEraColor(nextEra.color)

  }, [
    selectedSectors
  ])

  useEffect(() => {
    const isMobileUserAgent = navigator.userAgent.match(/Mobi/)
    // const isMobileUserAgent = navigator.userAgent.match(/Chrome/)
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    // const isTouch = true
    console.log('mobile and touch?', isMobileUserAgent, isTouch)
    if (isMobileUserAgent && isTouch) {
    // if (isMobileUserAgent && isTouch) {
      setSmallScreen(true)
      console.log('...set small screen to TRUE, width?', width, containerRef.current.parentElement.parentElement)
      containerRef.current.parentElement.parentElement.style.overflow = 'hidden'
      return
    }

    const {
      width: sceneWidth,
      height: sceneHeight
    } = sceneRef.current.getBoundingClientRect()
    width = sceneWidth
    height = sceneHeight + 60
    maxTimelineWidth = width * endToScreenRatio * timelinePaddingExpansion
    console.log('useEffect...width and height', width, height)
    setSceneSize({
      width,
      height
    })
    setSceneSizeEstablished(true)

    arrowsLeftImage = createImage(arrowsLeft, 47, 46)
    arrowsRightImage = createImage(arrowsRight, 47, 46)
    faHandPointUpImage = createImage(faHandPointUp, 20, 20)
    Object.values(iconInfo).forEach(info => {
      const { path, width, height } = info
      info.image = createImage(path, width, height)
    })
  }, [])

  useEffect(() => {
    if (!sceneSizeEstablished || smallScreen) return
    contextRef.current = canvasRef.current.getContext('2d')
    contextRef.current.scale(deviceScale, deviceScale)

    const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
    contextRef.current.clearRect(0, 0, width * 2, height)

    contextRef.current.fillStyle = 'rgba(0,0,0,0)'
    contextRef.current.fillRect(0, 0, width, height)

    // Reach up to the .row element and set a height so
    // that the timeline sits flush with the stage
    // ...there's probably a better way to do this but this work
    containerRef.current.parentElement.style.height = `${height}px`
    containerRef.current.parentElement.style.overflow = 'hidden'
    containerRef.current.parentElement.style.flex = 'none'

    drawBoundaries(vanishingPoint)
    drawEvents()

    // const handler = debounce(function (event) {
    const handler = function (event) {
      event.preventDefault() // stop scroll so entire page doesn't scroll
      let delta = 0
      if (event.wheelDelta) {
          delta = event.wheelDelta / 120;
      }
      if (event.detail) {
          delta = -event.detail / 3;
      }
      if (scrollTotal + delta < 0 || (delta > 0 && !timelineCurrentYear)) {
        return
      }
      contextRef.current.clearRect(0, 0, width, height)
      drawBoundaries(vanishingPoint)
      drawEvents(delta)
    // }, 5)
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
      const num = selectedEvents.length
      for (let c = num - 1; c >= 0; c--) {
        const m = selectedEvents[c]
        const ma = m.position
        if (!ma || m.searchHidden || m.madeInvisible) {
          console.log('\tno position')
          continue
        }
        if (ma.active) {
          const markerHit = scr.x > ma.x && scr.x < (ma.x + ma.width) && (scr.y) > ma.y && (scr.y) < (ma.y + ma.height)
          const { text } = ma
          const textHit = scr.x > text.x && scr.x < (text.x + text.width) && scr.y > text.y && scr.y < (text.y + text.height)
          if (markerHit || textHit) {
            clickedMarker = m;
            break;
          }
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
      // console.log('canvas click...', y, clickedMarker, '; sel evts?', selectedEvents)
      if (y < 395 && clickedMarker) {
        setSelectedYear(clickedMarker.Year)
        return
      }
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

    // experimenting with doing small movements to hint that the events on the timeline move
    // setTimeout(() => {
    //   console.log('half second timeout')
    //   contextRef.current.clearRect(0, 0, width, height)
    //   drawBoundaries(vanishingPoint)
    //   drawEvents(0.5)
    // }, 2000)
    // setTimeout(() => {
    //   console.log('full second timeout')
    //   contextRef.current.clearRect(0, 0, width, height)
    //   drawBoundaries(vanishingPoint)
    //   drawEvents(-0.5)
    // }, 4000)

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
    // calculate total change needed:
    // - have existing scroll position --> scrollTotal
    // - starting position is Object.values(yearSelector)[0]
    // - current position is:  starting position - (scrollTotal * 25)
    // - desired position is:  (yearPositions[selectedYear] - current position) / 25

    const selectedYearPosition = yearPositions[selectedYear]
    const currentPosition = Object.values(yearPositions).sort((a, b) => b - a)[0] - (scrollTotal * 25)
    let totalChangeNeeded = ((currentPosition - selectedYearPosition) / 25)
    const direction = (totalChangeNeeded < 0) ? -1 : 1
    const step = 1 * direction
    let steps = 0
    const totalAnimationTime = 2000
    const timePerStep = (Math.abs(totalAnimationTime / totalChangeNeeded) > 50) ? 50 : Math.abs(totalAnimationTime / totalChangeNeeded)
    const interval = setInterval(() => {
      const vanishingPoint = timelineToScreen({ x: 0.5, y: 0 })
      contextRef.current.clearRect(0, 0, width, height)
      drawBoundaries(vanishingPoint)
      drawEvents(step)
      steps += 1
      if (Math.abs(steps * step) >= Math.abs(totalChangeNeeded)) {
        clearInterval(interval)
        setTimeout(() => {
          contextRef.current.clearRect(0, 0, width, height)
          drawBoundaries(vanishingPoint)
          drawEvents(0, true)
        }, timePerStep)
      }
    }, timePerStep)
  }, [
    selectedYear
  ])

  useEffect(() => {
    if (yearsToTrackScrolling.length) {
      timelineCurrentYear = yearsToTrackScrolling[0].year
      scrollTotal = 0
      const resetDecade = `${yearsToTrackScrolling[0].year}0`
      setTimelineScroll({ fraction: 0, stageDecade: resetDecade })
    }
  }, [
    selectedSectors,
    selectedStory
  ])

  const smallScreenStyle = smallScreen ?
    { height: '300px' } :
    {}

  return (
    <div className='stage' ref={containerRef} style={smallScreenStyle}>
      {eventForPopup &&
        <Popup
          category={eventForPopup.Category}
          year={eventForPopup.Year}
          description={eventForPopup.Description}
          image={eventForPopup['Image File Name']}
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
      <div className='scene-container'>
        <div className='current-era' style={{ color: eraColor }}>
          <div className='current-era-tooltip-container'>
            <span>{eraTitle}</span>
            {eraTitle &&
              <span className="tooltip">
                <BsInfoCircle />
                <BsInfoCircleFill />
                <span className="tooltiptext">{eraDescription}</span>
              </span>
            }
          </div>
          <div>
            <span>{eraPeriod}</span>
          </div>
        </div>

        <img
          alt='Various landmarks and attractions in the San Diego region'
          src={backgroudImagePath}
          width={width}
          height={height}
        />
        {!smallScreen && <div className='scene' ref={sceneRef}>
          <canvas
            ref={canvasRef}
            style={{
              width: `${sceneSize.width}px`,
              height: `${sceneSize.height}px`
            }}
            width={`${sceneSize.width * deviceScale}`}
            height={`${sceneSize.height * deviceScale}`}
          ></canvas>
        </div>}
        {smallScreen && <div className='unsupported'>
          <div className='unsupported-message'>
            <p>Unfortunately, our timeline isn't available on your device.</p>
            <p>We're adding support for more devices, please check back soon.</p>
            <p>In the meantime, use the download link above to explore the data.</p>
          </div>
        </div>}
      </div>
    </div>
  )
};

export default React.memo(Stage)
