import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import views from 'config/views';
import { action, observable } from 'mobx'
import axios from "axios"

import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

import { avgString } from '../../utils';

@inject('store') @observer
class SelectionPanel extends Component {

  @observable temperature = ''
  @observable id = ''

  @action getACISdata = () => {
    const { pest, cumulativeDegreeDay, station, endDate } = this.props.store.app
    const {router} = this.props.store
    const {store} = this.props

    if (station.network === 'newa' || station.network === 'icao' || station.network === 'njwx') {
      this.temperature = '23'
    } else if (station.network === 'miwx' || station.network === 'cu_log') {
      this.temperature = '126'
    }

    if (station.state === 'MI' && station.network === 'miwx') {
      // example: ew_ITH
      this.id = station.id.slice(3,6)
    } else {
      this.id = station.id
    }

    const params = {
      sid: `${this.id} ${station.network}`,
      sdate: `${endDate.getFullYear()}-01-01`,
      edate: endDate.toISOString().split('T')[0],
      elems: this.temperature
    }

    console.log(`Post Request with following values: ${params.sid}, ${params.sdate}, ${params.edate}, ${params.elems}`)
    return axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        this.updateData(res.data.data)
        this.calculateDegreeDay(res.data.data)
        this.calculateStageToDisplay(pest, cumulativeDegreeDay)
        router.goTo(views.results, {id: 111}, store)
      })
      .catch(err => {
        console.log(err)
        this.updateData([])
      })
  }

  @action updateData = (d) => {
    this.props.store.app.ACISData = d
  }

  @action calculateDegreeDay = (data) => {

    // Creating an array only of hourly data
    const hourlyData = data.map(day => day[1])
    // console.table(hourlyData)

    // Make the array one-dimension
    const hourlyDataFlat = [].concat(...hourlyData)

    // Replace ONLY single non consecutive 'M' values
    const hourlyDataWithReplacedValuesFlat = hourlyDataFlat.map((val,i) => {
      if (i === 0 && val === 'M') {
        return hourlyDataFlat[i+1]
      } else if (i === (hourlyDataFlat.length - 1) && val === 'M') {
        return hourlyDataFlat[i-1]
      } else if (val === 'M' && hourlyDataFlat[i-1] !== 'M' && hourlyDataFlat[i+1] !== 'M') {
        return avgString(hourlyDataFlat[i-1], hourlyDataFlat[i+1])
      } else {
        return val
      }
    })

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
    const base = 50
    const dd = avg.map(val => val-base > 0 ? val-base : 0)
    console.log(`Min: ${min}`)
    console.log(`Max: ${max}`)
    console.log(`Avg: ${avg}`)
    console.log(`DD: ${dd}`)
    this.props.store.app.degreeDay = dd
  }

  // If there are stages chose the one where the current dd value is between ddlo and ddhi
  @action calculateStageToDisplay = (pest) => {
    const {cumulativeDegreeDay} = this.props.store.app
    const lastIndex = cumulativeDegreeDay[cumulativeDegreeDay.length - 1]
    if (pest.preBiofix.length > 0) {
      const selectedStage = pest.preBiofix.filter(stage => (lastIndex > stage.ddlo && lastIndex < stage.ddhi))

      console.log(selectedStage[0])
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
