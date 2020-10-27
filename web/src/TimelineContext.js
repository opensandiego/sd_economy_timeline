import React, { Component } from "react";
import TimelineService from "./timelineService"

const TimelineContext = React.createContext({
  stageResults: [],
  selectedDec: null,
  selectedSectors: [],
  keySectors: [],
  allSectors: [],
  showASector: null,
  showFilter: false,
  updateDec: () => {},
  updateSelectedSectors: () => {},
  handleCheckbox: () => {},
  removeSector: () => {},
  clearFilter: () => {},
  toggleShowASector: () => {},
  toggleShowFilter: () => {},
  updateResults: () =>{}
});

export default TimelineContext;

export class TimelineContextProvider extends Component {
  state = {
    stageResults: [],
    selectedDec: 2010,
    selectedSectors: ["Civic", "Mobility", "Military", "Political", "Tourism"],
    keySectors: ["Civic", "Mobility", "Military", "Political", "Tourism"],
    allSectors: [
      "Healthcare",
      "Tech",
      "Manufacturing",
      "Goods Movement",
      "Tribal",
      "Crossborder",
      "Landuse",
    ],
    showASector: true,
    showFilter: false,
  };

  updateDec = (selectedDec) => {
    console.log("changing decade");
    this.setState({
      selectedDec,
    });
  };

  handleCheckbox = (e) => {
    if (e.target.checked & (this.state.selectedSectors.length < 5)) {
      this.setState({
        selectedSectors: [...this.state.selectedSectors, e.target.value],
      });
    } else console.log("you can only select 5 sectors at a time");
  };

  removeSector = (sector) => {
    let index = this.state.selectedSectors.indexOf(sector);
    let newSelected = this.state.selectedSectors;
    newSelected.splice(index, 1);
    this.setState({
      selectedSectors: newSelected,
    });
  };

  clearFilter = () => {
    this.setState({ selectedSectors: [] });
  };

  toggleShowASector = () => {
    this.setState((prevState) => ({
      showASector: !prevState.showASector,
    }));
  };

  updateDec = (value) => {
    // console.log('updating year',value);
    this.setState({selectedDec: value})
  }

  updateResults = (results) => {
    console.log('IN UPDATERESULTS',results)
    // this.setState({stageResults: results})
    // console.log(this.state.stageResults)
  }

  toggleShowFilter = () => {
    this.setState((prevState) => ({
      showFilter: !prevState.showFilter,
    }));
  };

  render() {
    const value = {
      stageResults: this.state.stageResults,
      selectedDec: this.state.selectedDec,
      selectedSectors: this.state.selectedSectors,
      keySectors: this.state.keySectors,
      allSectors: this.state.allSectors,
      showASector: this.state.showASector,
      showFilter: this.state.showFilter,
      updateDec: this.updateDec,
      updateSelectedSectors: this.updateSelectedSectors,
      handleCheckbox: this.handleCheckbox,
      removeSector: this.removeSector,
      clearFilter: this.clearFilter,
      toggleShowASector: this.toggleShowASector,
      toggleShowFilter: this.toggleShowFilter,
      updateResults: this.updateResults
    };

    return (
      <TimelineContext.Provider value={value}>
        {this.props.children}
      </TimelineContext.Provider>
    );
  }
}
