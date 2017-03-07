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
    const {pest, state, station, endDate} = this.props.store.app

    // set the state for the results page
    this.props.store.app.setRpest(pest)
    this.props.store.app.setRstate(state)
    this.props.store.app.setRstation(station)
    this.props.store.app.setRendDate(endDate)

    this.run()
    // Go to Results Page
    this.context.router.push('/results')
  };

  getACISData () {
    const {pest, station, getStartDate} = this.props.store.app

    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: getStartDate,
      edate: format(addDays(this.props.store.app.rEndDate, 5), 'YYYY-MM-DD'),
      elems: networkTemperatureAdjustment(station.network)
    };
    return axios.post('http://data.test.rcc-acis.org/StnData', params)
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
        return acis
      }
      console.log(res.data.error)
    })
    .catch(err => {
      console.log(err)
    })
  }

  getSisterStationIdAndNetwork () {
    const {station} = this.props.store.app
    return axios(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`)
    .then(res => {
      return res.data.temp
    })
    .catch(err => {
      console.log(err)
    })
  }

  getSisterStationData (idAndNetwork) {
    const [id, network] = idAndNetwork.split(' ')
    const {getStartDate, rEndDate} = this.props.store.app

    const params = {
      sid: `${id} ${network}`,
      sdate: getStartDate,
      edate: rEndDate,
      elems: networkTemperatureAdjustment(network)
    };
    return axios.post('http://data.test.rcc-acis.org/StnData', params)
    .then(res => {
      
    })
    .catch(err => {
      console.log(err)
    })
  }

  async run () {
    const {station} = this.props.store.app
    try {
      const acis = await this.getACISData();
      console.log(acis)
      if (acis) {
        const idAndNetwork = await this.getSisterStationIdAndNetwork()
        const sisterdata = this.getSisterStationData(idAndNetwork)

      }
    } catch (e) {
      console.error(e);
    }
  }

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
