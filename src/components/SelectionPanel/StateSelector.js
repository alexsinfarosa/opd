import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';
import views from 'config/views';
import {states} from '../../utils'

@inject('store') @observer
class StateSelector extends Component {

  submitToMap = (e) => {
    this.props.store.app.updateState(e)
    this.props.store.app.updateFilteredStations()
    this.props.store.router.goTo(views.map)
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.state))
    const stateList = states.map(state =>
      <option key={state.postalCode}>{state.name}</option>)
    return (
      <div>
        <label className="label">Select a State:</label>
        <div className="control">
          <span className="select">
            <select
              value={this.props.store.app.state.name}
              onChange={this.submitToMap}
              defaultValue="Select State"
            >
              <option disabled="disabled">Select State</option>
              {stateList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default StateSelector;
