import {observable, action, computed} from 'mobx';
import pestData from '../../../public/pestData.json';

class AppStore {
  @observable pests = pestData;
  @observable stations = [];
  @observable filteredStations = [];

  @observable pest = {};
  @observable state = {};
  @observable station = {};
  @observable startDate = '';
  @observable endDate = new Date();
  @observable stage = {};

  @observable ACISData = [];

  @observable degreeDay = [];
  // @observable cumulativeDegreeDay = [];

  @computed get cumulativeDegreeDay() {
    const results = []
    this.degreeDay.reduce((prev, curr, i) => results[i] = prev + curr, 0)
    return results
  }

  @computed get getFilteredStations () {
    // const { stations, state } = this.props.store.app
    return this.stations.filter(station => station.state === this.state.postalCode)
  }

  @action addIconsToStations = () => {
    const tempArr = []
    const newa = 'http://newa.nrcc.cornell.edu/gifs/newa_small.png'
    const newaGray = 'http://newa.nrcc.cornell.edu/gifs/newa_smallGray.png'
    const airport = 'http://newa.nrcc.cornell.edu/gifs/airport.png'
    const airportGray = 'http://newa.nrcc.cornell.edu/gifs/airportGray.png'
    const culog = 'http://newa.nrcc.cornell.edu/gifs/culog.png'
    const culogGray = 'http://newa.nrcc.cornell.edu/gifs/culogGray.png'

    this.stations.forEach(station => {
      if (station.network === "newa" || station.network === "njwx" || station.network === "miwx" || (station.network === "cu_log" && station.state !== "NY")) {
        const newObj = station
        station.state === this.state.postalCode || this.state.postalCode === "ALL" ? newObj['icon'] = newa : newObj['icon'] = newaGray;
        tempArr.push(newObj)
      } else if (station.network === "cu_log") {
        const newObj = station
        station.state === this.state.postalCode || this.state.postalCode === "ALL" ? newObj['icon'] = culog : newObj['icon'] = culogGray
        newObj['icon'] = culog
        tempArr.push(newObj)
      } else if (station.network === "icao") {
        const newObj = station
        station.state === this.state.postalCode || this.state.postalCode === "ALL" ? newObj['icon'] = airport : newObj['icon'] = airportGray
        tempArr.push(newObj)
      }
    })
    this.filteredStations = tempArr
  };

}

export default AppStore;
