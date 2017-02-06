import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import mobx, {action, computed} from 'mobx';

@inject('store') @observer
class StationSelector extends Component {

  @computed get filteredStations () {
    const { stations, state } = this.props.store.app
    return stations.filter(station => station.state === state.postalCode)
  }

  @action setStation = (e) => {
    const {stations} = this.props.store.app
    const selectedStation = stations.filter(station => station.name === e.target.value)
    this.props.store.app.station = selectedStation[0]
  }

  render () {
    console.log(mobx.toJS(this.props.store.app.station))
    const {station} = this.props.store.app

    const stationList = this.filteredStations.map(station => <option key={`${station.id} ${station.network}`}>{station.name}</option>)

    return (
      <div>
        <label className="label">Select a Station: <span className="primary-color">{this.filteredStations.length}</span></label>
        <div className="control">
          <span className="select">
            <select
              value={station.name}
              onChange={this.setStation}
            >
              <option>Select Station</option>
              {stationList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default StationSelector;
