import { observable, action, computed } from 'mobx';
import pestData from '../../public/pestData.json';
import { states, matchIconsToStations } from '../utils';
import { format } from 'date-fns';
import _ from 'lodash';

export default class AppStore {

  @observable ready = false;
  @action setReady = d => this.ready = d;
  // pest ------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = {};
  @action setPest = informalName => {
    this.pest = this.pests.filter(pest => pest.informalName === informalName)[0];
    localStorage.setItem('pest', JSON.stringify(this.pest))
  };
  @observable rPest = {}
  @action setRpest = d => this.rPest = d

  // state -----------------------------------------------------------------------
  @observable state = {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem('state', JSON.stringify(this.state));
  };
  @observable rState = {}
  @action setRstate = d => this.rState = d

  // stations --------------------------------------------------------------------
  @observable stations = [];
  @action setStations = d => this.stations = d;
  @computed get stationsWithMatchedIcons () {
    return (
      matchIconsToStations(this.stations, this.state)
    )
  }
  @computed get getCurrentStateStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }
  @observable station = {};
  @action setStation = stationName => {
    this.station = this.stations.filter(station => station.name === stationName)[0];
    localStorage.setItem('station', JSON.stringify(this.station))
  };
  @observable rStation = {}
  @action setRstation = d => this.rStation = d

  // DATES -----------------------------------------------------------------------
  @observable endDate = new Date();
  @action setEndDate = d => this.endDate = format(d, 'YYYY-MM-DD');
  @observable rEndDate = '';
  @action setRendDate = d => this.rEndDate = format(d, 'YYYY-MM-DD')
  @computed get getStartDate() {return `${format(this.endDate, 'YYYY')}-01-01`}

  // stage -----------------------------------------------------------------------
  @observable stage = {};
  // @computed get getStage() {return this.stage}
  @action setStage = () => {
    this.stage = this.rPest.preBiofix.filter(stage => (this.currentCDD > stage.ddlo && this.currentCDD < stage.ddhi))[0]
  }
  @computed get getStage() {
  return this.rPest.preBiofix.filter(stage => (this.currentCDD > stage.ddlo && this.currentCDD < stage.ddhi))[0]
}

  // ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action setACISData = d => this.ACISData = d;
  @computed get getDate() {
    return this.ACISData.map(e => e[0])
  }

  // degreeDay -------------------------------------------------------------------
  @observable degreeDay = [];
  @computed get getDegreeDay() {
    return this.degreeDay
  }
  @action updateDegreeDay = d => this.degreeDay = d;
  @computed get getCumulativeDegreeDay() {
    const arr = [];
    this.degreeDay.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
    return arr;
  }
  @computed get currentCDD() {
    return this.getCumulativeDegreeDay[this.getCumulativeDegreeDay.length - 6]
  }
  @computed get cumulativeDegreeDayDataGraph() {
    const arr = []
    this.ACISData.forEach((e,i) => {
      const newObj = {}
      newObj['Date'] = format(this.ACISData[i][0], 'MMM D')
      newObj['Accumulated Degree-Days'] = this.getCumulativeDegreeDay[i]
      arr.push(newObj)
    })
    return arr
  }

  // MissingValues------------------------------------------------------------------
  @observable missingValue = 0
  @action setMissingValue = d => this.missingValue = d

  // ActiveLinks -------------------------------------------------------------------
  @observable path = '/';
  @action updatePath = d => this.path = d;

  // MIX -------------------------------------------------------------------
  @computed get getAllRequiredFields() {
    return Object.keys(
      this.pest && this.state && this.station && this.endDate
    ).length === 0;
  }
}
