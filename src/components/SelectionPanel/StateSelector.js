import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

// Utilities
import {states} from '../../utils'

// styled-components
import {Select, Selector} from './styles'

@inject('store') @observer
class StateSelector extends Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    isDisabled: false
  }

  handleChange = e => {
    this.setState({isDisabled: true})
    this.props.store.app.setState(e.target.value)
    this.context.router.push('/map')
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.state))
    const {isDisabled} = this.state

    const stateList = states.map(state =>
      <option key={state.postalCode}>{state.name}</option>
    )

    return (
      <Selector>
        <label>State:</label>
        <Select
          name="state"
          value={this.props.store.app.state.name}
          onChange={this.handleChange}
        >
          {isDisabled ? null : <option>Select State</option>}
          {stateList}
        </Select>
      </Selector>
    )
  }
}
export default StateSelector;
