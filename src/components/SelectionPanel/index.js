import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import views from 'config/views';
// import { action } from 'mobx'
import axios from "axios"
import {format} from 'date-fns'


import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

import { avgString,
  temperatureAdjustment,
  michiganAdjustment,
  reduceArrayToOneDimension
} from '../../utils';

@inject('store') @observer
class SelectionPanel extends Component {

  getACISdata = () => {
    const {pest, station, endDate, startDate} = this.props.store.app
    const {router} = this.props.store
    const {store} = this.props

    // Creating the object for the POST request
    const params = {
      sid: `${michiganAdjustment(station)} ${station.network}`,
      sdate: format(startDate, 'YYYY-MM-DD'),
      edate: format(endDate, 'YYYY-MM-DD'),
      elems: temperatureAdjustment(station.network)
    }

    // Making the call to the API
    console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)
    return axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if(!res.data.hasOwnProperty('error')) {
          this.props.store.app.updateACISData(res.data.data)
          this.calculateDegreeDay(res.data.data)
          this.calculateStageToDisplay(pest)
          router.goTo(views.results, {id: 111}, store)
        } else {
          console.log(res.data.error)
        }
      })
      .catch(err => {
        console.log(err)
        this.props.store.app.updateACISData([])
      })
  }

  calculateDegreeDay = (data) => {
    const {pest, station} = this.props.store.app
    const hourlyDataFlat = reduceArrayToOneDimension(data)

    console.info(`ALL Missing values: ${hourlyDataFlat.filter(m => m === 'M').length}`)

    // Replace ONLY single non consecutive 'M' values
    let hourlyDataWithReplacedValuesFlat = hourlyDataFlat.map((val,i) => {
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

    // Replace consecutive M's values with values from sister station
    const missingValues = hourlyDataWithReplacedValuesFlat.filter(e => e === 'M')
    console.info(`ONLY consecutive M values: ${missingValues.length}`)
    if(missingValues.length > 0) {
      const idAndNetwork = this.requestSisterStation(station.id, station.network)
      console.log(idAndNetwork)
      const id = idAndNetwork[0]
      const network = idAndNetwork[1]
      hourlyDataWithReplacedValuesFlat = this.requestSisterData(hourlyDataWithReplacedValuesFlat, id, network)
    }

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
    console.info(`Min: ${min}`)
    console.info(`Max: ${max}`)
    console.info(`Avg: ${avg}`)
    console.info(`DD: ${dd}`)
    this.props.store.app.updateDegreeDay(dd)
  }

  requestSisterStation = (id, network) => {
    return axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${id}/${network}`)
    .then(res => {
      return res.data.temp.split(' ')
    })
    .catch(err => {
      console.log(err)
    })
  }

  requestSisterData = (currentStationData, id, network) => {
    const {startDate, endDate} = this.props.store.app

    // Creating the object for the POST request
    const params = {
      sid: `${id} ${network}`,
      sdate: format(startDate, 'YYYY-MM-DD'),
      edate: format(endDate, 'YYYY-MM-DD'),
      elems: temperatureAdjustment(network)
    }

    console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)

    return axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if(!res.data.hasOwnProperty('error')) {
          this.replaceConsecutiveMValues(res.data.data, currentStationData)
          return
        }
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }

  replaceConsecutiveMValues(sisterStationData, currentStationData) {
    const sisterStationHourlyDataFlat = reduceArrayToOneDimension(sisterStationData)
    console.log(sisterStationHourlyDataFlat)
    const tempArr = []
    currentStationData.forEach((e, i) => {
    	if(e === 'M') {
    		tempArr.push(sisterStationHourlyDataFlat[i])
    	} else {
    		tempArr.push(e)
    	}
    })
    return tempArr
  }

  // If there are stages chose the one where the current dd value is between ddlo and ddhi
  calculateStageToDisplay = (pest) => {
    const {cumulativeDegreeDay} = this.props.store.app
    const currentDegreeDayValue = cumulativeDegreeDay[cumulativeDegreeDay.length - 1]
    if (pest.preBiofix.length > 0) {
      const selectedStage = pest.preBiofix.filter(stage => (currentDegreeDayValue > stage.ddlo && currentDegreeDayValue < stage.ddhi))
      this.props.store.app.updateStage(selectedStage[0])
    }
  }

  render() {
    const {getAllRequiredFields} = this.props.store.app
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
          <button className={`button is-primary ${getAllRequiredFields ? 'is-disabled' : null}`}
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
