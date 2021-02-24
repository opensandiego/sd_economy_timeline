import * as d3 from "d3";
import data from "./all-data-by-date-and-category.csv";
import categories from "./categories.txt";

const TimelineService = {
  async readCSV() {
    const rows = await d3.csv(data)
    return rows
  },

  async readCategories() {
    const response = await d3.text(categories)
    return JSON.parse(response)
  }
};

export default TimelineService;
