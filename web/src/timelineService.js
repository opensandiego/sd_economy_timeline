import * as d3 from "d3";
import data from "./all-data-by-date-and-category.csv";

const TimelineService = {
  readCSV() {
    console.log("reading csv");
    d3.csv(data, function (data) {
      // console.log(typeof data.Year, typeof data.Description, typeof data.Category);
      if (data.Year >= 2000 && data.Year <= 2010) {
        console.log(data.Year, data.Category, data.Description);
      }
    });
  },

};

export default TimelineService;
