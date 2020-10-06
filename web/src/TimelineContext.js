import React, { Component } from "react";

const TimelineContext = React.createContext({
  stageResults: [],
  selectedDec: null,
	selectedSectors: [],
	keySectors: [],
	allSectors: [],
	showKSector: null, 
	showASector: null,
	showFilter: false,
  updateDec: () => {},
	updateSelectedSectors: () => {},
	handleCheckbox: () => {},
	removeSector: () => {},
	clearFilter: () => {},
	toggleShowASector: () => {},
	toggleShowKSector: () => {},
	toggleShowFilter: () => {}
});

export default TimelineContext;

export class TimelineContextProvider extends Component {
  state = {
    stageResults: [],
    selectedDec: null,
    selectedSectors: [
      "Civic", 
      "Mobility", 
      "Military", 
      "Political",
      "Tourism",
		],
		keySectors: [
			'Civic', 
			'Mobility', 'Military', 
			'Political',
			'Tourism', 
		],
		allSectors:[
			'Healthcare',
			'Tech',
			'Manufacturing',
			'Goods Movement',
			'Tribal',
			'Crossborder',
			'Landuse'
		],
		showKSector: true, 
		showASector: false, 
		showFilter: false,
  };

  updateDec = (selectedDec) => {
    console.log("changing decade");
    this.setState({
      selectedDec,
    });
  };

	
	handleCheckbox = (e) => {
		console.log("HANDLING CHECK", e.target.value, e.target.checked, this.state.selectedSectors.length);
		//need to check if the checked val === true
		//only 5 categories can be selected at a time
		if(e.target.checked & this.state.selectedSectors.length < 5) {
			console.log('you can add a sector')
			//adding the checked sector
			this.setState({
				selectedSectors: [...this.state.selectedSectors, e.target.value]
			});
		} else console.log('you can only select 5 sectors at a time')
	}

	removeSector = (sector) => {
		console.log('REMOVING', sector)
		let index = this.state.selectedSectors.indexOf(sector)
		let newSelected = this.state.selectedSectors;
		newSelected.splice(index, 1);
		this.setState({
			selectedSectors: newSelected
		})
	}

	clearFilter = () => {
		this.setState({selectedSectors: []})
	}

	toggleShowASector = () => {
		this.setState((prevState => ({
			showASector: !prevState.showASector
		})))
	}

	toggleShowKSector = () => {
		this.setState((prevState => ({
			showKSector: !prevState.showKSector
		})))
	}

	toggleShowFilter = () => {
		this.setState((prevState => ({
			showFilter: !prevState.showFilter
		})))
	}

  render() {
    const value = {
      stageResults: this.state.stageResults,
      selectedDec: this.state.selectedDec,
			selectedSectors: this.state.selectedSectors,
			keySectors: this.state.keySectors,
			allSectors: this.state.allSectors,
			showKSector: this.state.showKSector,
			showASector: this.state.showASector,
			showFilter: this.state.showFilter,
      updateDec: this.updateDec,
			updateSelectedSectors: this.updateSelectedSectors,
			handleCheckbox: this.handleCheckbox,
			removeSector: this.removeSector,
			clearFilter:this.clearFilter,
			toggleShowASector: this.toggleShowASector,
			toggleShowKSector: this.toggleShowKSector,
			toggleShowFilter:this.toggleShowFilter
    };

    return (
      <TimelineContext.Provider value={value}>
        {this.props.children}
      </TimelineContext.Provider>
    );
  }
}
