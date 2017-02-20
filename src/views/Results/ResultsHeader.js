import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'

@inject('store') @observer
export default class ResultsHeader extends Component {
  render() {
    const {pest, station, startDate, endDate, cumulativeDegreeDay} = this.props.store.app
    return (
      <div className="columns">
        <div className="column has-text-centered">
          <h1 className="title is-4">
            <strong>{pest.informalName}</strong> Results for <strong>{station.name}</strong>
          </h1>
          <h2 className="subtitle is-6">
            Accumulated Degree Days (<strong>{pest.baseTemp}°F</strong>) <strong>{startDate}</strong> through <strong>{endDate}</strong>: <strong>{cumulativeDegreeDay[cumulativeDegreeDay.length - 6]}</strong> (0 days missing)
          </h2>
        </div>
      </div>
    )
  }
}
