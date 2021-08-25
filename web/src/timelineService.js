import * as d3 from "d3";
import data from "./SD-Regional-Economy-Timeline-Data_V2_6-03-21.csv";
import categories from "./categories.txt";
import description from "./description.txt";
import stories from "./stories.txt"

const TimelineService = {
  async readCSV() {
    const rows = await d3.csv(data)
    // convert decades to start of the decade and update description
    const decade = /(\d{4})s/
    rows.forEach(row => {
      const isDecade = decade.exec(row.Year)
      if (isDecade) {
        row.Description = `${row.Description} (${row.Year})`
        row.Year = isDecade[1]
      }
    })
    const rowsWithYear = rows.filter(row => !!row.Year)
    // sort data by year
    rowsWithYear.sort((a, b) => {
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
    return rowsWithYear
  },

  async readCategories() {
    const response = await d3.text(categories)
    return JSON.parse(response)
  },

  async readDescription() {
    const res = await d3.text(description)
    return JSON.parse(res)
  },

  async readStories() {
    const res = await d3.text(stories)
    return JSON.parse(res)
  }
};

export default TimelineService;
