import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import { action, computed } from 'mobx'

@inject('store') @observer
export default class ResultsHeader extends Component {

  @action setStage = (e) => {
    const { pest } = this.props.store.app
    const selectedStage = pest.preBiofix.filter(stage => stage.stage === e.target.value)[0]
    this.props.store.app.stage = selectedStage
  }

  @computed get getStageList() {
    const { pest } = this.props.store.app
    if (Object.keys(pest).length !== 0) {
      return pest.preBiofix.map(stage =>
        <option key={stage.id}>{stage.stage}</option>)
    }
  }

  render() {
    const {stage} = this.props.store.app
    return (
      <div>
        <div className="columns">
          <div className="column has-text-centered">
            <div className="align-middle">
              <span style={{'marginRight': '10px','marginBottom': '4px'}}>
                <strong>Phenological Stage: </strong>
              </span>
              <span className="select">
                <select
                  onChange={this.setStage}
                  value={stage ? stage.stage : ''}
                >
                  <option>Select a stage</option>
                  {this.getStageList}
                </select>
              </span>
            </div>
            <p><small>The phenological stage above is estimated. Select the actual stage and the model will recalculate recommendations.</small></p>
          </div>
        </div>

        <div className="columns">
          <div className="column has-text-centered">
            <table className="table is-bordered is-striped">
              <thead>
                <tr>
                  <th>Pest Status</th>
                  <th>Pest Management</th>
                </tr>
              </thead>
              <tbody>
                {stage &&
                  <tr>
                    <td className="has-text-centered">{stage.management}</td>
                    <td className="has-text-centered">{stage.status}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
