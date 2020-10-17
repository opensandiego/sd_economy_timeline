import * as d3 from "d3";
import data from "./all-data-by-date-and-category.csv";

const TimelineService = {
  async readCSV() {
    const rows = await d3.csv(data)
    return rows
  },

};

export default TimelineService;
