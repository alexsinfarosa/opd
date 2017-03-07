import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { format, addDays } from 'date-fns';
// import { toJS } from 'mobx'

// Components
import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

// styled-components
import {Selector, CalculateBtn} from '../SelectionPanel/styles'

// styles
import './DateSelector.css'

// utility functions
import {
  networkTemperatureAdjustment,
  michiganIdAdjustment,
  flattenArray,
  unflattenArray,
  calculateDegreeDay,
  replaceSingleMissingValues,
  replaceConsecutiveMissingValues,
  // weightedAverage,
  calculateMissingValues
} from '../../utils';


@inject('store')
@observer
class SelectionPanel extends Component {

  static contextTypes = {
    router: React.PropTypes.object
  };

  state = {
    currentYear: format(new Date(), 'YYYY'),
    isDisabled: true
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const {pest, state, station, getStartDate, endDate, rEndDate} = this.props.store.app

    // set the state for the results page
    this.props.store.app.setRpest(pest)
    this.props.store.app.setRstate(state)
    this.props.store.app.setRstation(station)
    this.props.store.app.setRendDate(endDate)

    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: getStartDate,
      edate: format(addDays(this.props.store.app.rEndDate, 5), 'YYYY-MM-DD'),
      elems: networkTemperatureAdjustment(station.network)
    };

    console.log(params)

    const getACISData = () => axios.post('http://data.test.rcc-acis.org/StnData', params)
    const getSisterStationIDAndNetwork = () => axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`)
    const getSisterStationData = () => axios.post('http://data.test.rcc-acis.org/StnData', params)
    const getForecastData = () => axios.get(`http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${getStartDate}/${rEndDate}`)

    getACISData()
    .then(res => {
      if(!res.data.hasOwnProperty('error')) {
        const acisFlat = flattenArray(res.data.data)
        const acis = replaceSingleMissingValues(acisFlat);
        if (acis.filter(e => e === 'M').length === 0) {
          this.props.store.app.updateDegreeDay(
            calculateDegreeDay(pest, unflattenArray(acis))
          );
          return;
        }
        // There are missing values. Get sister id and network
        return Promise.all([getSisterStationIDAndNetwork(), acis])
      }
      console.log(res.data.error)
    })
    .then((res, acis) => {
      console.log('inside get sister station')
      // Get sister station Id and network
      params.sid = res[0].data.temp
      console.log(params)
      return Promise.all([getSisterStationData(), acis])
    })
    .then(([res, acis]) => {
      if(!res.data.hasOwnProperty('error')) {
        const sisterFlat = flattenArray(res.data.data)
        const acisSister = replaceConsecutiveMissingValues(sisterFlat, acis);

        // If not missing values
        if (acisSister.filter(e => e === 'M').length === 0) {
          this.props.store.app.updateDegreeDay(
            calculateDegreeDay(pest, unflattenArray(acisSister))
          );
          return;
        }
        // if missing values and current year go to forecast
        if(format(rEndDate, 'YYYY') === this.state.currentYear) {
          return Promise.all([getForecastData(), acisSister])
        } else {
          // if missing values and not current year
          const results = unflattenArray(acisSister)
          this.props.store.app.setMissingValue(calculateMissingValues(results))
        }
      }
      console.log(res.data.error)
    })
    .then(([res, acisSister]) => {
      if(!res.data.hasOwnProperty('error')) {
        const forecastFlat = flattenArray(res.data.data)
        const acisSisterForecast = replaceConsecutiveMissingValues(forecastFlat, acisSister);

        // If not missing values
        if (acisSisterForecast.filter(e => e === 'M').length === 0) {
          this.props.store.app.updateDegreeDay(
            calculateDegreeDay(pest, unflattenArray(acisSisterForecast))
          );
          return;
        }
        // if missing values
        const results = unflattenArray(acisSisterForecast)
        this.props.store.app.setMissingValue(calculateMissingValues(results))
      }
      console.log(res.data.error)
    })
    .catch(console.error)

    // Go to Results Page
    this.context.router.push('/results')
  };

  render() {
    const {getAllRequiredFields} = this.props.store.app
    return (
      <form onSubmit={this.handleSubmit}>
        <PestSelector />
        <br/>
        <StateSelector />
        <br/>
        <StationSelector />
        <br/>
        <DateSelector />
        <br/>
        <Selector>
          <CalculateBtn
            className={getAllRequiredFields ? 'noselect' : null}
            type="submit"
          >
            Calculate
          </CalculateBtn>
        </Selector>
      </form>
    );
  }
}

export default SelectionPanel;
