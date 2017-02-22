import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ResultsGraph from './ResultsGraph';
import _ from 'lodash';

@inject('store')
@observer
export default class ResultsTable extends Component {

  state = {
    isGraphDisplayed: false
  }

  handleGraphClick = () => {
   this.setState(prevState => ({
     isGraphDisplayed: !prevState.isGraphDisplayed
   }));
 }

  render() {
    const {
      pest,
      getCumulativeDegreeDay,
      getDate,
      getDegreeDay
    } = this.props.store.app;

    const displayMonths = getDate.map(date => <th key={date} className="before">{date}</th>)
    const displayDegreeDay = getDegreeDay.map((dd,i) => <td key={i}>{dd}</td>)
    const displayCumulativeDegreeDay = getCumulativeDegreeDay.map((cdd,i) => <td key={i}>{cdd}</td>)

    return (
      <div className="columns">
        <div className="column has-text-centered">
          <table className="table is-bordered is-striped is-narrow">
            <thead className="t-header">
              <tr>
                <th rowSpan="2"/>
                <th className="before">Past</th>
                <th className="before">Past</th>
                <th className="before">Current</th>
                <th className="after" colSpan="5"> Ensuing 5 Days </th>
              </tr>
              <tr className="has-text-centered">
                {_.takeRight(displayMonths, 8)}
              </tr>
            </thead>
            <tbody>
              <tr className="has-text-centered">
                <th>Daily Degree Days (Base {pest.baseTemp}BE)</th>
                {_.takeRight(displayDegreeDay, 8)}
              </tr>
              <tr className="has-text-centered">
                <th>Accumulation since January 1st</th>
                {_.takeRight(displayCumulativeDegreeDay, 8)}
              </tr>
              <tr>
                <td className="has-text-centered" colSpan="9">
                  <a style={{marginTop: '5px', marginBottom: '5px'}}
                    className="button is-info is-outlined"
                    onClick={this.handleGraphClick}>
                    {this.state.isGraphDisplayed ? 'Hide' : 'Show'} Accumulated Degree-Days Graph
                  </a>

                  {this.state.isGraphDisplayed && <ResultsGraph />}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
