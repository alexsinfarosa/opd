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

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem('state'))
    if (state) {
      this.props.store.app.setState(state)
      this.setState({state})
    }
  }

  state = {
    state: '',
    isDisabled: false
  }

  handleChange = e => {
    this.setState({isDisabled: true})
    this.props.store.app.setState(e.target.value)
    this.context.router.push('/map')
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.state))

    const stateList = states.map(state =>
      <option key={state.postalCode}>{state.name}</option>
    )

    let defaultOption = <option>Select State</option>
    if(this.state.isDisabled || this.state.state !== '') {
      defaultOption = null
    }

    return (
      <Selector>
        <label>Select a State:</label>
        <Select
          value={this.props.store.app.state.name}
          onChange={this.handleChange}
        >
          {defaultOption}
          {stateList}
        </Select>
      </Selector>
    )
  }
}
export default StateSelector;
