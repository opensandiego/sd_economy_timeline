import fire from '../assets/F.I.R.E@3x.png'
import gdp from '../assets/GDP@3x.png'
import retail from '../assets/Retail@3x.png'
import transportation from '../assets/Transportation@3x.png'
import civic from '../assets/civic@3x.png'
import crossborder from '../assets/crossborder@3x.png'
import education from '../assets/education@3x.png'
import global from '../assets/global@3x.png'
import goodsmovement from '../assets/goods movement@3x.png'
import healthcare from '../assets/healthcare@3x.png'
import landuse from '../assets/historic land use@3x.png'
import innovation from '../assets/innovation@3x.png'
import manufacturing from '../assets/manufacturing@3x.png'
import military from '../assets/military@3x.png'
import tourism from '../assets/tourism@3x.png'
import tribal from '../assets/tribal nations@3x.png'

export const iconInfo = {
  fire: { path: fire, file: 'F.I.R.E@3x.png', category: 'F.I.R.E.', width: 53, height: 53 },
  gdp: { path: gdp, file: 'GDP@3x.png', category: 'GDP', width: 56, height: 45 },
  retail: { path: retail, file: 'Retail@3x.png', category: 'Retail', width: 47, height: 53 },
  transportation: { path: transportation, file: 'Transportation@3x.png', category: 'Transportation', width: 51, height: 39 },
  mobility: { path: transportation, file: 'Transportation@3x.png', category: 'Mobility', width: 51, height: 39 },
  civic: { path: civic, file: 'civic@3x.png', category: 'Civic', width: 42, height: 56, verticalShift: 5 },
  crossborder: { path: crossborder, file: 'crossborder@3x.png', category: 'CrossBorder', width: 48, height: 48 },
  education: { path: education, file: 'education@3x.png', category: 'Education', width: 58, height: 35 },
  global: { path: global, file: 'global@3x.png', category: 'Global', width: 52, height: 52 },
  goodsmovement: { path: goodsmovement, file: 'goods movement@3x.png', category: 'Goods Movement', width: 55, height: 39 },
  healthcare: { path: healthcare, file: 'healthcare@3x.png', category: 'Healthcare', width: 42, height: 42 },
  landuse: { path: landuse, file: 'historic land use@3x.png', category: 'LU & EP', width: 63, height: 33 },
  innovation: { path: innovation, file: 'innovation@3x.png', category: 'Innovation', width: 50, height: 53, verticalShift: 5 },
  manufacturing: { path: manufacturing, file: 'manufacturing@3x.png', category: 'Manufacturing', width: 50, height: 50 },
  military: { path: military, file: 'military@3x.png', category: 'Military', width: 60, height: 53 },
  tourism: { path: tourism, file: 'tourism@3x.png', category: 'Tourism', width: 50, height: 44 },
  tribal: { path: tribal, file: 'tribal nations@3x.png', category: 'Tribal', width: 65, height: 51 }
}
const scale = 0.75
Object.values(iconInfo).forEach(info => {
  info.width = info.width * scale
  info.height = info.height * scale
})

export const categoryToIcon = Object.fromEntries(Object.entries(iconInfo).map(([key, value]) => {
  return [value.category, key]
}))

export default iconInfo
