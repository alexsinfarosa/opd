import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

// styled-components
import {Select, Selector} from './styles'

@inject('store') @observer
class StationSelector extends Component {

  state = {
    isDisabled: false
  }

  handleChange = e => {
    this.setState({isDisabled: true})
    this.props.store.app.setStation(e.target.value)
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.station))

    const {getCurrentStateStations} = this.props.store.app
    const {isDisabled} = this.state

    const stationList = getCurrentStateStations.map(station => <option key={`${station.id} ${station.network}`}>{station.name}</option>)

    return (
      <Selector>
        <label>Wheater station:
          <span>{getCurrentStateStations.length}</span>
        </label>

        <Select
          name="station"
          value={this.props.store.app.station.name}
          onChange={this.handleChange}
        >
          {isDisabled ? null : <option>Select Station</option>}
          {stationList}
        </Select>
      </Selector>
    )
  }
}

export default StationSelector;
