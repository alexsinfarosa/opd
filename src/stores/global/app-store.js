import { observable, action, computed } from 'mobx';
import pestData from '../../../public/pestData.json';
import { states, matchIconsToStations } from '../../utils';
import { format, getYear, isBefore, addDays } from 'date-fns';
import _ from 'lodash';

class AppStore {
  // pest ------------------------------------------------------------------------
  @observable pests = pestData;
  @observable pest = {};
  @action setPest = e => {
    this.pest = this.pests.filter(pest => pest.informalName === e.target.value)[
      0
    ];
    localStorage.setItem('state', JSON.stringify(this.state));
  };

  // state -----------------------------------------------------------------------
  @observable state = {};
  @action updateState = e => {
    this.state = states.filter(state => state.name === e.target.value)[0];
    localStorage.setItem('state', JSON.stringify(this.state));
  };

  // stations --------------------------------------------------------------------
  @observable stations = [];
  @observable filteredStations = [];
  @action updateFilteredStations = () => {
    this.filteredStations = matchIconsToStations(this.stations, this.state);
  };
  @computed get getFilteredStations() {
    return this.stations.filter(
      station => station.state === this.state.postalCode
    );
  }
  @observable station = {};
  @action updateStation = e => {
    this.station = this.stations.filter(
      station => station.name === e.target.value
    )[0];
    localStorage.setItem('station', JSON.stringify(this.station));
  };

  // DATES -----------------------------------------------------------------------
  @observable startDate = '';
  @observable endDate = '';
  @action updateEndDate = e => {
    this.endDate = format(e, 'MM/DD/YYYY');
    this.startDate = `01/01/${getYear(this.endDate)}`;

    // No Forecast
    if (isBefore(this.endDate, new Date())) {
      const endDatePlusFiveDays = addDays(this.endDate, 5);
      this.endDate = format(endDatePlusFiveDays, 'MM/DD/YYYY');
    }
  };

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

export default AppStore;
