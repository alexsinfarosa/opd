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

  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    currentYear: format(new Date(), 'YYYY')
  };

  handleSubmit = (e) => {
    const {pest,state,station,getStartDate,endDate} = this.props.store.app
    e.preventDefault()
    this.props.store.app.setRpest(pest)
    this.props.store.app.setRstate(state)
    this.props.store.app.setRstation(station)
    this.props.store.app.setREndDate(endDate)
    this.props.store.app.setRStartDate(getStartDate)
    // console.log(toJS(this.props.store.app.pest.informalName))
    // console.log(toJS(this.props.store.app.state.name))
    // console.log(toJS(this.props.store.app.station.name))
    this.context.router.push('/results')

  }

  render() {
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
