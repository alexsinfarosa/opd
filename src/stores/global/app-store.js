import {observable, action} from 'mobx';
import pestData from '../../../public/pestData.json';
// import moment from 'moment';

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

  // @observable ACISData = [
  //   [
  //     ['2017-01-01'],
  //     ['95','16','17','18','18','18','19','21','21','21','22','25','26','27','27','27','28','28','28','29','29','29','29','29']
  //   ],
  //   [
  //     ['2017-01-02'],
  //     ['99','23','24','25','26','26','27','27','28','28','28','28','28','28','29','29','30','31','32','32','32','32','30','29']
  //   ],
  //   [
  //     ['2017-01-03'],
  //     ['99','23','24','24','26','26','27','28','28','28','28','28','28','28','29','29','30','31','33','33','33','34','35','36']
  //   ]
  // ];

  @observable ACISData = [];

  @observable degreeDay = [];
  @observable cumulativeDegreeDays = [];

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
