import { observable, action, computed } from 'mobx';
import pestData from '../../public/pestData.json';
import { states, matchIconsToStations } from '../utils';
import { format } from 'date-fns';
import _ from 'lodash';

export default class AppStore {
  // pest ------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = {};
  @action setPest = informalName => {
    this.pest = this.pests.filter(pest => pest.informalName === informalName)[0];
  };

  // state -----------------------------------------------------------------------
  @observable state = {};
  @action setState = stateName => {
    this.state = states.filter(state => state.name === stateName)[0];
    localStorage.setItem('state', JSON.stringify(stateName));
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
  @observable localStation = '';
  @action setLocalStation = d => this.localStation = d
  @action setStation = stationName => {
    this.station = this.stations.filter(
      station => station.name === stationName)[0];
  };

  // DATES -----------------------------------------------------------------------
  @observable endDate = new Date();
  @action setEndDate = d => {
    this.endDate = format(d, 'YYYY/MM/DD')
  }
  @observable startDate = `${format(this.endDate, 'YYYY')}/01/01`;
  // @computed get getEndDate () {
  //   return (
  //     // No Forecast
  //     // if (isBefore(this.endDate, new Date())) {
  //     //   const endDatePlusFiveDays = addDays(this.endDate, 5);
  //     //   this.endDate = format(endDatePlusFiveDays, 'MM/DD/YYYY');
  //     // }
  //     format(this.startDate, 'MM/DD/YYYY')
  //   )
  // }

  // stage -----------------------------------------------------------------------
  @observable stage = {};
  @computed get getStage() {return this.stage}
  @action updateStage = d => this.stage = d;

  // ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action updateACISData = d => this.ACISData = d;
  @computed get getDate() {
    const days = this.ACISData.map(e => e[0])
    return days.map(e => format(e, 'MMM D'))
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
}
