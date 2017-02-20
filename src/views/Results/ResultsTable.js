import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { format } from 'date-fns';

@inject('store')
@observer
export default class ResultsTable extends Component {
  render() {
    const {
      pest,
      ACISData,
      degreeDay,
      cumulativeDegreeDay
    } = this.props.store.app;
    return (
      <div className="columns">
        <div className="column has-text-centered">
          <table className="table is-bordered is-striped is-narrow">
            <thead className="t-header">
              <tr>
                <th />
                <th className="before">Past</th>
                <th className="before">Past</th>
                <th className="before">Current</th>
                <th className="after" colSpan="5"> Ensuing 5 Days </th>
              </tr>
              <tr>
                <th />
                <th className="before">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 8][0], 'MMM D')}
                </th>
                <th className="before">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 7][0], 'MMM D')}
                </th>
                <th className="before">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 6][0], 'MMM D')}
                </th>
                <th className="after">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 5][0], 'MMM D')}
                </th>
                <th className="after">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 4][0], 'MMM D')}
                </th>
                <th className="after">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 3][0], 'MMM D')}
                </th>
                <th className="after">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 2][0], 'MMM D')}
                </th>
                <th className="after">
                  {!ACISData
                    ? ''
                    : format(ACISData[ACISData.length - 1][0], 'MMM D')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Daily Degree Days (Base {pest.baseTemp}BE)</th>
                <td>{degreeDay[degreeDay.length - 8]}</td>
                <td>{degreeDay[degreeDay.length - 7]}</td>
                <td>{degreeDay[degreeDay.length - 6]}</td>
                <td>{degreeDay[degreeDay.length - 5]}</td>
                <td>{degreeDay[degreeDay.length - 4]}</td>
                <td>{degreeDay[degreeDay.length - 3]}</td>
                <td>{degreeDay[degreeDay.length - 2]}</td>
                <td>{degreeDay[degreeDay.length - 1]}</td>
              </tr>
              <tr>
                <th>Accumulation since January 1st</th>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 8]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 7]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 6]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 5]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 4]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 3]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 2]}</td>
                <td>{cumulativeDegreeDay[cumulativeDegreeDay.length - 1]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
