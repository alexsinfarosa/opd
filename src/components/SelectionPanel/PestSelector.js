import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

// styled-components
import {Select, Selector} from './styles'

@inject('store') @observer
class PestSelector extends Component {

    componentDidMount() {
      const pest = JSON.parse(localStorage.getItem('pest'))
      if (pest) {
        this.props.store.app.setPest(pest)
        this.setState({pest})
      }
    }

    state = {
      pest: '',
      isDisabled: false
    }

    handleChange = e => {
      this.setState({pest: e.target.value})
      this.setState({isDisabled: true})
      this.props.localPest(e.target.value)
      localStorage.setItem('pest', JSON.stringify(e.target.value));
    }

  render () {
    // console.log(mobx.toJS(this.props.store.app.pest

    const {pests} = this.props.store.app;
    const pestList = pests.map(pest =>
      <option key={pest.id} value={pest.informalName}>{pest.informalName}</option>
    )

    let defaultOption = <option>Select Pest</option>
    if(this.state.isDisabled || this.state.pest !== '') {
      defaultOption = null
    }

    return (
      <Selector>
        <label>Select a Pest:</label>
        <Select
          autoFocus
          value={this.state.pest}
          onChange={this.handleChange}
        >
          {defaultOption}
          {pestList}
        </Select>
      </Selector>
    )
  }
}

export default PestSelector;
