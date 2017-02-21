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
  @observable endDate = new Date();
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
  @action updateStage = d => this.stage = d;

  // ACISData --------------------------------------------------------------------
  @observable ACISData = [];
  @action updateACISData = d => this.ACISData = d;
  @computed get displayMonth() {
    const days = this.ACISData.map(e => e[0])
    const formattedDays = _.takeRight(days, 8)
    return formattedDays.map(e => format(e, 'MMM D'))
  }

  // degreeDay -------------------------------------------------------------------
  @observable degreeDay = [];
  @action updateDegreeDay = d => this.degreeDay = d;
  @computed get cumulativeDegreeDay() {
    const results = [];
    this.degreeDay.reduce((prev, curr, i) => results[i] = prev + curr, 0);
    return results;
  }
  @computed get cumulativeDegreeDayDataGraph() {
    console.log(this.ACISData.length)
    console.log(this.cumulativeDegreeDay.length)
    const arr = []
    this.ACISData.forEach((e,i) => {
      const newObj = {}
      newObj['Date'] = format(this.ACISData[i][0], 'MMM D')
      newObj['Accumulated Degree-Days'] = this.cumulativeDegreeDay[i]
      arr.push(newObj)
    })
    return arr
  }

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
