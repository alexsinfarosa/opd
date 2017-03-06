import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ResultsGraph from './ResultsGraph';
import _ from 'lodash';
import { format, isBefore, subDays } from 'date-fns';


// styles
import './results.css';

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
      rPest,
      getCumulativeDegreeDay,
      getDate,
      getDegreeDay
    } = this.props.store.app;

    const displayMonths = getDate.map(date => {
      if(isBefore(subDays(date,1), this.props.store.app.endDate, 'MMM d')) {
        return <th className="months before"key={date}>{format(date,'MMM D')}</th>
      } else {
        return <th className="months after"key={date}>{format(date,'MMM D')}</th>
      }
    })

    const displayDegreeDay = getDegreeDay.map((dd,i) => <td key={i}>{dd}</td>)
    const displayCumulativeDegreeDay = getCumulativeDegreeDay.map((cdd,i) => <td key={i}>{cdd}</td>)

    return (
      // <div>
          <table>
            <thead>
              <tr>
                <th rowSpan="1"/>
                <th className="before">Past</th>
                <th className="before">Past</th>
                <th className="before">Current</th>
                <th className="after" colSpan="5"> Ensuing 5 Days </th>
              </tr>
              <tr>
                <th>Date</th>
                {_.takeRight(displayMonths, 8)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Daily Degree Days <br/> (Base {rPest.baseTemp}BE)</th>
                {_.takeRight(displayDegreeDay, 8)}
              </tr>
              <tr>
                <th>Accumulation since <br/> January 1st</th>
                {_.takeRight(displayCumulativeDegreeDay, 8)}
              </tr>
              <tr>
                <td colSpan="9" className="has-text-centered graph">
                  <a
                    className="graph-link"
                    onClick={this.handleGraphClick}>
                    {this.state.isGraphDisplayed ? 'Hide' : 'Show'} Accumulated Degree-Days Graph
                  </a>

                  {this.state.isGraphDisplayed && <ResultsGraph />}
                </td>
              </tr>
            </tbody>
          </table>
      // </div>
    );
  }
}
