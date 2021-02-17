export const makeEventKey = e => {
  const { Category, Description, Year } = e
  return `${Category}-${Year}-${Description.replace(/\W/g, '-')}`
}

export const createImage = (path, width, height) => {
  const image = document.createElement('img')
  image.width = width
  image.height = height
  image.src = path
  return image
}

function roundedRect (ctx, x, y, w, h, corner) {
  ctx.fillStyle = 'white'
  const r = x + w
  const b = y + h

  let region = new Path2D()
  region.moveTo(x + corner, y)
  region.lineTo(r - corner, y)
  region.quadraticCurveTo(r, y, r, y + corner)
  region.lineTo(r, b - corner)
  region.quadraticCurveTo(r, b, r - corner, b)
  region.lineTo(x + corner, b)
  region.quadraticCurveTo(x, b, x, b - corner)
  region.lineTo(x, y + corner)
  region.quadraticCurveTo(x, y, x + corner, y)
  ctx.fill(region)
}

export const drawEventText = (info, multiplier, eventTextDimensions, deviceScale) => {
  const { Category, Description } = info
  // console.log('desc and len', `${Description} (${Description.length})`)
  const textDimensionsKey = `${Description}-${multiplier}`
  const fontSize = 16
  const fontFamily = 'Helvetica, sans-serif'
  const descriptionLimit = 27
  let desc
  if (Description.length >= descriptionLimit) {
    desc = `${Description.slice(0, descriptionLimit).replace(/\W$/g, '').trim()}...`
  } else {
    desc = Description
  }
  const descriptionWords = desc.split(' ')
  const descriptionWordCount = descriptionWords.length
  const firstLineCount = Math.round(descriptionWordCount / 2)
  const firstLine = descriptionWords.slice(0, firstLineCount).join(' ')
  const secondLine = descriptionWords.slice(firstLineCount).join(' ')

  // dynamically calculate text width/height
  if (!eventTextDimensions[textDimensionsKey]) {
    const span = document.createElement('span')
    span.innerHTML = `${firstLine}<br>${secondLine}`
    span.style.opacity = 0
    span.style.fontSize = `${fontSize}px`
    span.style.fontFamily = fontFamily
    span.style.textAlign = 'center'
    span.style.padding = '10px'
    document.body.appendChild(span)
    const { width, height } = span.getBoundingClientRect()
    eventTextDimensions[textDimensionsKey] = {
      // width: (width + padx) * multiplier,
      width: width * multiplier,
      // height: (height + pady) * multiplier
      height: height * multiplier
    }
    // if (firstLine !== 'California is') {
    document.body.removeChild(span)
    // }
    // console.log(firstLine, eventTextDimensions[textDimensionsKey])
  }
  const {
    width: textWidth,
    height: textHeight
  } = eventTextDimensions[textDimensionsKey]
  const rectWidth = textWidth
  const rectHeight = textHeight

  const textCanvas = document.createElement('canvas')
  textCanvas.style = `width: ${rectWidth}px; height: ${rectHeight}px`
  textCanvas.width = rectWidth * deviceScale
  textCanvas.height = rectHeight * deviceScale
  const textSize = {
    fontSize: fontSize * multiplier,
    x: rectWidth / 2,
    y: 16 * multiplier
  }
  const categorySize = {
    fontSize: (fontSize * 0.75) * multiplier,
    x: rectWidth / 2,
    y: 22 * multiplier
  }
  const textFillStyle = 'rgba(60, 60, 60, 1)'
  const categoryFillStyle = 'rgba(110, 110, 110, 1)'
  const ctx = textCanvas.getContext('2d')
  ctx.scale(deviceScale, deviceScale)
  roundedRect(ctx, 0, 0, rectWidth, rectHeight, 5 * multiplier)
  ctx.fillStyle = textFillStyle
  ctx.textAlign = 'center'
  ctx.font = `${textSize.fontSize}px ${fontFamily}`
  ctx.fillText(firstLine, textSize.x, textSize.y + (2 * multiplier))
  ctx.fillText(secondLine, textSize.x, textSize.y + (18 * multiplier))
  ctx.fillStyle = categoryFillStyle
  ctx.font = `${categorySize.fontSize}px ${fontFamily}`
  ctx.fillText(Category, categorySize.x, categorySize.y + (28 * multiplier))
  return textCanvas
}

export const getDecade = ({Year}) => {
  return `${Year.slice(0, 3)}0`
}

export const addFadeBorderForText = (textCanvas, width, height, borderWidth, deviceScale) => {
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
