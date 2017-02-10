import {observable, action, computed} from 'mobx';
import pestData from '../../../public/pestData.json';
import {states, matchIconsToStations} from '../../utils';

class AppStore {

// pest ------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = {};
  @action setPest = (e) => {
    const selectedPest = this.pests.filter(pest => pest.informalName === e.target.value)[0]
    this.pest = selectedPest
  }

// state -----------------------------------------------------------------------
  @observable state = {};
  @action updateState = (e) => {
    const selectedState = states.filter(state => state.name === e.target.value)[0]
    this.state = selectedState
  }

// stations --------------------------------------------------------------------
  @observable stations = [];
  @observable filteredStations = [];
  @action updateFilteredStations = () => {
    this.filteredStations = matchIconsToStations(this.stations, this.state)
  }
  @computed get getFilteredStations () {
    return this.stations.filter(station => station.state === this.state.postalCode)
  }
  @observable station = {};
  @action updateStation = (e) => {
    const selectedStation = this.stations.filter(station => station.name === e.target.value)[0]
    this.station = selectedStation
  }

// DATES -----------------------------------------------------------------------
@observable startDate = '';
@observable endDate = new Date();
@action handleDayClick = (e, endDate) => {
  this.endDate = endDate
  const startDate = `01/01/${endDate.getFullYear()}`
  this.startDate = startDate
}

// stage -----------------------------------------------------------------------
  @observable stage = {};
  @action updateStage = (d) => {
    this.stage = d
  }

// ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action updateACISData = (d) => {
    this.ACISData = d
  }

// degreeDay -------------------------------------------------------------------
  @observable degreeDay = [];
  @action updateDegreeDay = (d) => {
    this.degreeDay = d
  }
  @computed get cumulativeDegreeDay() {
    const results = []
    this.degreeDay.reduce((prev, curr, i) => results[i] = prev + curr, 0)
    return results
  }
}

export default AppStore;
