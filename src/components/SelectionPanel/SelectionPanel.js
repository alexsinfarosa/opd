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
  temperatureAdjustment,
  michiganAdjustment,
  reduceArrayToOneDimension,
  unflattenArray,
  calculateDegreeDay,
  replacingOneMissingValue
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
    const hourlyDataFlat = reduceArrayToOneDimension(data)

    console.log('Original data:')
    console.log(hourlyDataFlat)
    console.info(`ALL Missing values: ${hourlyDataFlat.filter(m => m === 'M').length}`)

    // Replace ONLY single non consecutive 'M' values
    let hourlyDataWithReplacedValuesFlat = replacingOneMissingValue(hourlyDataFlat)

    // Replace consecutive M's values with values from sister station
    const missingValues = hourlyDataWithReplacedValuesFlat.filter(e => e === 'M')
    console.info(`ONLY consecutive M values: ${missingValues.length}`)
    console.log('after replacing single M')
    console.log(hourlyDataWithReplacedValuesFlat)
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
            elems: temperatureAdjustment(station.network)
          }

          // Making the call to the API
          console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)


          // Request the new data from sister station
          axios.post("http://data.test.rcc-acis.org/StnData", params)
            .then(res => {
              if(!res.data.hasOwnProperty('error')) {
                const sisterStationHourlyDataFlat = reduceArrayToOneDimension(res.data.data)
                console.log('from sister')
                console.log(sisterStationHourlyDataFlat)
                console.log('replaced')

                hourlyDataWithReplacedValuesFlat = this.replaceConsecutiveMValues(sisterStationHourlyDataFlat, hourlyDataWithReplacedValuesFlat)
                console.log(hourlyDataWithReplacedValuesFlat)
                const hourlyDataWithReplacedValues = unflattenArray(hourlyDataWithReplacedValuesFlat)
                this.props.store.app.updateDegreeDay(calculateDegreeDay(pest, hourlyDataWithReplacedValues))
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

  replaceConsecutiveMValues(sister, current) {
    const tempArr = []
    current.forEach((e, i) => {
    	if(e === 'M') {
    		tempArr.push(sister[i])
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
