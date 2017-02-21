import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import views from 'config/views';
// import { toJS } from 'mobx'
import axios from "axios"
import {format} from 'date-fns'


import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

import {
  networkTemperatureAdjustment,
  michiganIdAdjustment,
  flattenArray,
  unflattenArray,
  calculateDegreeDay,
  replaceSingleMissingValues,
  replaceConsecutiveMissingValues
} from '../../utils';

@inject('store') @observer
class SelectionPanel extends Component {

  getACISdata = () => {
    const {pest, station, endDate, startDate} = this.props.store.app
    const {router} = this.props.store
    const {store} = this.props

    // Creating the object for the POST request
    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: format(startDate, 'YYYY-MM-DD'),
      edate: format(endDate, 'YYYY-MM-DD'),
      elems: networkTemperatureAdjustment(station.network)
    }

    // Making the call to the API
    console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)

    // POST request
    axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if(!res.data.hasOwnProperty('error')) {
          this.props.store.app.updateACISData(res.data.data)
          this.resultsValues(res.data.data)
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

  resultsValues = (data) => {
    const {pest, station, startDate, endDate} = this.props.store.app
    const hourlyDataFlat = flattenArray(data)

    console.info(`ALL Missing values: ${hourlyDataFlat.filter(m => m === 'M').length}`)

    // Replace ONLY single non consecutive 'M' values
    let hourlyDataWithReplacedValuesFlat = replaceSingleMissingValues(hourlyDataFlat)

    // Replace consecutive M's values with values from sister station
    const missingValues = hourlyDataWithReplacedValuesFlat.filter(e => e === 'M')
    console.info(`ONLY consecutive M values: ${missingValues.length}`)
    if(missingValues.length > 0) {

        // GET sister station
        return axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`)
        .then(res => {
          const idAndNetwork = res.data.temp.split(' ')
          return idAndNetwork
        })
        .then(res => {
          const params = {
            sid: `${res[0]} ${res[1]}`,
            sdate: format(startDate, 'YYYY-MM-DD'),
            edate: format(endDate, 'YYYY-MM-DD'),
            elems: networkTemperatureAdjustment(res[1])
          }

          // Making the call to the API
          console.log(`Sister POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)


          // Request the new data from sister station
          axios.post("http://data.test.rcc-acis.org/StnData", params)
            .then(res => {
              if(!res.data.hasOwnProperty('error')) {
                const sisterStationHourlyDataFlat = flattenArray(res.data.data)
                console.log(`Sister station missing total values: ${sisterStationHourlyDataFlat.filter(e=>e==='M').length}`)

                hourlyDataWithReplacedValuesFlat = replaceConsecutiveMissingValues(sisterStationHourlyDataFlat, hourlyDataWithReplacedValuesFlat)
                console.log(`After replacing consecutive missing values: ${hourlyDataWithReplacedValuesFlat.filter(e=>e==='M').length}`)
                const hourlyDataWithReplacedValues = unflattenArray(hourlyDataWithReplacedValuesFlat)
                this.props.store.app.updateDegreeDay(calculateDegreeDay(pest, hourlyDataWithReplacedValues))
                this.calculateStageToDisplay(pest)
              } else {
                console.log(res.data.error)
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }

    // Unflatten the hourly data arry with all 'M' values replaced
    const hourlyDataWithReplacedValues = unflattenArray(hourlyDataWithReplacedValuesFlat)

    // Update store with replaced values
    this.props.store.app.updateDegreeDay(calculateDegreeDay(pest, hourlyDataWithReplacedValues))
  }

  // If there are stages chose the one where the current dd value is between ddlo and ddhi
  calculateStageToDisplay = (pest) => {
    const {cumulativeDegreeDay} = this.props.store.app
    const currentDegreeDayValue = cumulativeDegreeDay[cumulativeDegreeDay.length - 1]
    if (pest.preBiofix.length > 0) {
      const selectedStage = pest.preBiofix.filter(stage => (currentDegreeDayValue > stage.ddlo && currentDegreeDayValue < stage.ddhi))
      this.props.store.app.updateStage(selectedStage[0])
    } else {
      this.props.store.app.updateStage({})
    }
  }

  render() {
    const {getAllRequiredFields} = this.props.store.app
    return (
      <div className='box'>
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
    )
  }
}

export default SelectionPanel;
