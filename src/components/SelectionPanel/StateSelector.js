import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import mobx, {action} from 'mobx';
import views from 'config/views';
import {states} from '../../utils'

@inject('store') @observer
class StateSelector extends Component {
  constructor(props) {
    super(props)

    this.states = states
  }

  @action setState = (e) => {
    const selectedState = this.states.filter(state => state.name === e.target.value)
    this.props.store.app.state = selectedState[0]
    this.props.store.app.addIconsToStations()
    this.props.store.router.goTo(views.map)
  }

  render () {
    console.log(mobx.toJS(this.props.store.app.state))
    const {state} = this.props.store.app
    const stateList = this.states.map(state =>
      <option key={state.postalCode}>{state.name}</option>)

    return (
      <div>
        <label className="label">Select a State:</label>
        <div className="control">
          <span className="select">
            <select
              value={state.name}
              onChange={this.setState}
            >
              <option>Select State</option>
              {stateList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default StateSelector;
