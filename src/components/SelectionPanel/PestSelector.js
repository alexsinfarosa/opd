import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import mobx from 'mobx';

@inject('store') @observer
class PestSelector extends Component {

  render () {
    // console.log(mobx.toJS(this.props.store.app.pest

    const {pests} = this.props.store.app;
    const pestList = pests.map(pest =>
      <option key={pest.id} value={pest.informalName}>{pest.informalName}</option>
    )

    return (
      <div>
        <label className="label">Select a Pest:</label>
        <div className="control">
          <span className="select">
            <select
              autoFocus
              value={this.props.store.app.pest.informalName}
              onChange={this.props.store.app.setPest}
              defaultValue="Select Pest"
            >
              <option disabled="disabled">Select Pest</option>
              {pestList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default PestSelector;
