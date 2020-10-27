import * as d3 from "d3";
import data from "./all-data-by-date-and-category.csv";

const TimelineService = {
  readCSV(dec, sectors) {
    // console.log("reading csv", dec, sectors);
    let results = [];
    d3.csv(data, function (data) {
      // console.log(typeof data.Year, typeof data.Description, typeof data.Category);
      if (data.Year >= dec && data.Year <= dec+10 && sectors.includes(data.Category) ) {
        //console.log(data.Year, data.Category, data.Description);
        results.push({"year": data.Year, "category":data.Category, "description":data.Description}) 
      } else return "somethings weird";
    });
    return results;
  },

};

export default TimelineService;
