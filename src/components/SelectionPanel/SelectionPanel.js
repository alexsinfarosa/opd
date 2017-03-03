import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import axios from 'axios';
// import { toJS } from 'mobx'
import { format } from 'date-fns';

// Components
import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

// styled-components
import {Selector, CalculateBtn} from '../SelectionPanel/styles'

@inject('store')
@observer
class SelectionPanel extends Component {

  state = {
    currentYear: format(new Date(), 'YYYY')
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const {pest, station} = this.state
    this.props.store.app.setPest(pest)
    this.props.store.app.setStation(station)

    // console.log(toJS(this.props.store.app.pest.informalName))
    // console.log(toJS(this.props.store.app.state.name))
    // console.log(toJS(this.props.store.app.station.name))
  }

  state = {
    pest: '',
    station: '',
    startDate: '',
    endDate: '',
  }

  handlePest = (d) => {
    this.setState({pest: d})
  }

  handleStation = (d) => {
    this.setState({station: d})
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <PestSelector localPest={this.handlePest}/>
        <br/>
        <StateSelector />
        <br/>
        <StationSelector localStation={this.handleStation}/>
        <br/>
        <DateSelector />
        <br/>
        <Selector>
          <CalculateBtn
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
