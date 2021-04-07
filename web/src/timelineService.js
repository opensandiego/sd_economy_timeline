import * as d3 from "d3";
import data from "./all-data-by-date-and-category.csv";
import categories from "./categories.txt";
import description from "./description.txt"

const TimelineService = {
  async readCSV() {
    const rows = await d3.csv(data)
    return rows
  },

  async readCategories() {
    const response = await d3.text(categories)
    return JSON.parse(response)
  },

  async readDescription() {
    const res = await d3.text(description)
    return JSON.parse(res)
  }
};

export default TimelineService;
