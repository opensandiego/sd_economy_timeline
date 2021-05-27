import electrification from '../assets/era-electrification-1880-1929@3x.png'
import industrial from '../assets/era-industrial-revolution-1830-1879@3x.png'
import life from '../assets/era-life-science-2010-2060@3x.png'
import mobility from '../assets/era-mobility-1930-1969@3x.png'
import transportation from '../assets/era-steel-railway-transportation-1830-1879@3x.png'
import technology from '../assets/era-technology-1970-2009@3x.png'

const eras = [{
  name: "electrification",
  description: "Electrification accelerated the growth of cities, with streetlights bringing nightlife across America, and subways and electrified trolley cars expanding public transportation. In San Diego, this era also saw city leaders persuade the U.S. Navy to establish bases at San Diego Bay, the rise of tourism following the 1915 Panama-California Exposition, and the growth of hospitals, museums, and other civic institutions.",
  teardrop: electrification,
  start: 1880,
  end: 1929
}, {
  name: "industrial",
  description: "The industrial revolution marked the transition from agrarian economies to those dominated by industry and manufacturing. The use of new materials such as iron and steel, new energy sources such as coal, and the revolutionary impact of the steam engine - using steam power to perform mechanical work - transformed America in the 19th and early 20th centuries.",
  teardrop: industrial,
  start: 1780,
  end: 1829
}, {
  name: "life",
  description: "This era will focus on how we gather, manage, analyze, and protect data; creating clean technologies for energy production, transportation, and other economic sectors to combat climate change; robotics, automation, and artificial intelligence for transportation and other economic sectors; and genetic advancements in biomedicine. The San Diego region is poised to lead in all these areas.",
  teardrop: life,
  start: 2010,
  end: 2060
}, {
  name: "mobility",
  description: "World War II transformed the world order. Personal mobility exploded as the automobile and air travel became accessible to most people. America even went to the moon. San Diego was a manufacturing powerhouse during WWII, and afterward city leaders with an eye on the future gifted land for UC San Diego and a new generation of innovators.",
  teardrop: mobility,
  start: 1930,
  end: 1969
}, {
  name: "transportation",
  description: "The mastery of steel production fueled the construction of railroads across the continent, connecting communities from San Diego to New York City. By linking the country’s growing populations, people and goods flowed throughout the America, hastening settlement across the West and helping new cities like San Diego to prosper.",
  teardrop: transportation,
  start: 1830,
  end: 1879
}, {
  name: "technology",
  description: "During this era the computer industry created a knowledge-based economy and fueled new opportunities for growth. In San Diego, a center of biomedical research emerged around the young UC San Diego as President Nixon declared a war on cancer. Biomedical research in the San Diego regionhas since become a focal point of innovation, collaboration, and economic prosperity.",
  teardrop: technology,
  start: 1970,
  end: 2009
}]

export default eras
