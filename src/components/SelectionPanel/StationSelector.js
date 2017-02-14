import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

@inject('store') @observer
class StationSelector extends Component {

  render () {
    // console.log(mobx.toJS(this.props.store.app.station))
    const {station, getFilteredStations} = this.props.store.app

    const stationList = getFilteredStations.map(station => <option key={`${station.id} ${station.network}`}>{station.name}</option>)

    return (
      <div>
        <label className="label">Select a Station: <span className="primary-color">{getFilteredStations.length}</span></label>
        <div className="control">
          <span className="select">
            <select
              value={station.name}
              onChange={this.props.store.app.updateStation}
              defaultValue="Select Station"
            >
              <option disabled="disabled">Select Station</option>
              {stationList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default StationSelector;
