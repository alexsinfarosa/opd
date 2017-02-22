import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {format, subDays} from 'date-fns'

@inject('store') @observer
export default class ResultsHeader extends Component {
  render() {
    const {pest, station, startDate, endDate, getCumulativeDegreeDay} = this.props.store.app
    const displayEndDate = format(subDays(endDate, 5), 'MM/DD/YYYY')
    return (
      <div className="columns">
        <div className="column has-text-centered">
          <h1 className="title is-4">
            <strong>{pest.informalName}</strong> Results for <strong>{station.name}</strong>
          </h1>
          <h2 className="subtitle is-6">
            Accumulated Degree Days (<strong>{pest.baseTemp}°F</strong>) <strong>{startDate}</strong> through <strong>{displayEndDate}</strong>: <strong>{getCumulativeDegreeDay[getCumulativeDegreeDay.length - 6]}</strong> (0 days missing)
          </h2>
        </div>
      </div>
    )
  }
}
