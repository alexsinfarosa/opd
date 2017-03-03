import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

// styled-components
import {Select, Selector} from './styles'

@inject('store') @observer
class StationSelector extends Component {

  componentDidMount() {
    const station = JSON.parse(localStorage.getItem('station'))
    if (station) {
      this.props.store.app.setLocalStation(station)
    }
  }

  state = {
    isDisabled: false
  }

  handleChange = e => {
    this.setState({isDisabled: true})
    this.props.store.app.setLocalStation(e.target.value)
    this.props.localStation(e.target.value)
    localStorage.setItem('station', JSON.stringify(e.target.value));
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.station))

    const {getCurrentStateStations} = this.props.store.app

    const stationList = getCurrentStateStations.map(station => <option key={`${station.id} ${station.network}`}>{station.name}</option>)

    let defaultOption = <option>Select Station</option>
    if(this.state.isDisabled || this.props.store.app.localStation !== '') {
      defaultOption = null
    }

    return (
      <Selector>
        <label>Select a Station:
          <span>{getCurrentStateStations.length}</span>
        </label>

        <Select
          value={this.props.store.app.localStation}
          onChange={this.handleChange}
        >
          {defaultOption}
          {stationList}
        </Select>
      </Selector>
    )
  }
}

export default StationSelector;
