import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

@inject('store') @observer
class PestSelector extends Component {

    componentDidMount() {
      const pest = JSON.parse(localStorage.getItem('pest'))
      if (pest) {
        this.setState({pest})
      }
    }

    state = {
      pest: '',
      isDisabled: false
    }

    handleChange = e => {
      this.setState({pest: e.target.value})
      localStorage.setItem('pest', JSON.stringify(e.target.value));
      this.setState({isDisabled: true})
    }

  render () {
    // console.log(mobx.toJS(this.props.store.app.pest
    
    const {pests} = this.props.store.app;
    const pestList = pests.map(pest =>
      <option key={pest.id} value={pest.informalName}>{pest.informalName}</option>
    )

    let defaultOption = <option>Select Pest</option>
    if(this.state.isDisabled) {
      defaultOption = null
    }

    return (
      <div>
        <label className="label">Select a Pest:</label>
        <div className="control">
          <span className="select">
            <select
              autoFocus
              value={this.state.pest}
              onChange={this.handleChange}
            >
              {defaultOption}
              {pestList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default PestSelector;
