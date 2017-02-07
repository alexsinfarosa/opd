import {observable, action} from 'mobx';
import pestData from '../../../public/pestData.json';
// import moment from 'moment';

let fakeData = [
  [
    '2017-01-01',
    ['M','10','17','18','18','18','19','21','21','21','22','25','26','27','27','27','28','28','28','29','29','29','29','29']
  ],
  [
    '2017-01-02',
    ['100','5','24','25','26','26','27','27','28','28','28','28','28','28','29','29','30','31','32','32','32','32','30','M']
  ],
  [
    '2017-01-03',
    ['80','2','24','24','26','26','27','28','28','28','28','28','28','28','29','29','30','31','33','33','33','34','35','35']
  ],
  [
    '2017-01-04',
    ['160','4','33','22','26','26','27','28','28','28','28','28','28','28','29','29','30','31','33','33','33','34','35','32']
  ]
];

const avgString = (a, b) => {
  const aNum = parseFloat(a)
  const bNum = parseFloat(b)
  return (Math.round((aNum+bNum)/2)).toString()
}

const dd = () => {
  // Creating an array only of hourly data
  const hourlyData = fakeData.map(day => day[1])

  // Make the array one-dimension
  const hourlyDataFlat = [].concat(...hourlyData)

  const hourlyDataWithReplacedValuesFlat = hourlyDataFlat.map((val,i) => {

      // Replace ONLY single non consrcutive M's
      if (i === 0 && val === 'M') {
        return hourlyDataFlat[i+1]
      } else if (i === (hourlyDataFlat.length - 1) && val === 'M') {
        return hourlyDataFlat[i-1]
      } else if (val === 'M') {
        return avgString(hourlyDataFlat[i-1], hourlyDataFlat[i+1])
      } else {
        return val
      }

      // Replace multiple consecutive M's by calling sister stations
      if((i === 0 && val === 'M') && hourlyDataFlat[i+1] === 'M') {
        return
      } else if ((i === (hourlyDataFlat.length - 1) && val === 'M') && hourlyDataFlat[i-1] === 'M') {
        return
      } else if () {
        return 
      } else {
        return value
      }
  })

  // Un-flatten the hourly data arry
  const hourlyDataWithReplacedValues = []
  while(hourlyDataWithReplacedValuesFlat.length > 0) {
    hourlyDataWithReplacedValues.push(hourlyDataWithReplacedValuesFlat.splice(0,24))
  }

  console.log(hourlyDataWithReplacedValues)

  // Start creating variables to compute degree days
  const min = hourlyDataWithReplacedValues.map(day => Math.min(...day))
  const max = hourlyDataWithReplacedValues.map(day => Math.max(...day))
  const avg = min.map((val,i) => (Math.round((val + max[i])/2)))
  const base = 50
  const dd = avg.map(val => val-base > 0 ? val-base : 0)
  console.log(min,max,avg,dd)
  return dd
}

const cdd = () => {
  const tempArr = []
  dd().reduce((prev, curr, i) => tempArr[i] = prev + curr, 0)
  return tempArr
}

console.log(cdd())

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
