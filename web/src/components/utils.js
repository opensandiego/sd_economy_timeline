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
  const fontFamily = 'Montserrat'
  const descriptionLimit = 27
  let desc
  if (Description.length >= descriptionLimit) {
    const shortened = Description.slice(0, descriptionLimit).replace(/\W$/g, '') // strip punctuation
    const lastSpace = shortened.lastIndexOf(' ')
    const fullWords = shortened.slice(0, lastSpace)
    desc = `${fullWords}...`
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
    let span = document.createElement('span')
    span.innerHTML = `${firstLine}<br>${secondLine}`
    span.style.opacity = 0
    span.style.fontSize = `${fontSize}px`
    span.style.fontFamily = fontFamily
    span.style.textAlign = 'center'
    span.style.padding = '10px'
    document.body.appendChild(span)
    const { width, height } = span.getBoundingClientRect()

    let spanCategory = document.createElement('span')
    spanCategory.innerHTML = Category
    spanCategory.style.opacity = 0
    spanCategory.style.fontSize = `${fontSize}px`
    spanCategory.style.fontFamily = fontFamily
    spanCategory.style.textAlign = 'center'
    spanCategory.style.padding = '10px'
    document.body.appendChild(spanCategory)
    const { width: categoryWidth } = spanCategory.getBoundingClientRect()

    eventTextDimensions[textDimensionsKey] = {
      // width: (width + padx) * multiplier,
      width: (width > categoryWidth ? width : categoryWidth) * multiplier,
      // height: (height + pady) * multiplier
      height: height * multiplier
    }
    // if (firstLine !== 'California is') {
    document.body.removeChild(span)
    document.body.removeChild(spanCategory)
    // span = null
    // }
    // console.log(firstLine, eventTextDimensions[textDimensionsKey])
  }
  if (secondLine === '') {
    eventTextDimensions[textDimensionsKey].lineCount = 1
  } else {
    eventTextDimensions[textDimensionsKey].lineCount = 2
  }
  const {
    width: textWidth,
    height: textHeight
  } = eventTextDimensions[textDimensionsKey]
  const rectWidth = textWidth
  const rectHeight = textHeight

  let textCanvas = document.createElement('canvas')
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
  let verticalPosition = 2
  let ctx = textCanvas.getContext('2d')
  ctx.scale(deviceScale, deviceScale)
  roundedRect(ctx, 0, 0, rectWidth, rectHeight, 5 * multiplier)
  ctx.fillStyle = textFillStyle
  ctx.textAlign = 'center'
  ctx.font = `${textSize.fontSize}px ${fontFamily}`
  ctx.fillText(firstLine, textSize.x, textSize.y + (verticalPosition * multiplier))
  if (secondLine) {
    verticalPosition += 16
    ctx.fillText(secondLine, textSize.x, textSize.y + (verticalPosition * multiplier))
  }
  ctx.fillStyle = categoryFillStyle
  ctx.font = `${categorySize.fontSize}px ${fontFamily}`
  verticalPosition += 10
  ctx.fillText(Category, categorySize.x, categorySize.y + (verticalPosition * multiplier))
  // const png = textCanvas.toDataURL()
  // ctx = null
  // textCanvas.width = 0
  // textCanvas.height = 0
  // textCanvas = null
  return textCanvas
  // return png
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

export const createTeardropImages = eras => {
  const images = eras.reduce((all, era) => {
    all[era.name] = createImage(era.teardrop, 95, 137)
    return all
  }, {})
  return images
}

export const createEraLookup = eras => {
  const yearLookup = eras.reduce((years, era) => {
    const { start, end, name } = era
    let current = start
    while (current <= end) {
      years[current] = name
      current += 1
    }
    return years
  }, {})
  return yearLookup
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
