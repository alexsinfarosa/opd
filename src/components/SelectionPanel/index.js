import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import views from 'config/views';
import { action, observable } from 'mobx'
import axios from "axios"

import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

import { avgString, temperatureAdjustment, michiganAdjustment } from '../../utils';

@inject('store') @observer
class SelectionPanel extends Component {

  @observable temperature = ''
  @observable id = ''

  @action getACISdata = () => {
    const { pest, station, endDate } = this.props.store.app
    const {router} = this.props.store
    const {store} = this.props


    // this.id = michiganAdjustment(station)
    // // Handling different temperature parameter for each network
    // if (station.network === 'newa' || station.network === 'icao' || station.network === 'njwx') {
    //   this.temperature = '23'
    // } else if (station.network === 'miwx' || station.network === 'cu_log') {
    //   this.temperature = '126'
    // }
    //
    // // Handling Michigan state network
    // if (station.state === 'MI' && station.network === 'miwx' && station.id.slice(0,3) === 'ew_') {
    //   // example: ew_ITH
    //   this.id = station.id.slice(3,6)
    // } else {
    //   this.id = station.id
    // }



    // Creating the object for the POST request
    const params = {
      sid: `${michiganAdjustment(station)} ${station.network}`,
      sdate: `${endDate.getFullYear()}-01-01`,
      edate: endDate.toISOString().split('T')[0],
      elems: temperatureAdjustment(station)
    }

    // Making the call to the API
    console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)
    return axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if(!res.data.hasOwnProperty('error')) {
          this.updateData(res.data.data)
          this.calculateDegreeDay(res.data.data)
          this.calculateStageToDisplay(pest)
          router.goTo(views.results, {id: 111}, store)
        } else {
          console.log(res.data.error)
        }
      })
      .catch(err => {
        console.log(err)
        this.updateData([])
      })
  }

  // Store the data that comes back from the server into the store
  @action updateData = (d) => {
    this.props.store.app.ACISData = d
  }

  @action calculateDegreeDay = (data) => {
    const { pest } = this.props.store.app

    // Creating an array only of hourly data
    const hourlyData = data.map(day => day[1])
    console.table(hourlyData)

    // Make the array one-dimension
    const hourlyDataFlat = [].concat(...hourlyData)

    console.log(`Missing values: ${hourlyDataFlat.filter(m => m === 'M').length}`)

    // Replace ONLY single non consecutive 'M' values
    const hourlyDataWithReplacedValuesFlat = hourlyDataFlat.map((val,i) => {
      if (i === 0 && val === 'M') {
        return hourlyDataFlat[i+1]
      } else if (i === (hourlyDataFlat.length - 1) && val === 'M') {
        return hourlyDataFlat[i-1]
      } else if (val === 'M' && hourlyDataFlat[i-1] !== 'M' && hourlyDataFlat[i+1] !== 'M') {
        console.log(i)
        console.log(hourlyDataFlat[i-1], hourlyDataFlat[i], hourlyDataFlat[i+1])
        return avgString(hourlyDataFlat[i-1], hourlyDataFlat[i+1])
      } else {
        return val
      }
    })

    // Replace consecutive M's values from sister station
    const missingValues = hourlyDataWithReplacedValuesFlat.filter(m => m === 'M')
    if(missingValues.length > 0) {
      console.log('There are multiple Ms')
      this.getSisterData(hourlyDataWithReplacedValuesFlat)
    }

    // Replace multiple consecutive 'M' values
    // const hourlyDataWithReplacedValuesFromSisterStationsFlat = hourlyDataWithReplacedValuesFlat.map((val,i) => {
    //     const hourlyDataSister = sisterData.map(day => day[1])
    //     const hourlDataSisterflat = [].concat(...hourlyDataSister)
    //     if(val === 'M' && hourlDataSisterflat[i] !== 'M') {
    //       return hourlDataSisterflat[i]
    //     } else if (val === 'M' && hourlDataSisterflat[i] === 'M') {
    //       // Return forecast values
    //       return '0'
    //     } else {
    //       return val
    //     }
    // })

    // Unflatten the hourly data arry with all 'M' values replaced
    const hourlyDataWithReplacedValues = []
      while(hourlyDataWithReplacedValuesFlat.length > 0) {
        hourlyDataWithReplacedValues.push(hourlyDataWithReplacedValuesFlat.splice(0,24))
    }

    console.table(hourlyDataWithReplacedValues)

    // Start creating variables to compute degree days
    const min = hourlyDataWithReplacedValues.map(day => Math.min(...day))
    const max = hourlyDataWithReplacedValues.map(day => Math.max(...day))
    const avg = min.map((val,i) => (Math.round((val + max[i])/2)))
    const base = pest.baseTemp
    const dd = avg.map(val => val-base > 0 ? val-base : 0)
    console.log(`Min: ${min}`)
    console.log(`Max: ${max}`)
    console.log(`Avg: ${avg}`)
    console.log(`DD: ${dd}`)
    this.props.store.app.degreeDay = dd
  }

  getSisterData = (data) => {
    const {id, network} = this.props.store.app.station
    return axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${id}/${network}`)
    .then(res => {
      const idAndNetwork = res.data.temp
      console.log(`Sister station id and network: ${idAndNetwork}`)
    })
    .catch(err => {
      console.log(err)
    })
  }

  // If there are stages chose the one where the current dd value is between ddlo and ddhi
  @action calculateStageToDisplay = (pest) => {
    const {cumulativeDegreeDay} = this.props.store.app
    const currentDegreeDayValue = cumulativeDegreeDay[cumulativeDegreeDay.length - 1]
    if (pest.preBiofix.length > 0) {
      const selectedStage = pest.preBiofix.filter(stage => (currentDegreeDayValue > stage.ddlo && currentDegreeDayValue < stage.ddhi))
      this.props.store.app.stage = selectedStage[0]
    }
  }

  render() {
    return (
      <div className='tile is-parent is-4'>
        <div className='tile is-child box'>
          <PestSelector />
          <br/>
          <StateSelector />
          <br/>
          <StationSelector />
          <br/>
          <DateSelector />
          <br/>
          <button className="button is-primary"
            onClick={this.getACISdata}
            >
              Calculate
          </button>
        </div>
      </div>
    )
  }
}

export default SelectionPanel;
