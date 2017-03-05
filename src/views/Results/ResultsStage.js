import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import { action, computed} from 'mobx'

@inject('store') @observer
export default class ResultsHeader extends Component {

  @action setStage = (e) => {
    const { pest } = this.props.store.app
    const selectedStage = pest.preBiofix.filter(stage => stage.stage === e.target.value)[0]
    this.props.store.app.updateStage(selectedStage)
  }

  @computed get getStageList() {
    const { pest } = this.props.store.app
    if (Object.keys(pest).length !== 0) {
      return pest.preBiofix.map(stage =>
        <option key={stage.id}>{stage.stage}</option>)
    }
  }

  @computed get getStageToDisplay() {
    const {getCumulativeDegreeDay, pest} = this.props.store.app
    if (getCumulativeDegreeDay.length > 0 && pest.preBiofix.length > 0) {
      const currentDegreeDayValue = getCumulativeDegreeDay[getCumulativeDegreeDay.length - 6]
      const selectedStage = pest.preBiofix.filter(stage => (currentDegreeDayValue > stage.ddlo && currentDegreeDayValue < stage.ddhi))[0]
      return selectedStage
    }
    return null
  }

  render() {
    // const {stage} = this.props.store.app
    const stage = this.getStageToDisplay;
    // console.log(toJS(stage))
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
                  value={stage ? stage.stage : 'No Stages'}
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
                  <th className="stageHeader">Pest Status</th>
                  <th className="stageHeader">Pest Management</th>
                </tr>
              </thead>
              <tbody>

                  <tr>
                    <td className="has-text-centered">{stage ? stage.management : 'Not available'}</td>
                    <td className="has-text-centered">{stage ? stage.status : 'Not available'}</td>
                  </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
