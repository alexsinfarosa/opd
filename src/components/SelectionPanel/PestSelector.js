import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {action} from 'mobx';

@inject('store') @observer
class PestSelector extends Component {

  @action setPest = (e) => {
    const {pests} = this.props.store.app
    const selectedPest = pests.filter(pest => pest.informalName === e.target.value)
    this.props.store.app.pest = selectedPest[0]
  }

  render () {
    // console.log(mobx.toJS(this.props.store.app.pest))
    const {pests, pest} = this.props.store.app;
    const pestList = pests.map(pest => <option key={pest.id}>{pest.informalName}</option>)

    return (
      <div>
        <label className="label">Select a Pest:</label>
        <div className="control">
          <span className="select">
            <select
              value={pest.informalName}
              onChange={this.setPest}
            >
              <option>Select Pest</option>
              {pestList}
            </select>
          </span>
        </div>
      </div>
    )
  }
}

export default PestSelector;
