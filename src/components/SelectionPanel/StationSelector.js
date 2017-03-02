import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

// styled-components
import {Select, Selector} from './styles'

// Utilities
import {matchIconsToStations} from '../../utils'

@inject('store') @observer
class StationSelector extends Component {

  componentDidMount() {
    const station = JSON.parse(localStorage.getItem('station'))
    if (station) {
      this.setState({station})
    }
  }

  state = {
    station: '',
    isDisabled: false
  }

  handleChange = e => {
    const {stations, state} = this.props.store.app
    this.setState({station: e.target.value})
    this.setState({isDisabled: true})
    this.props.localStation(e.target.value)
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.station))

    const {getCurrentStateStations} = this.props.store.app

    const stationList = getCurrentStateStations.map(station => <option key={`${station.id} ${station.network}`}>{station.name}</option>)

    let defaultOption = <option>Select Station</option>
    if(this.state.isDisabled || this.state.station !== '') {
      defaultOption = null
    }

    return (
      <Selector>
        <label>Select a Station:
          <span>{getCurrentStateStations.length}</span>
        </label>

        <Select
          value={this.state.station}
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
