import {observable, action, computed} from 'mobx';
import pestData from '../../../public/pestData.json';
import {states, matchIconsToStations} from '../../utils';
import {format, getYear} from 'date-fns'


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
@observable endDate = ''
@action updateEndDate = (e) => {
  this.endDate = format(e,'MM/DD/YYYY')
  this.startDate = `01/01/${getYear(this.endDate)}`
}

// stage -----------------------------------------------------------------------
  @observable stage = {};
  @action updateStage = d => this.stage = d

// ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action updateACISData = d => this.ACISData = d

// degreeDay -------------------------------------------------------------------
  @observable degreeDay = [];
  @action updateDegreeDay = d => this.degreeDay = d
  @computed get cumulativeDegreeDay() {
    const results = []
    this.degreeDay.reduce((prev, curr, i) => results[i] = prev + curr, 0)
    return results
  }

// ActiveLinks -------------------------------------------------------------------
  @observable path = ''
  @action updatePath = d => this.path = d

}

export default AppStore;
