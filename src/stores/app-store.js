import { observable, action, computed } from 'mobx';
import pestData from '../../public/pestData.json';
import { states, matchIconsToStations } from '../utils';
import { format, isBefore, addDays } from 'date-fns';
import _ from 'lodash';

export default class AppStore {
  // pest ------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = {};
  @action setPest = informalName => {
    this.pest = this.pests.filter(pest => pest.informalName === informalName)[0];
    localStorage.setItem('pest', JSON.stringify(this.pest))
  };

  // state -----------------------------------------------------------------------
  @observable state = {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem('state', JSON.stringify(this.state));
  };

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

  // DATES -----------------------------------------------------------------------
  @observable endDate = new Date();
  @action setEndDate = e => this.endDate = format(e, 'YYYY-MM-DD');
  @computed get getStartDate() {return `${format(this.endDate, 'YYYY')}-01-01`}

  // stage -----------------------------------------------------------------------
  @observable stage = {};
  @computed get getStage() {return this.stage}
  @action updateStage = d => this.stage = d;

  // ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action setACISData = d => this.ACISData = d;
  @computed get getDate() {
    return this.ACISData.map(e => e[0])
    // return days.map(e => format(e, 'MMM D'))
  }

  // degreeDay -------------------------------------------------------------------
  @observable degreeDay = [];
  @computed get getDegreeDay() {
    return this.degreeDay
  }
  @action updateDegreeDay = d => this.degreeDay = d;
  @computed get getCumulativeDegreeDay() {
    const results = [];
    this.degreeDay.reduce((prev, curr, i) => results[i] = prev + curr, 0);
    return results;
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
  // Results----------------------------------------------------------------------
  @observable rPest = {}
  @action setRpest = d => this.rPest = d
  @observable rState = {}
  @action setRstate = d => this.rState = d
  @observable rStation = {}
  @action setRstation = d => this.rStation = d
  @observable rEndDate = ''
  @action setREndDate = d => {
    const endDatePlusFiveDays = addDays(this.endDate, 5);
    this.rEndDate = format(endDatePlusFiveDays, 'YYYY-MM-DD');
  }
}
