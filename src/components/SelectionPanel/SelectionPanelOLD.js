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
    const {station, endDate, startDate} = this.props.store.app
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
    console.log(`First POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)

    // POST request
    axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if(!res.data.hasOwnProperty('error')) {
          this.props.store.app.updateACISData(res.data.data)
          this.resultsValues(res.data.data)
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
    console.log(hourlyDataFlat)

    // Replace ONLY single non consecutive 'M' values
    let hourlyDataWithReplacedValuesFlat = replaceSingleMissingValues(hourlyDataFlat)
    // Replace consecutive M's values with values from sister station
    const missingValues = hourlyDataWithReplacedValuesFlat.filter(e => e === 'M')
    console.info(`ONLY consecutive M values: ${missingValues.length}`)
    if(missingValues.length > 0) {

        // GET sister station

        return axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`)

        // Get id and network of sister station
        .then(res => {
          const idAndNetwork = res.data.temp.split(' ')
          return idAndNetwork
        })

        // Post request to get data from sister station
        .then(res => {
          console.log(res)

          const params = {
            sid: `${res[0]} ${res[1]}`,
            sdate: format(startDate, 'YYYY-MM-DD'),
            edate: format(endDate, 'YYYY-MM-DD'),
            elems: networkTemperatureAdjustment(res[1])
          }

          // Making the call to the API
          console.log(`Sister POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)

          // Request the new data from sister station
          return axios.post("http://data.test.rcc-acis.org/StnData", params)
            .then(res => {
              if(!res.data.hasOwnProperty('error')) {
                const sisterStationHourlyDataFlat = flattenArray(res.data.data)
                console.log(`Sister station missing total values: ${sisterStationHourlyDataFlat.filter(e=>e==='M').length}`)
                console.log(sisterStationHourlyDataFlat)

                hourlyDataWithReplacedValuesFlat = replaceConsecutiveMissingValues(sisterStationHourlyDataFlat, hourlyDataWithReplacedValuesFlat)
                console.log(`Hourly data after replacing consecutive missing values: ${hourlyDataWithReplacedValuesFlat.filter(e=>e==='M').length}`)


                // const hourlyDataWithReplacedValues = unflattenArray(hourlyDataWithReplacedValuesFlat)
                // this.props.store.app.updateDegreeDay(calculateDegreeDay(pest, hourlyDataWithReplacedValues))
              } else {
                console.log(res.data.error)
              }
            })
            .catch(err => {
              console.log(err)
            })
          })

        // All Errors
        .catch(err => {
          console.log(err)
        })
    }

    console.log(hourlyDataWithReplacedValuesFlat.toString())

    // Unflatten the hourly data arry with all 'M' values replaced
    const hourlyDataWithReplacedValues = unflattenArray(hourlyDataWithReplacedValuesFlat)

    // Update store with replaced values
    this.props.store.app.updateDegreeDay(calculateDegreeDay(pest, hourlyDataWithReplacedValues))
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
