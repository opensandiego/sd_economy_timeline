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

export const drawEventText = (info, multiplier, eventTextDimensions, deviceScale) => {
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
    // console.log(Category, width, height)
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